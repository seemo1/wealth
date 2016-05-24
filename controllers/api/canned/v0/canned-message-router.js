'use strict';

const CannedController = require('./canned-message-controller');
const CannedValidator = require('./canned-message-validator');

let rootPath = '/api/canned/v0';
let cannedController = new CannedController();
module.exports = [
    {
      path: rootPath + '/cannedMessage',
      method: 'get',
      config: {
        tags: ['api'],
        validate: CannedValidator.request.getCannedMessage,
        response: {
          schema: CannedValidator.response.getCannedMessage,
        },
        handler: function(request, reply) {
          return cannedController.getCannedMessage(request, reply);
        },
        description: '取得罐頭訊息',
      },
    },
    {
      path: rootPath + '/cannedMessage',
      method: 'post',
      config: {
        tags: ['api'],
        validate: CannedValidator.request.addCannedMessage,
        response: {
          schema: CannedValidator.response.addCannedMessage,
        },
        handler: function(request, reply) {
          return cannedController.addCannedMessage(request, reply);
        },
        description: '增加罐頭訊息',
      },
    },
    {
      path: rootPath + '/cannedMessage/{seqno}',
      method: 'put',
      config: {
        tags: ['api'],
        validate: CannedValidator.request.updateCannedMessage,
        response: {
          schema: CannedValidator.response.updateCannedMessage,
        },
        handler: function(request, reply) {
          return cannedController.updateCannedMessage(request, reply);
        },
        description: '修改罐頭訊息',
      },
    },
    {
      path: rootPath + '/cannedMessage/{seqno}',
      method: 'delete',
      config: {
        tags: ['api'],
        validate: CannedValidator.request.delCannedMessage,
        response: {
          schema: CannedValidator.response.delCannedMessage,
        },
        handler: function(request, reply) {
          return cannedController.delCannedMessage(request, reply);
        },
        description: '刪除罐頭訊息',
      },
    },
  {
    path: rootPath + '/cannedMessage/{seqno}',
    method: 'get',
    config: {
      tags: ['api'],
      validate: CannedValidator.request.getCannedMessageById,
      response: {
        schema: CannedValidator.response.getCannedMessageById,
      },
      handler: function(request, reply) {
        return cannedController.getCannedMessageById(request, reply);
      },
      description: '查詢指定罐頭訊息',
    },
  },
];