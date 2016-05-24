'use strict';

const Logger = require('../commonlib/logger');
const ImModel = require('./im-model');
const UserModel = require('./user-model');
const logTag = '[IMServer-Model]';

class AuthFrontendModel {

  constructor() {
  }

  socialLogin(user_id) {
    return new Promise(function(resolve, reject) {
      let imModel = new ImModel();
      let userModel = new UserModel();
      userModel.getUserProfile(user_id)
        .then(function(res) {
          return imModel.reflashImToken(user_id, res[0].USERNAME)
        })
        .then(function(res) {
          return resolve(res);
        })
          .catch(function(err) {
            Logger.error(logTag, err)
            return reject(err);
          });
    });
  }
}

module.exports = AuthFrontendModel;
