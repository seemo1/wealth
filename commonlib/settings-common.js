'use strict';

/**
 *
 * 處理讀取系統公用設定值
 *
 * Author: seemo
 * Date: 2016/3/31
 *
 */
const _ = require('lodash');
const Logger = require('./logger');
const logTag = '[System Settings]';

class SystemSettings{
  constructor(){
    this._settings = [];
  }

  //取設定值
  get(type, key, defaultValue){
    let that = this;
    let result = null;

    let setting = _.find(that._settings, {key_code: key, type: type});
    if (setting === undefined) {
      Logger.info(logTag, 'get type : ' + type + ', key : ' + key + ' not found! Please check system setting');
      if(defaultValue != undefined){
        result = defaultValue;
      }
    }  else {
      result = setting.value;
    }
    return result;
  }

  //讀出全部設定值
  getAll() {
    return this._settings;
  };

  //共用設定知始化，載入所有設定值到momory
  initial() {
    let that = this;
    return new Promise(function(resolve, reject) {
    MySqlConn.query(logTag, 'SELECT type, key_code, value FROM system_settings', [])
        .then(function(res) {
            if (res.length > 0) {
              that._settings = res;
              Logger.info('system settings is loaded.')
              let msg = 'System settings loaded';
              return resolve(msg)
            } else {
              logger.error(logTag, 'load', 'cannot get system settings');
              let msg = 'can not load system settings';
              return reject(msg);
            }
          })
        })
        .catch(function(err){
          Logger.error(err);
          return reject(err);
        });
  };
}

module.exports = SystemSettings;
