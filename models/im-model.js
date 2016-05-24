'use strict';

const ImClientCommon = require('../commonlib/imclient-common');
const logTag = '[IMServer-Model]';
const moment = require('moment');
const Logger = require('../commonlib/logger');

class ImServerModel {

  constructor() {
    this.social_im_user = {};
  };

  //刷新IM Token, 當帳號不存在時會自動建立
  reflashImToken(user_id, username) {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.social_im_user_GetById(user_id)
        .then(function(res) {
          if (res.length == 0) {
            return that.createImAccount(user_id, username);
          } else {
            return that.loginChangeToken(user_id);
          }
        })
        .then(function(res) {
          return that.getUserImInfo(user_id);
        })
        .then(function(res) {
          return resolve(res[0]);
        })
        .catch(function(err) {
          Logger.log(logTag, err);
          reject(err);
        });
    });
  }

  //新建IM帳號並同步記錄於資料庫中
  createImAccount(user_id, username) {
    let that = this;
    return new Promise(function(resolve, reject) {
      ImClientCommon.createAccount(user_id, username, null, null, function(res) {
        if (res.success) {
          let token = res.result.info.token;
          that.social_im_user_Insert(user_id, user_id, token);
          return resolve(res);
        }else {
          if (res.result.code === 414) {
            that.syncImAccountToDB(user_id,username)
              .then(function(res) {
                return resolve(res);
              });
          }else {
            Logger.error(logTag, res);
            return reject(res.result);
          }
        }
      });
    })
  }

  //處理雲信有帳號，本地資料庫卻沒有的情況
  syncImAccountToDB(user_id, username) {
    let that = this;
    return new Promise(function(resolve, reject) {
      ImClientCommon.refreshToken(user_id, function(res) {
        let token = res.result.info.token;
        that.social_im_user_Insert(user_id, username, token)
          .then(function() {
            resolve(res);
          })
          .catch(function(err) {
            Logger.error(logtag, err)
            reject(err);
          });
      });
    });
  }


  //取得IM帳號資訊
  getUserImInfo(user_id) {
    let that = this;
    return that.social_im_user_GetById(user_id);
  }

  //檢查IM帳號是否有註冊


  //登入完成後更改IM密碼
  loginChangeToken(user_id) {
    let that = this;
    return new Promise(function(resolve, reject) {
      ImClientCommon.refreshToken(user_id, function(res) {
        if (res.success) {
          let token = res.result.info.token;
          return that.social_im_user_UpdateToken(user_id, token)
            .then(function() {
              return resolve();
            });
        } else {
          Logger.error(logTag, res);
          return reject(res.result);
        }
      });
    });
  }


  //social_im_user 新增記彔
  social_im_user_Insert(user_id, yun_id, token) {
    let sql = 'INSERT INTO `wealth`.`social_im_user` (`user_id`,`yun_uid`,`token`,`publish_time`,`update_time`,`status`)' +
        'values(:user_id,:yun_uid,:token,:publish_time,:update_time,:status)';
    let params = {
      user_id: user_id,
      yun_uid: yun_id,
      token: token,
      publish_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      update_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      status: 0,
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

  //social_im_user 修改密碼
  social_im_user_UpdateToken(user_id, token) {
    let sql = 'UPDATE social_im_user SET `token` = :token, `update_time` = :update_time WHERE `user_id` = :user_id;';
    let params = {
    user_id: user_id,
    token: token,
    update_time: moment().format("YYYY-MM-DD HH:mm:ss"),
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

  //social_im_user 查詢IM帳號資料
  social_im_user_GetById(user_id) {
    let sql = 'select * from social_im_user WHERE `user_id` = :user_id;';
    let params = { user_id: user_id };

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