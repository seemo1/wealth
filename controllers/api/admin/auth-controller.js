'use strict';

const Boom = require('../../../commonlib/boom');
const AuthModel = require('../../../models/auth-model');

class AuthController {

  constructor() {
  }

  login(request, reply) {
    let authModel = new AuthModel('peter');
    authModel.login(request.payload.email, request.payload.password)
    .then(function(result) {
      reply.ok(result);
    })
    .catch(function(err) {
      reply(Boom.unauthorized(err));
    });
  }

}

module.exports = AuthController;