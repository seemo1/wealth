'use strict';

var systemSettings = {};
var Promise = require('bluebird');
var tableName = 'system_settings';
var _ = require('lodash');
var logger = require('../utils/logger');
var logTag = '[System Settings]';

systemSettings.data = [];

/**
 *
 * @param type
 * @param key
 * @returns {*}
 */
systemSettings.get = function(type, key) {
  var setting = _.where(systemSettings.data, {key_code: key, type: type});
  if (setting.length <= 0) {
    return null;
  }  else {
    return setting[0].value;
  }
};

/**
 * get Setting, return defValue if null
 * @param type
 * @param key
 * @param defValue
 * @returns {*}
 */
systemSettings.getD = function(type, key, defValue) {
  var setting = _.where(systemSettings.data, {key_code: key, type: type});
  if (setting.length <= 0) {
    logger.warn(logTag, 'getD type : ' + type + ', key : ' + key + ' not found! Please check system setting');
    return defValue;
  }  else {
    return setting[0].value;
  }
};

systemSettings.getAll = function() {
  return systemSettings.data;
};

systemSettings.loadFromMysql = function() {
  return new Promise(function(resolve, reject) {
    mysqlCentralClient.query('SELECT * FROM ' + centraldb.get('DEFAULT') +'.'+tableName, function(err, res) {
      if (err) {
        logger.error(logTag, 'Cannot load system settings!!'.red);
        return reject(err);
      }

      if (res.length > 0) {
        systemSettings.data = res;
        resolve('System settings loaded');
      }      else {
        logger.error(logTag, 'load', 'cannot get system settings');
        reject('cannot load system settings');
      }

    });
  });
};

module.exports = systemSettings;
