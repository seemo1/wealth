'use strict';

var _ = require('lodash');
var server = require('./batch-server');
var mysqlGlobalComm = require('../commonlib/mysql-global-common');
var logger = require('../utils/logger');
var notification = require('../commonlib/notification/notification-util');
var Moment = require('moment');
var nowDate = Moment().month(1).format('YYYY-M');
var logTag = '[studentCardExpires]';
server.start()
    .then(function() {
      return new Promise(function(resolve, reject) {
        var query = 'SELECT * FROM user_school_detail WHERE is_verified=2 && verify_date!=\'\' && verify_date = ?';
        mysqlGlobalComm.select(logTag, query, [nowDate], function(err, res) {
          if (err) {
            logger.error(logTag, err);
            reject();
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
          notification.school.remind(row.user_id);
          --count;
          console.log("count=",count);
          console.log("userId=",row.user_id);
          if (count == 0) {
            resolve();
          }
        });
      });
    })
    .then(function() {
      setTimeout(function () {
        process.exit(0);
      }, 300)
    })
    .catch(function(err) {
      logger.error(logTag, '[catch]', err);
      process.exit(0);
    });
