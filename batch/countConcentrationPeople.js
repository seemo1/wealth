'use strict';

var _ = require('lodash');
var server = require('./batch-server');
var mysqlGlobalComm = require('../commonlib/mysql-global-common');
var logger = require('../utils/logger');
var Moment = require('moment');
var logTag = '[countConcentrationPeople]';

server.start()
  .then(function() {
    return new Promise(function(resolve, reject) {
      var query = 'SELECT concentration_key , count(concentration_key) AS count FROM user_school_detail WHERE concentration_key!=\'\' GROUP BY concentration_key';
      mysqlGlobalComm.select(logTag, query, [], function(err, res) {
        if (err) {
          logger.error(logTag, '[mysqlGlobalComm SELECT error]', err);
          reject()
        }

        resolve(res);
      });
    });
  })
  .then(function(res) {
    return new Promise(function(resolve, reject) {
      var count = res.length;
      if (count == 0) {
        resolve();
      }
      _.forEach(res, function(row) {
        var query = 'UPDATE concentration SET people_count=? , last_update_time=? WHERE concentration_key=?';
        mysqlGlobalComm.update(logTag, query, [row.count, Moment().format('YYYY-MM-DD HH:mm:ii'), row.concentration_key], function(err, res) {
          if (err) {
            logger.error(logTag, '[mysqlGlobalComm UPDATE error]', 'row=', JSON.stringify(row), 'err=', err);
            reject()
          }
          --count;
          if (count == 0) {
            resolve();
          }
        });
      });
    });
  })
  .then(function(){
    process.exit(0);
  })
  .catch(function(err) {
    logger.error(logTag, '[catch error]', err);
    process.exit(0);
  });
