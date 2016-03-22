'use strict';

var _ = require('lodash');
var server = require('./batch-server');
var logger = require('../utils/logger');
var Moment = require('moment');
var Fs = require('fs');

var referralCodeCassToSQL = {};
var tempCursor = 'tempcursor';
var startTime = new Date().getTime();
var totalArray = {success: 0, total: 0, error: 0};

referralCodeCassToSQL.start = function() {
  server.start()
      .then(function() {
        return new Promise(function(resolve, reject) {
          console.log('popularCount');
          resolve();
        });
      })
      .then(function() {
        insertLoop('');
      })
      .catch(function(err) {
        console.log(err);
        console.log('error');
        setTimeout(function() { process.exit(0); }, 5000);
      });
};

function insertLoop(cursor) {
  console.log('start!!'.red, new Date().toUTCString());
  console.log(new Date().toUTCString(), ' orig cursor: '.blue, cursor);
  console.log(new Date().toUTCString(), ' temp cursor: '.blue, tempCursor);
  if (cursor != tempCursor) {
    tempCursor = cursor;

    getData(cursor, function(result) {
      insertSQL(result.rows, function() {
        console.log(result.endState);
        if (result.endState != null) {
          insertLoop(result.endState);
        } else {
          console.log('TOTAL TIME : ', new Date().getTime() - startTime);
          console.log(JSON.stringify(totalArray));
          setTimeout(function() { process.exit(0); }, 5000);
        }
      });
    });

  } else {
    console.log('TOTAL TIME : ', new Date().getTime() - startTime);
  }

}

function getData(pageState, callback) {
  var fetchSize = 1000;
  var result = [], rows = [];
  var option = {fetchSize: fetchSize};
  if (pageState != '') {
    option.pageState = pageState;
  }

  //console.log(option);
  cassandraClient.eachRow('SELECT * FROM user_referral', [], option, function(n, row) {
    rows.push(row);
    ++totalArray.total;
  }, function(error, res) {
    //console.log(res);
    result.rows = rows;
    result.endState = res.pageState;
    callback(result);
  });
}

function insertSQL(rows, callback) {
  var totalCount = rows.length;
  if (totalCount == 0) {
    callback();
  }
  _.forEach(rows, function(row) {
    var insertUserReferralCodeSql = 'INSERT INTO user_referral_code SET ?';
    var insertUserReferralCodeData = {
      user_id: row.user_id,
      referral_code: row.referral_code,
      referral_by: row.referral_by,
      publish_time: Moment().format('YYYY-MM-DD HH:mm:ss'),
      last_update_time: Moment().format('YYYY-MM-DD HH:mm:ss'),
      referral_count: 0,
    };
    mysqlClient.query(insertUserReferralCodeSql, insertUserReferralCodeData, function(err, res) {
      var MySQL = require('mysql');
      var query = MySQL.format(insertUserReferralCodeSql, insertUserReferralCodeData);
      if (err) {
        Fs.appendFile('./logs/UserReferralCodeSQL.txt', new Date() + ' -- ' + query + '\n', function(err) {
        });
        console.error('insertUserReferralCodeSql error', err);
        --totalCount;
        ++totalArray.error;
      }
      --totalCount;
      ++totalArray.success;
      if (totalCount == 0) {
        callback();
      }
    });
  });
}

referralCodeCassToSQL.start();
