'use strict';

const CannedController = require('./canned-image-controller');
const CannedValidator = require('./canned-image-validator');

let rootPath = '/api/canned/v0';
let cannedController = new CannedController();
module.exports = [
  {
    path: rootPath + '/cannedImage',
    method: 'get',
    config: {
      tags: ['api'],
      validate: CannedValidator.request.getCannedImage,
      response: {
        schema: CannedValidator.response.getCannedImage,
      },
      handler: function(request, reply) {
        return cannedController.getCannedImage(request, reply);
      },
      description: '取得罐頭圖片',
    },
  },
  {
    path: rootPath + '/cannedImage',
    method: 'post',
    config: {
      tags: ['api'],
      validate: CannedValidator.request.addCannedImage,
      response: {
        schema: CannedValidator.response.addCannedImage,
      },
      handler: function(request, reply) {
        return cannedController.addCannedImage(request, reply);
      },
      payload: {
        allow: 'multipart/form-data',
        output: 'stream',
      },
      description: '增加罐頭圖片',
    },
  },
  {
    path: rootPath + '/cannedImage/{seqno}',
    method: 'put',
    config: {
      tags: ['api'],
      validate: CannedValidator.request.updateCannedImage,
      response: {
        schema: CannedValidator.response.updateCannedImage,
      },
      handler: function(request, reply) {
        return cannedController.updateCannedImage(request, reply);
      },
      payload: {
        allow: 'multipart/form-data',
        output: 'stream',
      },
      description: '修改罐頭圖片',
    },
  },
  {
    path: rootPath + '/cannedImage/{seqno}',
    method: 'delete',
    config: {
      tags: ['api'],
      validate: CannedValidator.request.delCannedImage,
      response: {
        schema: CannedValidator.response.delCannedImage,
      },
      handler: function(request, reply) {
        return cannedController.delCannedImage(request, reply);
      },
      description: '刪除罐頭圖片',
    },
  },
  {
    path: rootPath + '/cannedImage/{seqno}',
    method: 'get',
    config: {
      tags: ['api'],
      validate: CannedValidator.request.getCannedImageById,
      response: {
        schema: CannedValidator.response.getCannedImageById,
      },
      handler: function(request, reply) {
        return cannedController.getCannedImageById(request, reply);
      },
      description: '查詢指定罐頭圖片',
    },
  },
];