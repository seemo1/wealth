'use strict';

var settingsModel = {};
var tableName = 'system_settings';
var _ = require('lodash');
var systemSettings = rfr('/commonlib/settings-common');
var logTag = '[Settings-Model-v0]';
var logger = ('../../../utils/logger');
var Promise = require('bluebird');
var Moment = require('moment');
var configHandler = require('../../commonlib/config-handler');

settingsModel.get = function() {
  return new Promise(function(resolve, reject) {
    var query = 'select type,key_code,value,memo,' +
                'DATE_FORMAT ( created_time , "%Y-%m-%d %H:%i:%s"  ) as created_time  , ' +
                'DATE_FORMAT ( update_time , "%Y-%m-%d %H:%i:%s"  ) as update_time  ' +
                'from ' + tableName
                ;
    mysqlCentralClient.query(query, function(err, res) {
      if (err) {
        console.log(query.red);
        logger.error(logTag, 'get', err);
        reject(err);
        return;
      }

      //don't display the RSA key on the frontend
      res = _.reject(res, {type: 'RSA'});
      resolve(res);
    });
  });
};

settingsModel.add = function(newSetting, callback) {
  return new Promise(function(resolve, reject) {
    var dateNow = Moment().format('YYYY-MM-DD HH:mm:ss');
    newSetting.created_time = dateNow;
    newSetting.update_time = dateNow;
    var query = 'INSERT INTO ' + tableName + ' SET ?';
    mysqlCentralClient.query(query, newSetting, function(err, res) {
      if (err) {
        logger.error(logTag, 'add', err);
        reject(err);
        return;
      }

      configHandler.reloadSettings();

      systemSettings.loadFromMysql()
                .then(function(res) {
                  logger.info(logTag, 'loadFromMysql', res);
                })
                .catch(function(err) {
                  logger.error(logTag, err);
                });

      resolve();
    });
  });
};

settingsModel.update = function(setting) {
  return new Promise(function(resolve, reject) {
    var query = 'UPDATE ' + tableName + ' SET value = ?, memo = ?, update_time=? WHERE type = ? AND key_code = ?';
    var params = [setting.value, setting.memo, Moment().format('YYYYY-MM-DD HH:mm:ss'), setting.type, setting.key_code];
    mysqlCentralClient.query(query, params, function(err, res) {
      if (err) {
        reject(err);
        return;
      }

      configHandler.reloadSettings();
      resolve();
    });
  });
};

settingsModel.getSetting = function(type, keyCode, callback) {
  var selectFields = []; // select *
  var whereColumns = ['type', 'key_code'];
  var whereValues = [type, keyCode];

  cassModel.select(tableName, selectFields, whereColumns, whereValues, function(res) {
    callback(res);
  });
};

module.exports = settingsModel;
