'use strict';

const logTag = '[User-Model]';
const Logger = require('../commonlib/logger');

class ImServerModel {

  constructor() {
  };

  getUserProfile(user_id) {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.auth_GetById(user_id)
          .then(function(res) {
            if (res.length > 0) {
              resolve(res);
            }else {
              reject('no such user')
            }
          })
          .catch(function(err) {
            Logger.error(logTag, err);
            reject(err);
          })
    });
  };

  //datastore
  auth_GetById(user_id) {
    let sql = 'select * from AUTH where USERID = :user_id';
    let params = {
      user_id: user_id,
    };

    return new Promise(function(resolve, reject) {
      MySqlConn.query(logTag, sql, params)
          .then(function(res) {
            resolve(res);
          })
          .catch(function(err) {
            Logger.error(logTag, err);
            reject(err);
          });
    });
  }
}

module.exports = ImServerModel