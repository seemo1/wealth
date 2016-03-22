'use strict';

var _ = require('lodash');
var Async = require('async');
//var cassModel = require('../commonlib/cassandra-common');
var mysqlCenterModel = require('../commonlib/mysql-center-common');
var mysqlGlobalModel = require('../commonlib/mysql-global-common');
var systemSettings = require('../commonlib/settings-common');
var logger = require('../utils/logger');
var logTag = '[Redis-common]';
var redisModel = {};
var Config = require('config');
var ttl = 0;

redisModel.getKey = function(table, whereValues) {
  var key = table;
  for (var ii = 0; ii < whereValues.length; ii++) {
    key += ('-' + whereValues[ii]);
  }

  return Config.get('Cassandra.keyspace') + '-' + key;
};

redisModel.set = function(table, whereValues, value) {
  var key = redisModel.getKey(table, whereValues);
  var isObject = typeof value === 'object';

  if (isObject) {
    redisClient.set(key, JSON.stringify(value));
  }  else {
    redisClient.set(key, value);
  }

  if (ttl == 0) {
    ttl = systemSettings.getD('Redis', 'TTL', 21600);
  }

  redisClient.expire(key, ttl);

};

redisModel.get = function(table, whereValues, callback) {

  var key = redisModel.getKey(table, whereValues);
  redisClient.get(key, function(err, res) {
    try {
      callback(JSON.parse(res));
    }
    catch (error) {
      callback(res);
    }
  });
};

redisModel.getByKey = function(table, whereColumns, whereValues, callback) {

  var key = redisModel.getKey(table, whereValues);
  redisClient.get(key, function(err, value) {

    if (value == null) {
      redisModel.setByKey(key, table, whereColumns, whereValues, function(result) {
        callback(result);
      });
    }    else {
      try {
        var json = JSON.parse(value);
        return callback(json);
      }
      catch (e) {
        redisModel.del(key, function(success) {
          redisModel.setByKey(key, table, whereColumns, whereValues, function(result) {
            callback(result);
          });
        });

        return callback(null);
      }
    }
  });
};
/*
redisModel.setByKey = function(key, table, whereColumns, whereValues, callback) {
  return new Promise(function(resolve, reject) {

    cassModel.select(table, [], whereColumns, whereValues, function(res) {
      resolve(res);
    });

  }).then(function(res) {
          if (res.success == true) {
            if (res.result.rowLength > 0) {
              redisClient.set(key, JSON.stringify(res.result.rows[0]));
              return callback(res.result.rows[0]);
            }
          }

          callback(null);
        })
        .catch(function(err) {
          logger.error(logTag, 'setByKey', err);
        });
};
*/

redisModel.exists = function(table, whereValues, callback) {
  var key = redisModel.getKey(table, whereValues);

  redisClient.exists(key, function(err, reply) {
    callback(reply === 1);
  });
};

redisModel.del = function(key, callback) {
  redisClient.exists(key, function(err, reply) {
    if (reply === 1) {
      redisClient.del(key, function(err, reply) {
        return callback(true);
      });
    }    else {
      callback(false);
    }
  });
};

redisModel.clear = function(callback) {
  redisClient.keys('*', function(err, rows) {
    var ii = 0;
    Async.whilst(
            function() {
              return ii < res.result.rowLength;
            },

            function(next) {
              redisClient.del(rows[ii], function(err, reply) {
                ii++;
                next();
              });
            },

            function(err) {
              return callback();
            }
        );
  });
};

redisModel.setUserRedis = function(userId, callback) {
  var key = redisModel.getKey('user', [userId]);
  var array = {};
  var coin;

  function getCoins(logTag, query, userId) {
    return new Promise(function(resolve, reject) {
      mysqlGlobalModel.select(logTag, query, userId, function(err, res) {
        if (err) {
          return reject(err);
        }

        if (res.length > 0) {
          resolve(res[0]);
        } else {
          resolve(0);
        }
      });
    });
  }

  function getFollowCount(logTag, query, userId) {
    return new Promise(function(resolve, reject) {
      mysqlCenterModel.select(logTag, query, userId, function(err, res) {
        if (err) {
          reject(err);
        }

        if (res != undefined && res.length > 0) {
          var key = Object.keys(res[0]);
          var array = [];
          for (var i = 0; i < res.length; i++) {
            array = array.concat(res[i]);
          }

          array = _.pluck(array, key).join(',');
          var object = {};
          object[key] = array;

          resolve(object);
        } else {
          resolve('');
        }
      });
    });
  }

  return new Promise(function(resolve, reject) {
    /* 從 MySQL AUTH 再把用戶資料讀取回來 */

    //var query = 'SELECT * FROM AUTH WHERE USERID="' + userId + '"';
    var query = 'select auth.*, school_detail.is_verified, school_detail.concentration_key, school_detail.start_year, school_detail.end_year, group_concat(user_type.type_id) as identify  from ' + Config.get('LTSGlobalMySQL.database') + '.AUTH as auth ' +
    'left outer join user_school_detail as school_detail on auth.USERID = school_detail.user_id ' +
    'left outer join user_type as user_type on auth.USERID = user_type.user_id ' +
    'where auth.USERID="' + userId + '"';
    mysqlClient.query(query, function(error, result) {
      if (error) {
        logger.info(logTag, 'setUserRedis', 'get mysql user error', ',userId=', userId);
        reject(error);
      }

      resolve(result);
    });
  })
    .then(function(result) {
      return new Promise(function(resolve, reject) {
        if (result.length == 0 || result[0].USERID == '' || result[0].USERID == null) {
          logger.info(logTag, 'setUserRedis', 'user is not exist in mysql', ',userId=', userId);
          return reject(null);
        }else {
          resolve(result[0]);
        }
      });
    })
    .then(function(userData) {
      /* 因為從 Cassandra 轉 MySQL 的關係 , 要做輸出欄位的轉型 */

      //ToDO : 如果要做欄位null 的防呆，之後可以做在這裡
      return new Promise(function(resolve, reject) {
        var newUserData = {};
        newUserData.user_id = userData.USERID;
        newUserData.email = userData.EMAIL;
        newUserData.birthday = userData.birthday ? userData.birthday : '';
        newUserData.background_url = userData.background_url ? userData.background_url : '';
        newUserData.serving_url = userData.serving_url ? userData.serving_url : '';
        newUserData.username = userData.USERNAME ? userData.USERNAME : userData.USERID;
        newUserData.bio = userData.bio ? userData.bio : '';
        newUserData.country = userData.COUNTRY ? userData.COUNTRY : '';
        newUserData.firstname = userData.firstname ? userData.firstname : '';
        newUserData.lastname = userData.lastname ? userData.lastname : '';
        newUserData.org = userData.org ? userData.org : '';
        newUserData.phone = userData.PHONE ? userData.PHONE : '';
        newUserData.sex = userData.sex ? userData.sex : '';

        //newUserData.coins = userData.  ;
        newUserData.school_key = userData.school_key ? userData.school_key : '';
        newUserData.school_name = userData.school_name ? userData.school_name : '';
        newUserData.forget_password = userData.forget_password ? userData.forget_password : '';

        //newUserData.isfollowing = userData.  ;
        newUserData.openid = userData.openid ? userData.openid : '';
        newUserData.unionid = userData.unionid ? userData.unionid : '';
        newUserData.city = userData.city ? userData.city : '';
        newUserData.province = userData.province ? userData.province : '';
        newUserData.wechat_privilege = userData.wechat_privilege ?  userData.wechat_privilege : '';
        newUserData.qq_vip = userData.qq_vip ? userData.qq_vip : '';
        newUserData.language = userData.LANGUAGE ? userData.LANGUAGE : '';
        newUserData.is_verified = userData.is_verified ? userData.is_verified.toString() : '0';
        newUserData.concentration_key = userData.concentration_key ? userData.concentration_key.toString() : '';
        newUserData.start_year = userData.start_year ? userData.start_year.toString() : '';
        newUserData.end_year = userData.end_year ? userData.end_year.toString() : '';
        newUserData.identify = userData.identify ? userData.identify.toString() : '01';

        //newUserData.numFollower = userData. ;
        //newUserData.numMaster = userData. ;
        //newUserData.numGroup = userData. ;
        //newUserData.refferalCode = userData. ;
        //newUserData.referralCount = userData. ;
        newUserData.publish_time = userData.CREATED;

        resolve(newUserData);
      });
    })
    //.then(function(newUserData) {
    //  return new Promise(function(resolve, reject) {
    //    var query = 'SELECT * FROM AUTH_UNION WHERE USERID=?';
    //    mysqlGlobalModel.select(logTag, query, [userId], function(err, res) {
    //      if (err) {
    //        logger.error(logTag, 'select ID AUTH_UNION error', err);
    //        reject(err);
    //      }
    //
    //      console.log('select ID res=', res);
    //      if (res.length > 0) {
    //        var query2 = 'SELECT * FROM AUTH_UNION WHERE ID=?';
    //        mysqlGlobalModel.select(logTag, query2, [res[0].ID], function(err, res) {
    //          if (err) {
    //            logger.error(logTag, 'select USERID AUTH_UNION error', err);
    //            reject(err);
    //          }
    //
    //          console.log('select USERID res=', res);
    //          if (res.length > 0) {
    //            var count = res.length;
    //            _.forEach(res, function(row) {
    //              console.log(row);
    //              newUserData[row.MARKET] = row.USERID;
    //              --count;
    //              if (count == 0) {
    //                return resolve(newUserData);
    //              }
    //            });
    //          }else {
    //            return resolve(newUserData);
    //          }
    //        });
    //      }else {
    //        resolve(newUserData);
    //      }
    //    });
    //  });
    //})
    .then(function(newUserData) {
      return new Promise(function(resolve, reject) {
        var performanceQuery = 'SELECT `ACCOUNTS_DAILY`.`CASH`,' +
            '`ACCOUNTS_DAILY`.`MARGIN`,' +
            '`ACCOUNTS_DAILY`.`PNL`,' +
            '`ACCOUNTS_DAILY`.`ALL_TIME_PNL`,' +
            '`ACCOUNTS_DAILY`.`UR_PNL`,' +
            '`ACCOUNTS_DAILY`.`CASH_DEPOSITED`,' +
            '`ACCOUNTS_DAILY`.`UNIT_PRICE`,' +
            '`ACCOUNTS_DAILY`.`CASH` + `ACCOUNTS_DAILY`.`UR_PNL` as \'ACCOUNT_VALUE\',' +
            '`ACCOUNTS_DAILY`.`CURRENCY`,' +
            '`ACCOUNTS_DAILY`.`TRADE_DATE` as \'ON_DATE\' ,' +
            '`ACCOUNTS_DAILY`.`PnLRate`,' +
            '`ACCOUNTS_DAILY`.`5DPnLRate`,' +
            '`ACCOUNTS_DAILY`.`MTD`,' +
            '`ACCOUNTS_DAILY`.`QTD`,' +
            '`ACCOUNTS_DAILY`.`YTD`,' +
            '`ACCOUNTS_DAILY`.`WinRatio`,' +
            '`ACCOUNTS_DAILY`.`OverAllPnLRate`,' +
            '`ACCOUNTS_DAILY`.`BiggestWin`,' +
            '`ACCOUNTS_DAILY`.`BiggestLoss`,' +
            '`ACCOUNTS_DAILY`.`TradesCount`,' +
            '`ACCOUNTS_DAILY`.`CASH`,' +
            '`ACCOUNTS_DAILY`.`MARGIN`,' +
            '`ACCOUNTS_DAILY`.`ROLL_PRICE`,' +
            '`ACCOUNTS_DAILY`.`DerbyID`,' +
            'round(`ACCOUNTS_DAILY`.`ALL_TIME_PNL` + `ACCOUNTS_DAILY`.`UR_PNL`) as Total_PL,' +
            '`ACCOUNTS_DAILY`.`PNL`+`ACCOUNTS_DAILY`.`UR_PNL` as DAILY_PNL,' +
            'case when `ACCOUNTS_DAILY`.`Ranking` is null then 0 else Ranking end as Ranking,' +
            'case when `ACCOUNTS_DAILY`.`RankingPer` is null then 0 else RankingPer end as RankingPer' +
            ' FROM `ACCOUNTS_DAILY` ' +
            ' where USER_ID = ? ORDER BY TRADE_DATE DESC LIMIT 1';
        mysqlCenterModel.select(logTag, performanceQuery, [userId], function(err, res) {

          if (err) {
            logger.error(logTag, 'performanceQuery ERROR = ', err);
            resolve(newUserData);
          }

          if (res.length > 0) {
            newUserData.num_trade = res[0].TradesCount ? res[0].TradesCount : '';
            newUserData.d1 = res[0].PnLRate ? res[0].PnLRate : '';
            newUserData.d5 = res[0]['5DPnLRate'] ? res[0]['5DPnLRate'] : '';
            newUserData.mtd = res[0].MTD ? res[0].MTD : '';
            newUserData.qtd = res[0].QTD ? res[0].QTD : '';
            newUserData.ytd = res[0].YTD ? res[0].YTD : '';
            newUserData.over_all_pnl_rate = res[0].OverAllPnLRate ? res[0].OverAllPnLRate : '';
            newUserData.ranking = res[0].Ranking ? res[0].Ranking : '';
            newUserData.ranking_per = res[0].RankingPer ? res[0].RankingPer : '';
            newUserData.total_pl = res[0].Total_PL ? res[0].Total_PL : '';
            newUserData.biggest_win = res[0].BiggestWin ? res[0].BiggestWin : '';
            newUserData.biggest_loss = res[0].BiggestLoss ? res[0].BiggestLoss : '';
            newUserData.win_ratio = res[0].WinRatio ? res[0].WinRatio : '';
            newUserData.ur_pnl = res[0].UR_PNL ? res[0].UR_PNL : '';
            newUserData.pnl = res[0].PNL ? res[0].PNL : '';
            newUserData.daily_pnl = res[0].DAILY_PNL ? res[0].DAILY_PNL : '';
            newUserData.account_value = res[0].ACCOUNT_VALUE ? res[0].ACCOUNT_VALUE : '';
            newUserData.margin = res[0].MARGIN ? res[0].MARGIN : '';
            newUserData.cash = res[0].CASH ? res[0].CASH : '';
            newUserData.roll_price = res[0].ROLL_PRICE ? res[0].ROLL_PRICE : '';
            newUserData.unit_price = res[0].UNIT_PRICE ? res[0].UNIT_PRICE : '';
          }

          resolve(newUserData);
        });
      });
    })
    .then(function(userData) {
      array = userData; /* 收集到目前用戶最新的資料*/

      var mysqlGlobalSQL = 'SELECT coins as coin FROM social_user_account WHERE user_id=?';
      var followingCountQuery = 'SELECT DISTINCT following_userid as following FROM following WHERE follower_userid=? ORDER BY following_userid';
      var followerCountQuery = 'SELECT DISTINCT follower_userid as follower FROM following WHERE following_userid=? ORDER BY follower_userid';

      //var getCreatdTimeQuery = 'SELECT CREATED as publish_time FROM AUTH WHERE USERID=?';
      getCoins(logTag, mysqlGlobalSQL, userId)
        .then(function(result) {
          array = _.merge({}, array, result);
          return getFollowCount(logTag, followingCountQuery, userId);
        })
        .then(function(followingList) {
          array = _.merge({}, array, followingList);
          return getFollowCount(logTag, followerCountQuery, userId);
        })
        .then(function(followerList) {
          array = _.merge({}, array, followerList);
          redisClient.set(key, JSON.stringify(array));
          if (ttl == 0) {
            ttl = systemSettings.getD('Redis', 'TTL', 21600);
          }

          redisClient.expire(key, ttl);
          return callback(array);
        })
        .catch(function(err) {
          logger.error(logTag, 'setUserRedis', 'Merge data part 2 fail ', 'userId='+userId);
          return callback(null);
        });

    })
    .catch(function(err) {
      logger.error(logTag, 'setUserRedis', 'something error');
      callback(null);
    });
};

redisModel.getUserRedis = function(userId, callback) {
  var key = redisModel.getKey('user', [userId]);
  redisClient.get(key, function(err, value) {
    if (value == null) {
      logger.info(logTag, 'create Redis-User', ' userId=', userId);
      console.time("setuserRedis");
      redisModel.setUserRedis(userId, callback);
      console.timeEnd("setuserRedis");
    } else {
      var json = JSON.parse(value);
      return callback(json);
    }
  });
};

/****
 *
 * @param table
 * @param keyValue 通常類似 userid
 * @param changValue array{}
 */
redisModel.setRedis = function(table, keyValue, changValue) {
  var key = redisModel.getKey(table, [keyValue]);
  redisClient.get(key, function(err, value) {
    var json = JSON.parse(value);
    _.forEach(changValue, function(v, k) {
      json[k] = v;
    });

    redisClient.set(key, JSON.stringify(json));
    if (ttl == 0) {
      ttl = systemSettings.getD('Redis', 'TTL', 21600);
    }

    redisClient.expire(key, ttl);
  });
};

redisModel.getUserMarketId = function(userId, market, callback) {
  var key = redisModel.getKey('user', [userId]);
  redisClient.get(key, function(err, value) {
    if (value == null) {
      //logger.info(logTag, 'create Redis-User', ' userId=', userId);
      //redisModel.setUserRedis(userId, callback);
      return callback('');
    }else {
      var json = JSON.parse(value);
      return callback(json[market]);
    }
  });
};

redisModel.getRedis = function(key, callback){
  redisClient.get(key, function(err, value) {
    if (value == null) {
      //logger.info(logTag, 'create Redis-User', ' userId=', userId);
      //redisModel.setUserRedis(userId, callback);
      return callback('');
    }else {
      return callback(value);
    }
  });
};

module.exports = redisModel;
