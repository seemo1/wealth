'use strict';

var _ = require('lodash');
var server = require('./batch-server');
var mysqlGlobalComm = require('../commonlib/mysql-global-common');
var logger = require('../utils/logger');
var notification = require('../commonlib/notification/notification-util');
var Moment = require('moment');
var Fs = require('fs');
var logTag = '[fixUserOtherSchoolKey]';

var oldOtherSchoolKey = ['AUOTHER', '230', '612', 'INOTHER', 'MCOTHER', '672', '103', '825'];

server.start()
  .then(function() {
    return new Promise(function(resolve, reject) {
      var schoolKeyVlaue = '';
      _.forEach(oldOtherSchoolKey, function(key) {
        schoolKeyVlaue += '\'' + key + '\',';
      });

      schoolKeyVlaue = schoolKeyVlaue.substring(0, schoolKeyVlaue.length - 1);
      schoolKeyVlaue = '(' + schoolKeyVlaue + ')';
      var query = 'SELECT * FROM AUTH WHERE school_key IN ' + schoolKeyVlaue;
      mysqlGlobalComm.select(logTag, query, [], function(err, res) {
        if (err) {
          logger.error(logTag, '[SELECT ERROR]', err);
          reject();
        }

        resolve(res);
      });
    });
  })
  .then(function(rows) {
    return new Promise(function(resolve, reject) {
      if (rows.length == 0) {
        resolve();
      }

      var count = rows.length;
      _.forEach(rows, function(row) {

        Fs.appendFile('./logs/oldQuery-' + Moment().format('YYYY-MM-DD') + '.txt',
            'UPDATE AUTH SET school_key=' + row.school_key + ' WHERE USERID=' + row.USERID + ';\n', function(err) {
            });

        Fs.appendFile('./logs/fixUserSchoolKey-' + Moment().format('YYYY-MM-DD') + '.txt',
            Moment().format('YYYY-MM-DD HH:mm:ss') + ' -- USERID=' + row.USERID + ', OldSchoolKey=' + row.school_key + '\n', function(err) {
        });

        var query = 'UPDATE AUTH SET ? WHERE ?';
        var paramData = [{school_key:row.school_key}, {USERID:row.USERID}];
        mysqlGlobalComm.update(logTag, query, paramData, function(err, res) {
          if (err) {
            logger.error(logTag, '[UPDATE ERROR]', err);
            reject();
          }

          --count;
          if (count == 0) {
            resolve();
          }
        });
      });
    });
  })
  .then(function() {
    setTimeout(function() {
        logger.info(logTag, 'fixUserSchoolKey SUCCESS');
        process.exit(0);
      }, 300);
  })
  .catch(function(err) {
    logger.error(logTag, '[CATCH ERROR]', err);
    process.exit(0);
  });
