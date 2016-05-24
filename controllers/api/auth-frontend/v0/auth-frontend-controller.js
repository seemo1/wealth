'use strict';

const Boom = require('../../../../commonlib/boom');
const AuthFrontendModel = require('../../../../models/auth-frontend-model');

class LoginController {

  constructor() {
  }

  login(request, reply) {
    let user_id = request.payload.user_id;
    let authFrontendModel = new AuthFrontendModel();
    authFrontendModel.socialLogin(user_id)
        .then(function(res) {
          let result = {
            yun_uid: res.yun_uid,
            token: res.token,
          }
          reply.ok(result);
        })
        .catch(function(err) {
          reply(Boom.unauthorized(err));
        });
  }
}

module.exports = LoginController;
