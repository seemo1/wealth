'use strict';

const AuthController = require('./auth-frontend-controller');
const AuthValidator = require('./auth-frontend-validator');

let rootPath = '/api/auth/v0';
let authController = new AuthController();
module.exports = [
  {
    path: rootPath + '/login',
    method: 'post',
    config: {
      handler: function(request, reply) {
        return authController.login(request, reply);
      },
      validate: AuthValidator.request.login,
      description: '登入',
      tags: ['api'],
      response: {
        schema: AuthValidator.response.login,
      },
    },
  },
];