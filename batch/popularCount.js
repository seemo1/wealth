'use strict';

var _ = require('lodash');
var Config = require('config');
var server = require('./batch-server');
var mysqlGlobalComm = require('../commonlib/mysql-global-common');
var logger = require('../utils/logger');
var Moment = require('moment');
var date = Moment().subtract(1, 'days').format('YYYY-MM-DD');
var logTag = '[popularCount]';

var startCronJob = 'INSERT INTO cronjob_log (name,date,market,start_time) VALUES (?,?,?,?)';
var errorCronJob = 'UPDATE cronjob_log SET error_msg=? , error_time=? WHERE id=?';
var endCronJob = 'UPDATE cronjob_log SET end_time=? WHERE id=?';
global.insertId = '';

server.start()
  .then(function() {
    return new Promise(function(resolve, reject) {
      startCron('popularCount', date);
      resolve();
    });
  })
  .then(function() {
    return new Promise(function(resolve, reject) {
      mysqlGlobalComm.delete(logTag, 'DELETE FROM popular_trader_count_daily WHERE date=?', [date], function(err, res) {
        if (err) {
          reject(err);
          logger.error(logTag, '[delete popular_trader_count_daily count]', err);
        };

        resolve();
      });
    });
  })
  .then(function() {
    return new Promise(function(resolve, reject) {
      mysqlClient.getConnection(function(err, connection) {
        connection.query('SELECT user_id,COUNT(*) AS LoginCount FROM USER_LOGIN_LOG WHERE login_time BETWEEN DATE_SUB(\'' + date + '\', INTERVAL 1 DAY) AND \'' + date + '\' GROUP BY user_id')
          .on('result', function(row) {
            connection.pause();
            count(row, function() {
              connection.resume();
            });
          })
          .on('end', function() {
            resolve();
          });
      });
    });
  })
  .then(function() {
    endCron(global.insertId);
  })
  .catch(function(err) {
    errCronJob(err, global.insertId);
  });

function count(row, callback) {
  var parmae = {
    user_id: row.user_id,
    login_count: 0,
    tran_count: 0,
    comment_count: 0,
    post_count: 0,
    date: date,
  };
  return new Promise(function(resolve, reject) {
    parmae.login_count = row.LoginCount;
    resolve();
  })
      .then(function(resolve, reject) {
        return new Promise(function(resolve, reject) {
          var query = 'SELECT COUNT(*) AS TransactionCount FROM USER_TRANSACTION_LOG WHERE user_id=? AND transaction_time BETWEEN DATE_SUB(?, INTERVAL 1 DAY) AND ?;';
          mysqlGlobalComm.select(logTag, query, [row.user_id, date, date], function(err, res) {
            if (err) {
              reject(err + ',user_id=' + row.user_id);
              logger.error(logTag, '[select Transaction count]', err);
            };

            if (res.length > 0) {
              parmae.tran_count = res[0].TransactionCount;
            }

            resolve();
          });
        });
      })
      .then(function() {
        return new Promise(function(resolve, reject) {
          cassandraClient.execute('SELECT count(*) FROM post WHERE user_id=?', [row.user_id], {prepare: true}, function(err, res) {
            if (err) {
              reject(err + ',user_id=' + row.user_id);
              logger.error(logTag, '[select post count]', err);
            }

            parmae.post_count = res.rows[0].count;
            resolve();
          });
        });
      })
      .then(function() {
        return new Promise(function(resolve, reject) {
          cassandraClient.execute('SELECT count(*) FROM post_comment WHERE user_id=?', [row.user_id], {prepare: true}, function(err, res) {
            if (err) {
              reject(err + ',user_id=' + row.user_id);
              logger.error(logTag, '[select post_comment count]', err);
            }

            parmae.comment_count = res.rows[0].count;
            resolve();
          });
        });
      })
      .then(function() {
        return new Promise(function(resolve, reject) {
          var query = 'INSERT INTO popular_trader_count_daily SET ?';
          mysqlGlobalComm.insert(logTag, query, [parmae], function(err, res) {
            if (err) {
              reject(err + ',user_id=' + row.user_id);
              logger.error(logTag, '[insert err]', err);
            };

            return callback();
          });
        });
      })
      .catch(function(err) {
        errCronJob(err, global.insertId);
        logger.error(logTag, '[count catch err]', err);
      });
}

function errCronJob(err, insertId) {
  mysqlClient.query(errorCronJob, [JSON.stringify(err), Moment().format(), insertId], function(error, res) {
    if (error) {
      logger.error(logTag, 'error cronJob Error', error);
    }

    process.exit(0);
  });
}

function startCron(name, date) {
  mysqlClient.query(startCronJob, [name, date, Config.get('MarketCode'), Moment().format()], function(error, res) {
    if (error) {
      logger.error(logTag, 'start cronJob Error', error);
    }

    global.insertId = res.insertId;
  });
}

function endCron(insertId) {
  mysqlClient.query(endCronJob, [Moment().format(), insertId], function(error, res) {
    if (error) {
      logger.error(logTag, 'end cronJob Error', error);
    }

    process.exit(0);
  });
}
