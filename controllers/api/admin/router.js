'use strict';

const Auth = require('./auth-controller');
const validator = require('./auth-validator');

let rootPath = '/api/admin';
let auth = new Auth();

module.exports = [
  {
    path: rootPath + '/login',
    method: 'POST',
    config: {
      handler: function(request, reply) {
        return auth.login(request, reply);
      },
      validate: validator.request.login,
      description: '後台登入認證用',
      tags: ['api'],
      response: {
        schema: validator.response.login,
      }
    }
  }
];