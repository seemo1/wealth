'use strict';

var logger = require('../utils/logger');
var redisModel = require('../commonlib/redis-common');
var logTag = '[Request-util]';
var userComm = {};
var Promise = require('bluebird');
var Fs = require('fs');
var _ = require('lodash');
var request = require('request');
var systemSettings = require('../commonlib/settings-common');
var mysqlGlobalComm = require('../commonlib/mysql-global-common');

userComm.checkUser = function(userId, callback) {
  cassandraClient.execute('SELECT * FROM user WHERE user_id=\'' + userId + '\'', function(err, res) {
    if (err) {
      logger.error(logTag, 'checkUser error', err);
      return;
    }

    if (res.rows.length == 1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

/***
 * 更新AuthToken異動變更
 * @param request
 */
userComm.updateTokenData = function(request, callback) {
  var userId = request.user.Id;
  var tokenLanguage = request.user.language;
  var country, language;
  var res = {};
  var isTrue = false;
  var cassQuery = 'SELECT country , language , school_key , school_name FROM user WHERE user_id=?';
  var authQuery = 'SELECT COUNTRY as country , LANGUAGE as language , school_key , school_name FROM AUTH WHERE userid=?';
  if (userId == '') {
    logger.info(logTag, 'updateTokenData user_id is null', userId);
    return callback(false);
  }

  return new Promise(function(resolve, reject) {
    cassandraClient.execute(cassQuery, [userId], {prepare: true}, function(err, cassRes) {
      if (err) {
        reject('cassQuery Error =' + err);
      }

      if (cassRes.rows.length == 1) {
        res.cassRes = cassRes.rows[0];
        resolve(res);
      } else {
        reject('cassRes length != 1 , cassRes=' + cassRes);
      }
    });
  })
    .then(function(res) {
      return new Promise(function(resolve, reject) {
        mysqlClient.query(authQuery, [userId], function(err, authRes) {
          if (err) {
            reject('authQuery Error =' + err);
          }

          if (authRes.length == 1) {
            res.authRes = authRes[0];
            resolve(res);
          } else {
            reject('authRes length != 1 , authRes=' + authRes);
          }
        });
      });
    })
    .then(function(Res) {
      return new Promise(function(resolve, reject) {

        var checkCassCountry = _.isEmpty(Res.cassRes.country);

        if (Res.cassRes.country !== Res.authRes.country && !checkCassCountry) {
          mysqlClient.query('UPDATE AUTH SET COUNTRY = ? WHERE USERID = ?', [Res.cassRes.country, userId], function(err, res) {
            Fs.appendFile('./logs/userChangeCountry.txt', new Date() + ' -- , UserId=' + userId + ' , cassCountry=' + Res.cassRes.country + ' , authCountry=' + Res.authRes.country + ' , update error =' + err + '\n', function(err) {
            });

            //同步其他市場別
            var otherMarket = JSON.parse(systemSettings.get('Server', 'MarketUrl'));
            if (otherMarket) {
              _.forEach(otherMarket, function(data) {
                var url = data.url + '?user_id=' + userId;
                request.get(
                    url,
                    function(error, response, body) {
                      console.log('callOtherMarket ERROR : ', error);
                    }
                );
              });
            }

            isTrue = true;
            resolve(Res);
          });
        } else {
          resolve(Res);
        }
      });
    })
    .then(function(Res) {
      return new Promise(function(resolve, reject) {
        var checkCassSchoolKey = _.isEmpty(Res.cassRes.school_key);
        if (Res.cassRes.school_key !== Res.authRes.school_key && !checkCassSchoolKey) {
          mysqlClient.query('UPDATE AUTH SET school_key = ? ,school_name = ? WHERE USERID = ?', [Res.cassRes.school_key, Res.cassRes.school_name, userId], function(err, res) {
            Fs.appendFile('./logs/userChangeSchool.txt', new Date() + ' -- , UserId=' + userId + ' , cassSchoolKey=' + Res.cassRes.school_key + ' , authSchoolKey=' + Res.authRes.school_key + ' , update error =' + err + '\n', function(err) {
            });

            //同步其他市場別
            var otherMarket = JSON.parse(systemSettings.get('Server', 'MarketUrl'));
            if (otherMarket) {
              _.forEach(otherMarket, function(data) {
                var url = data.url + '?user_id=' + userId;
                request.get(
                    url,
                    function(error, response, body) {
                      console.log('callOtherMarket ERROR : ', error);
                    }
                );
              });
            }

            isTrue = true;
            resolve(Res);
          });
        }else {
          resolve(Res);
        }
      });
    })
    .then(function(Res) {
      return new Promise(function(resolve, reject) {
        if (Res.authRes.language !== tokenLanguage) {
          mysqlClient.query('UPDATE AUTH SET LANGUAGE = \'' + tokenLanguage + '\' WHERE USERID = \'' + userId + '\'', [userId], function(err, res) {
          });

          isTrue = true;
          resolve(Res);
        }else {

          resolve(Res);
        }
      });
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
          cassandraClient.execute('update user set language = ? where user_id = ? ', [tokenLanguage, userId], {prepare: true}, function(err, cassRes) {
            if (err) {
              reject('cassRes update Error =' + err);

            }

            resolve(cassRes);

          });
        });
      })

      .then(function() {
      if (isTrue) {
        redisModel.setUserRedis(request.user.Id, function() {
          logger.info(logTag, 'updateTokenData', 'setUserRedis', 'done');
        });
      }

      return callback(true);
    })
    .catch(function(err) {
      logger.error(logTag, 'updateTokenData', err);
    });
};
/***
 * Update User Table has_login
 * @type {{}}
 */
userComm.updateUserHasLogin = function(request) {
  var userId = request.Id;
  new Promise(function(resolve, reject) {
    cassandraClient.execute('SELECT has_login FROM user WHERE user_id=\'' + userId + '\'', function(err, res) {
      if (err) {
        logger.error(logTag, err);
        reject(err);
      }

      resolve(res);
    });
  })
  .then(function(res) {
    if (res.rows.length > 0) {
      if (res.rows[0].has_login != 'Y') {
        cassandraClient.execute('UPDATE user SET has_login = \'Y\' WHERE user_id=\'' + userId + '\'', function(err, res) {
          if (err) {
            logger.error(logTag, 'updateUserHasLogin', err);
            return;
          }

          logger.info(logTag, 'update user has_login , userId=', userId);
        });
      }
    }
  })
  .catch(function(err) {
    logger.error(logTag, 'updateUserHasLogin', err);
  });
};

userComm.getOtherMarketUserId = function(userId) {
  return new Promise(function(resolve, reject) {
    var response = {
                    FX:userId,
                    FC:userId,
                    SC:userId,
                    FT:userId, };
    var query = 'SELECT ID FROM AUTH_UNION WHERE USERID = ? AND market=\'FX\'';
    mysqlGlobalComm.select(logTag, query, [userId], function(err, res) {
      if (err) {
        logger.error(logTag, '[getOtherMarketUserId select ID error]', err);
        reject(err);
      }

      if (res.length > 0) {
        var query = 'SELECT * FROM AUTH_UNION WHERE ID = ?';
        mysqlGlobalComm.select(logTag, query, [res[0].ID], function(err, res) {
          if (err) {
            logger.error(logTag, '[getOtherMarketUserId select USERID error]', err);
            reject(err);
          }
          _.forEach(res, function(row) {
            if (row.MARKET == 'FX') {
              response.FX = row.USERID;
            }else if (row.MARKET == 'FT') {
              response.FT = row.USERID;
            }else if (row.MARKET == 'FC') {
              response.FC = row.USERID;
            }else if (row.MARKET == 'SC') {
              response.SC = row.USERID;
            }
          });
          resolve(response);

        });
      }else{
        resolve(response);
      }
    });
  });
};

module.exports = userComm;
