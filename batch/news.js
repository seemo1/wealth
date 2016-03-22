'use strict';

global.cassandraClient = {};
global.mysqlCentralPool = {};
global.mysqlCentralClient = {};

var newsWorker = {};
var Cassandra = require('cassandra-driver');
var cassandraConnect = require('../utils/cassandra-client');
var Promise = require('bluebird');
var newsProvider = {
  protocol: 'http',
  ip: '121.43.73.191',
  port: '8080',
};
var mysqlConnect = require('../utils/ltscentralmysql-client');
var TimeUuid = Cassandra.types.TimeUuid;
var posterId = 'fxmcn003';
var Wreck = require('wreck');
var cassCon = null;
var mysqlCon = null;
var _ = require('lodash');
var Moment = require('moment');

function getProviderAddress() {
  return newsProvider.protocol + '://' + newsProvider.ip + ':' + newsProvider.port;
}

function getCategory() {
  return new Promise(function(resolve, reject) {
    mysqlCentralClient.query('SELECT value FROM system_settings WHERE type=? AND key_code=?', ['Product', 'Name'], function(err, res) {
      if (err) {
        return reject(err);
      }

      var category = 0;
      if (res.length > 0) {
        var product = res[0].value;
        if (product.indexOf('Forex') > -1) {
          category = 0;
        } else if (product.indexOf('Futures') > -1) {
          category = 1;
        } else if (product.indexOf('Stock') > -1) {
          category = 2;
        }
      } else {
        category = 2; //general category (stock)
      }

      resolve(category);
    });
  });
}

newsWorker.update = function() {
  mysqlConnect.initial()
      .then(function(connection) {
        mysqlCon = connection;
        if (!mysqlCon) {
          console.error('Cannot establish mysql connection!');
          process.exit(1);
        }

        return cassandraConnect.initial();
      })
      .then(function(connection) {
        cassCon = connection;
        if (!cassCon) {
          console.error('Cannot establish cassandra connection!');
          process.exit(1);
        }

        return newsWorker.createTable();
      })
      .then(function() {
        return newsWorker.createIndex();
      })
      .then(function(res) {
        return getCategory();
      })
      .then(function(category) {
        return newsWorker.pull(category);
      })
      .then(function(res) {
        return newsWorker.parse(res);
      })
      .then(function(news) {
        return newsWorker.store(news);
      })
      .then(function() {
        process.exit();
      })
      .catch(function(err) {
        console.error(err);
        process.exit(1);
      });
};

newsWorker.pull = function(category) {
  return new Promise(function(resolve, reject) {
    var url = getProviderAddress() + '/news?category_id=' + category + '&pages=1';
    Wreck.get(url, {}, function(err, res, payload) {
      if (err) {
        reject(err);
        return;
      }

      var resString = new Buffer(payload).toString('utf8');
      resolve(JSON.parse(resString));
    });
  });
};

newsWorker.parse = function(news) {
  return new Promise(function(resolve, reject) {
    if (news) {
      if (_.size(news.result) < 0) {
        resolve([]);
        return;
      }

      resolve(news.result);
    }
  });

};

newsWorker.store = function(news) {
  return new Promise(function(resolve, reject) {
    if (_.isArray(news)) {
      Promise.mapSeries(news, newsWorker.saveToDb)
          .then(function() {
            resolve();
          })
          .catch(function(err) {
            reject(err);
          });
    } else {
      resolve();
    }
  });

};

newsWorker.saveToDb = function(news) {
  return new Promise(function(resolve, reject) {
    newsWorker.isNewsExist(news)
        .delay(10)
        .then(function(isExist) {
          if (!isExist) {
            //check whether the news has image
            if (news.hasOwnProperty('images')) {
              news.images = news.images[0];
            } else {
              news.images = '';
            }

            newsWorker.saveToTemp(news)
                .then(function() {
                  return newsWorker.saveToPost(news);
                })
                .then(function(post) {
                  return newsWorker.saveToPostUserFeed(post);
                })
                .then(function() {
                  resolve();
                })
                .catch(function(err) {
                  console.error(err);
                  reject(err);
                });
          } else {
            resolve();
          }
        })
        .catch(function(err) {
          reject(err);
        });
  });
};

newsWorker.saveToTemp = function(news) {
  return new Promise(function(resolve, reject) {
    var query = 'INSERT INTO news_temp (date, id, publish_time, image, tags, url) VALUES (?,?,?,?,?,?)';
    cassCon.execute(query, [Moment().format('YYYY-MM-DD').toString(), news.docid, news.date, news.images, news.tags, news.url], {prepare: true}, function(err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

newsWorker.saveToPost = function(news) {
  return new Promise(function(resolve, reject) {
    var post = {
      id: TimeUuid.now(),
      image: news.images,
      publishTime: new Date().getTime(),
      tag: news.tags,
      message: news.title + '\n' + news.url,
      userId: posterId,
    };
    var query = 'INSERT INTO post (post_id, img_url, publish_time, tag, msg, user_id) ' +
        'VALUES(?, ?, ?, ?, ?, ?)';
    var params = [post.id, post.image, post.publishTime, post.tag, post.message, post.userId];
    cassCon.execute(query, params, {prepare: true}, function(err, res) {
      if (err) {
        return reject(err);
      }

      console.log('Inserting into post', post.id);
      resolve(post);
    });
  });
};

newsWorker.getActiveUsers = function() {
  return new Promise(function(resolve, reject) {
    var query = 'SELECT USERID FROM USER_LAST_LOGIN where LOGINAT BETWEEN adddate(now(),-7) and now()';
    mysqlCon.query(query, [], function(err, res) {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
};

newsWorker.saveToPostUserFeed = function(post) {
  return new Promise(function(resolve, reject) {

    newsWorker.getActiveUsers()
        .then(function(res) {
          var userFeeds = [];
          _.forEach(res, function(r) {
            userFeeds.push({postId: post.id, userId: r.USERID});
          });

          Promise.mapSeries(userFeeds, newsWorker.insertPostUserFeed)
              .then(function(res) {
                console.log('DONE');
                resolve();
              })
              .catch(function(err) {
                console.error(err);
                reject(err);
              });
        })
        .catch(function(err) {
          reject(err);
        });
  });
};

newsWorker.insertPostUserFeed = function(userFeed) {
  return new Promise(function(resolve, reject) {
    var query = 'INSERT INTO post_user_feed (post_id, user_id) VALUES (?, ?);';
    console.log(userFeed);
    cassCon.execute(query, [userFeed.postId, userFeed.userId], {prepare: true}, function(err, res) {
      if (err) {
        console.error(err);
        return reject(err);
      }

      resolve();
      console.log('Inserting into post_user_feed', userFeed.userId);
    });
  }).delay(10);
};

newsWorker.isNewsExist = function(news) {
  return new Promise(function(resolve, reject) {
    var query = 'SELECT id FROM news_temp WHERE id = ?';
    console.log('Checking news existence', news.docid);
    cassCon.execute(query, [news.docid], {prepare: true}, function(err, res) {
      if (err) {
        reject(err);
        return;
      }

      var existingNews = null;
      if (res.rows.length > 0) {
        console.log('News already exist!', news.docid);
        existingNews = news;
      }

      resolve(existingNews);
    });
  });
};

newsWorker.createTable = function() {
  return new Promise(function(resolve, reject) {
    var query = 'CREATE TABLE IF NOT EXISTS news_temp ' +
        '(date text, id text, url text, publish_time timestamp, image text, tags text, ' +
        'PRIMARY KEY ((date), publish_time)) WITH CLUSTERING ORDER BY (publish_time DESC)';
    cassCon.execute(query, function(err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

newsWorker.createIndex = function() {
  return new Promise(function(resolve, reject) {
    var query = 'CREATE INDEX IF NOT EXISTS ON news_temp(id);';
    cassCon.execute(query, function(err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

newsWorker.update();
