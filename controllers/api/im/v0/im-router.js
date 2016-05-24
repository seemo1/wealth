'use strict';

const ImController = require('./im-controller');
const ImValidator = require('./im-validator');

let rootPath = '/api/im/v0';
let imController = new ImController();
module.exports = [
  {
    path: rootPath + '/imAccount',
    method: 'get',
    config: {
      handler: function(request, reply) {
        return imController.getImAccount(request, reply);
      },
      validate: ImValidator.request.getImAccount,
      tags: ['api'],
      response: {
        schema: ImValidator.response.getImAccount,
      },
      description: '查詢個人的IM帳號',
    },
  },
];