/**
 * Created by Micah on 2015/06/08
 * node_modules/lab/bin/lab test/modules/social-module/post-v0-try.js -m 0 -e localcass
 */
'use strict';

//process.env["NODE_ENV"] = "genymotion";

//---- public libraries
var Util = require('util');
var Config = require('config');
var keyspace = Config.get('Cassandra.keyspace');
var Promise = require('bluebird');
var Lodash = require('lodash');
var Fs = require('fs');
var Cassandra = require('cassandra-driver');
var Uuid = Cassandra.types.Uuid;

//var id = Uuid.random();
var TimeUuid = Cassandra.types.TimeUuid;

//var id1 = TimeUuid.now();

//---- internal libraries
var cassandraClient = require('../../../utils/cassandra-client');
var mysqlCenterModel = require('../../../commonlib/mysql-center-common');

//var redisModel = require('../../../commonlib/redis-common');
var cassModel = require('../../../commonlib/cassandra-common');
var postModel = require('../../../modules/social-module/v0/post-model-v0');

var postController = require('../../../modules/social-module/v0/post-controller-v0');
var outfitUtil = require('../../../utils/outfit-util');

//var logger = require("../../../utils/logger");

//---- setup
var logTags = ['dev', 'postModel'];
var logMeta = {module: 'postTry'};
var logLevel = 'dev';

var logger = {};
logger.log = console.log;

var postTry = {};

postTry.fetchInTo1Column = function() {
  return new Promise(function(resolve, reject) {
    cassandraClient.connect(function(err) {
      if (err) {
        return reject(err);
      }

      return resolve(postModel.fetchInTo1Column({
        select: 'post_id',
        from: 'post_rel_users',
        where: {
          user_id: 'seemo',
          kind: 'like',
          post_id: [
              cassModel.assureTimeUuid('a5ca2ba1-19a0-11e5-84e9-d034f9f84dfd'),
              cassModel.assureTimeUuid('12b611b1-199d-11e5-ad9d-4e463c16320f'),
              cassModel.assureTimeUuid('cf9e1881-199e-11e5-817e-16449ca076cb'),
          ],
        },
      }));
    });
  });

};

postTry.deleteRelatives = function() {
  return new Promise(function(resolve, reject) {
    var post_id = cassModel.assureTimeUuid('a5ca2ba1-19a0-11e5-84e9-d034f9f84dfd');
    cassandraClient.connect(function(err) {
      if (err) {
        return reject(err);
      }

      return resolve(postModel.deletePostRelativesBatch(post_id));
    });
  });

};

postTry.selectThenDelete = function() {
  return new Promise(function(resolve, reject) {
    var joIn = {
      from: 'post_user_feed',
      where: {post_id: cassModel.assureTimeUuid('a8f21f95-19a0-11e5-8bc7-04d32a3e3c98')},
    };
    cassandraClient.connect(function(err) {
      if (err) {
        return reject(err);
      }

      return resolve(postModel.selectThenDelete(joIn));
    });
  });
};

postTry.getTablePK = function(table) {
  return new Promise(function(resolve, reject) {
    cassandraClient.connect(function(err) {
      cassandraClient.metadata.getTable(keyspace, table, function(err, tableMeta) {
        if (err) {
          return reject(err);
        }

        var aryPk = [];
        aryPk = aryPk.concat(Lodash.map(tableMeta.partitionKeys, 'name'));
        aryPk = aryPk.concat(Lodash.map(tableMeta.clusteringKeys, 'name'));
        return resolve(aryPk);
      });
    });
  });
};

postTry.tableMetadata = function(table) {
  return new Promise(function(resolve, reject) {
    var client = new Cassandra.Client({ contactPoints: ['127.0.0.1'] });
    client.connect(function(err, result) {
      if (err) {
        console.log('err', err);
        return;
      }

      console.log('Connected.');
      client.metadata.getTable('fdtsocial', table, function(err, tableMeta) {
        if (!err) {
          console.log('Table %j', tableMeta);
          console.log('tableMeta.partitionKeys', tableMeta.partitionKeys);
          console.log('tableMeta.clusteringKeys', tableMeta.clusteringKeys);
          tableMeta.columns.forEach(function(column) {
            console.log('Column %s with type %j', column.name, column.type);
          });

          var aryPk = [];
          aryPk = aryPk.concat(Lodash.map(tableMeta.partitionKeys, 'name'));
          aryPk = aryPk.concat(Lodash.map(tableMeta.clusteringKeys, 'name'));
          return resolve(aryPk);
        }

        return reject(err);
      });
    });

  });
};

postTry.insertSystemFeed = function() {
  var input = {language: 'TW',
      post_id: cassModel.genTimeUUid(), };
  return postModel.insertSystemFeed(input);
};

postTry.getIdMapRow = function() {
  //input = { select: [col1,...], from: 'tableName', where: 'id_column', in: [ id1, id2..] }
  var joUsers = { select: ['user_id', 'username', 'serving_url'],
                  from: 'user',
                  where: 'user_id',
                  inOrEq: ['seemo', 'micah', 'rayson', 'joe'], };
  var joCount = { select: '*',
                  from: 'by_post_count',
                  where: 'post_id',
                  inOrEq: [
                      '05d995c1-d1bb-11e4-bac4-01d7ba21bee5',
                      'aff3c742-14ea-11e5-8e97-353c9d6558f3',
                      'c304cd18-5701-4cc1-9894-12efdcdc2410',
                      'a2bd4222-1992-11e5-9e42-31bea60f1042',
                  ], };
  var joPost = { select: '*',
                  from: 'post',
                  where: 'post_id',
                  inOrEq: '49124a65-08ea-11e5-9381-9dc1bf8bc7d6', };
  return Promise.join(
      postModel.getIdMapRow(joUsers),
      postModel.getIdMapRow(joCount),
      postModel.getIdMapRow(joPost),
        function(mapUser, mapCount, mapPost) {
          console.log(mapUser);
          console.log(mapCount);
          console.log(mapPost);
          return 'all done';
        }
    );
};

postTry.postModelGetFollower = function() {
  return postModel.getFollower('seemo');
};

postTry.getFollower = function(done) {
  var tag = 'postTry_getFollower';
  var query = 'select follower_userid from following where following_userid=?';
  var aryValue = ['seemo'];

  mysqlCenterModel.select(tag, query, aryValue, function(err, result) {
    if (err) {
      outfitUtil.dumpError(err);
    } else {
      console.log('typeof result=', typeof result);
      var aryFollower = [];
      result.forEach(function(value) {
        aryFollower.push(value.follower_userid);
      });

      console.log(aryFollower);
    };

    done();
  });
};

postTry.get1ColumnArrayBy1 = function() {
  //input = { select: "columnName", from:"table", where: { colName1: value1, col2: value2 }
  //must assure the timeuuid or uuid before input
  var input = {
    select: 'user_id',
    from: 'group_member',
    where: 'group_id',
    eq: cassModel.assureUuid('2013265a-13fc-11e5-8fb3-b02e1d268e44'),
  };
  return postModel.get1ColumnArrayBy1(input);

};

postTry.get1ColumnArray = function() {
  //input = { select: "columnName", from:"table", where: { colName1: value1, col2: value2 }
  //must assure the timeuuid or uuid before input
  var input = {
    select: 'user_id',
    from: 'group_member',
    where: {
      group_id: cassModel.assureUuid('2013265a-13fc-11e5-8fb3-b02e1d268e44'),
      user_id: 'seemo',
    },
  };
  return postModel.get1ColumnArray(input);

};

postTry.getGroupMember = function() {
  return postModel.getGroupMember('2013265a-13fc-11e5-8fb3-b02e1d268e44');
};

postTry.uuid8timeUuid = function() {
  console.log('cassModel.assureTimeUuid(\'abcd\') = ', cassModel.assureTimeUuid('abcd'));
  console.log('cassModel.assureUuid(\'abcd\') = ', cassModel.assureUuid('abcd'));
  console.log('cassModel.assureTimeUuid(\'d3ee5df5-182c-11e5-9dee-51eeed1ba727\') =',
      cassModel.assureTimeUuid('d3ee5df5-182c-11e5-9dee-51eeed1ba727'));
  console.log('cassModel.assureUuid(\'d3ee5df5-182c-11e5-9dee-51eeed1ba727\') =',
      cassModel.assureUuid('d3ee5df5-182c-11e5-9dee-51eeed1ba727'));

  console.log('TimeUuid.fromDate(\'2015-01-01 18:00:00\')', TimeUuid.fromDate('2015-01-01 18:00:00'));
  console.log('TimeUuid.fromDate(Date.now())', TimeUuid.fromDate(Date.now()));
};

postTry.insPostUserFeed = function() {
  var input = { post_id: TimeUuid.now(), ary_user_id: ['micah', 'seemo', 'joe'] };
  return postModel.insertPostUserFeed(input);
};

/**
 * request.pre.body = { data: { msg, img_url,  mention_currencies, mention_userids, group_id, tag, status},
 *                      user: { Id: , }}
 * joUser = {username, serving_url, follower};
 */ 

postTry.selectOffsetHits01 = function(done) {
  var input = { offset: 22, hits: 3,
               query: 'select * from user_feeds where user_id = ?',
               params: ['seemo'], };

  //output = { pageState: pageState, rows: [ {}, {} ...] }

  console.log(logTags.concat('selectOffsetHits_input'), input);

  postModel.selectOffsetHits(input).then(function(result) {
    console.log(logTags.concat('selectOffsetHits_final_ok'), result);
    done();
  })
    .catch(function(err) {
      console.log(logTags.concat('selectOffsetHits_final_err'), err);
      done();
    });

};

postTry.postController_GetFeed = function(done) {
  var request = {
    pre: {
      body: {
        user: {
          Id: 'seemo',
        },
        data: {
          hits: 20,
          offset: 0,
        },
      },
    },
  };
  postController.getFeed(request, console.log);

}; //postController.getFeed;

postTry.postModel_getUserFeeds = function(done) {
  var input = { user_id: 'seemo', fetchSize: 4 };
  postModel.getUserFeeds(input)
    .then(function(resFeeds) {
      //console.log('resFeeds', resFeeds);
      //{ pageState: resFeeds.pageState, rows : resFeeds.rows}
      if (resFeeds.rows.length > 0) {
        return postModel.getPostsByPK(resFeeds.rows);
      } else {
        return Promise.reject('no feeds for user:' + input.user_id);
      };

    })
    .then(function(resPosts) {
      console.log('resPosts=', resPosts);
      done();
    })
    .catch(function(err) {
      console.log('err', err);
      throw err;
      done();
    });
};

//try postController.post
postTry.post = function(request, reply) {
  var joSavedTunePost;
  var joSavedPost;
  var joSavedUser;
  logMeta.task = 'postTry_post';
  logger.log(logLevel, request, logMeta);

  postController.saveImage(request)
    .then(function(fileUrl) {
      logMeta.task = 'postController.saveImage_fileUrl';
      logger.log(logLevel, fileUrl, logMeta);
      if (!fileUrl || (fileUrl == 'no_upload')) {
        request.pre.body.data.img_url = '';
        request.pre.body.data.img_size = '';
      } else {
        request.pre.body.data.img_url = fileUrl;
        request.pre.body.data.img_size = request.payload.img.length.toString();
      };

      //Todo: replace local version
      return getUserRedis(request.pre.body.user.Id);
    })
    .then(function(joUser) {
      logMeta.task = 'postTry.post_getUserRedis_joUser';
      logger.log(logLevel, joUser, logMeta);
      joSavedUser = joUser;
      return postController.parsePostRequest(request, joSavedUser);
    })
    .then(function(joTunePost) {
      logMeta.task = 'postTry.post_parsePostRequest_joTunePost';
      logger.log(logLevel, joTunePost, logMeta);
      joSavedTunePost = joTunePost;
      return postModel.savePostRelatives({
          joPost: joSavedTunePost,
          joUser: joSavedUser, });
    })
    .then(function(joPostRelatives) {
      logMeta.task = 'joPostRelatives';
      logger.log(logLevel, joPostRelatives, logMeta);
      if (Lodash.has(joPostRelatives, 'postData')) {
        var outData = {post: outfitUtil.convertFormat(joPostRelatives.postData, postController.postFormat0)};
        return reply(outfitUtil.endResult(null, outData));
      } else {
        return reply(outfitUtil.endResult('WSP003'));
      };
    })
    .catch(function(err) {
      logMeta.catch = 'postTry.post_catch';
      logger.log(logLevel, err, logMeta);
      outfitUtil.dumpError(err);
      return reply(outfitUtil.endResult(err));
    });

  /*
  Fs.writeFile(global.PROJECT_ROOT + '/upload/test.file', request.payload.img, function (err) {
      if (err) { return reply(err) };
      request.log(logTags.concat(['post']), outfitUtil.endResult(null, "write /upload/test.file successfully." ));
  });
  */

};

//fake : over-ride the controller version
function getUserRedis(userId) {
  return new Promise(function(resolve, reject) {
    logMeta.task = 'getUserRedis_userId';
    logger.log(logLevel, 'userId=' + userId, logMeta);
    return resolve({
      user_id: 'seemo',
      username: 'SEEMO',
      follower: 'rayson,micah,yuri',
      serving_url: 'http://usericon.com/seemo',
    });
  });
}
/**
 * request.pre.body = { data: { img_url,  mention_currencies, mention_userids, group_id, tag, status},
 *                      user: { Id: , }}
 * joUser = {username, serving_url, follower};
 */
postTry.makePost = function() {
  var request = {
    pre: {
      body: {},
    },
  };
  request.pre.body = {
    data: {
      msg: 'it is ' + Date(),
      mention_currencies: 'USDCHF.FX,USDJPY.FX',
      mention_userids: 'seemo,rayson,yuri,joe,micah',

      //groupid: Uuid.random(), //group message or not
      tag: '',
      status: '0',
    },
    user: {
      Id: 'seemo',
    },
  };
  var numberRecords = 5;
  var counter = {max: numberRecords, left: numberRecords, ok: 0, err:0, errors: []};
  logMeta.task = 'postTry.makePost';
  logger.log(logLevel, request, logMeta);
  var makePost = function() {
    return new Promise(function(resolve, reject) {
      postController.post(request, function(result) {
        return resolve(result);
      });
    });
  }; //makePost
  //return makePost();

  var aryPmPost = [];
  for (var ii = 0; ii < counter.max; ii++) {
    aryPmPost.push(makePost());
  }

  return Promise.settle(aryPmPost);
};

postTry.makeRepost = function() {
  var request = {
    pre: {
      body: {},
    },
  };
  request.pre.body = {
    data: {
      post_id: TimeUuid.fromString('ed483f15-1993-11e5-b509-3a8feb8a077f'),
      groupid: null,
    },
    user: {
      Id: 'seemo',
    },
  };
  var numberRecords = 2;
  var counter = {max: numberRecords, left: numberRecords, ok: 0, err:0, errors: []};
  logMeta.task = 'postTry.makeReost';
  logger.log(logLevel, request, logMeta);
  var makeRepost = function() {
    return new Promise(function(resolve, reject) {
      //use postTry or postController
      postController.repost(request, function(result) {
        return resolve(result);
      });
    });
  }; //makePost
  //return makePost();

  var aryPmPost = [];
  for (var ii = 0; ii < counter.max; ii++) {
    request.pre.body.data.groupid = Uuid.random();
    aryPmPost.push(makeRepost());
  }

  return Promise.settle(aryPmPost);
};

postTry.deletePost = function() {
  var request = {
    pre: {
      body: {
        data: {
          post_id: 'a85d1865-1828-11e5-bdb1-158e777600bd',
        },
        user: {
          Id: 'seemo',
        },
      },
    },
  };
  logMeta.task = 'postTry.deletePost';
  logger.log(logLevel, request, logMeta);

  return new Promise(function(resolve, reject) {
    //use postTry or postController
    postController.deletePost(request, function(result) {
      return resolve(result);
    });
  });
};

postTry.searchPost = function() {
  var request = {
    pre: {
      body: {},
    },
  };
  request.pre.body = {
    data: {
      keyword: 'USDJPY.FX',
    },
    user: {
      Id: 'seemo',
    },
  };
  logMeta.task = 'postTry.searchPost';
  logger.log(logLevel, request, logMeta);

  return new Promise(function(resolve, reject) {
    //use postTry or postController
    postController.searchPost(request, function(result) {
      return resolve(result);
    });
  });
};

postTry.getPostComments = function() {
  var request = {
    pre: {
      body: {},
    },
  };
  request.pre.body = {
    data: {
      post_id: TimeUuid.fromString('50fabc94-1809-11e5-b23a-b7d3588cc9be'),
    },
    user: {
      Id: 'seemo',
    },
  };
  logMeta.task = 'postTry.getPostComments';
  logger.log(logLevel, request, logMeta);
  var getPostComments = function() {
    return new Promise(function(resolve, reject) {
      //use postTry or postController
      postController.getPostComments(request, function(result) {
        return resolve(result);
      });
    });
  }; //getPostComments
  return getPostComments();

  var numberRecords = 2;
  var counter = {max: numberRecords, left: numberRecords, ok: 0, err:0, errors: []};

  var aryPmPost = [];
  for (var ii = 0; ii < counter.max; ii++) {
    request.pre.body.data.groupid = Uuid.random();
    aryPmPost.push(makeRepost());
  }

  return Promise.settle(aryPmPost);
};

/**
 * input = { user_id: "seemo", offset: 0, hits : 20 }
 */
postTry.getPagePost = function(done) {
  var input = { user_id: 'seemo', offset: 0, hits: 4 };
  var pageState;
  var fetchSize = input.hits;
  var query = 'SELECT post_id FROM post';

  var cqPost = function() {
    return new Promise(function(resolve, reject) {
      var aryRow = [];
      console.log('===============first page');
      cassandraClient.execute(query, [], {
        prepare: 1,
        fetchSize: fetchSize,
      }, function(err, result) {
        console.log('query result=', result);

        //console.log('result.columns=', result.columns);
        pageState = result.pageState;
        console.log('pageState=', pageState);
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        };

      });
    });
  };

  cqPost()
        .then(function(result) {
          return new Promise(function(resolve, reject) {
            console.log('=================next page');
            console.log('pageState=', pageState);
            console.log('query=', query);

            // Use the pageState in the queryOptions to continue where you left it.
            cassandraClient.execute(query, [], {
              pageState: pageState,
              prepare: 1,
              fetchSize: fetchSize,
            }, function(err, resNext) {
              console.log('err=', err);
              console.log('query result', resNext);
              console.log('pageState=', resNext.pageState);
              if (err) {
                reject(err);

              } else {
                resolve(resNext);
              };
            });
          });
        })
        .then(function(resFinal) {
          console.log('final result', resFinal);
          cassandraClient.shutdown();
          done();
        })
        .catch(function(err) {
          console.log('final err', err);
          cassandraClient.shutdown();
          done();
        });

};

postTry.postModel_insertUserFeeds = function(done) {
  var joData = { post_id: Uuid.random(),
                 publish_time: Date.now(),
                  ary_user_id: ['user1', 'user2', 'user3', 'user4'],
               };
  postModel.insertUserFeeds(joData)
    .then(function(result) {
      console.log('success', result);
      done();
    })
    .catch(function(err) {
      console.log('fail', err);
      done();
    });
};

postTry.redisModel_getUserRedis = function(done) {
  redisModel.getUserRedis('seemo', function(joUser) {
    Fs.writeFile('upload/joUser.json', JSON.stringify(joUser), function(err) {
      if (err) {
        console.log('writeFile failed', err);
      };

      console.log('joUser', Util.inspect(joUser, {
        depth: null,
      }));
      done();
    });

  });
};

postTry.makeRawPost = function(done) {
  var counter_length = 3;
  var counter_left = counter_length;

  for (var ii = 0; ii < counter_length; ii++) {
    var input = { user_id:'micah' + ii, msg:'test msg ' + ii,
                  mention_cur: ['USDJPY.FX', 'USDCHF.FX'], mention_user_id:['seemo', 'rayson'], };
    postModel.insertPost(input).then(function(postData) {
      console.log('Success:', postData);
      var food = { where: { post_id: postData.post_id },
                   counter: {
                          abusive_count: 0,
                          comment_count: 0,
                          dislike_count: 0,
                          harmful_count: 0,
                          like_count: 0,
                          repost_count: 0,
                          share_count: 0,
                          spam_count: 0, },
                 };
      return postModel.updateCounter(food);
    })
        .then(function(resUpdateCounter) {
          counter_left--;
          if (counter_left == 0) { return done(); };
        })
        .catch(function(error) {
          console.log('Fail: insert_post; ', error);
          counter_left--;
          if (counter_left == 0) { return done(); };

        });
  }
};

module.exports = postTry;
