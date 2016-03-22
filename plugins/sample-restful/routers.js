'use strict';

var basePath = '/todos/v1';
var requestUtil = require('../../utils/request-util'); //dependency, figure out how to remove this :)
var controller = require('./controller');
var validator = require('./validator');

module.exports = function(server) {

  server.route([
    {
      path: basePath + '/{id}',
      method: 'GET',
      config: {
        tags: ['api'],
        pre: [{method: requestUtil.validateHeader, assign: 'body'}],
        validate: validator.getTodo,
        handler: controller.get,
        description: 'Get todo by id'
      },
    },
    {
      path: basePath + '/',
      method: 'POST',
      config: {
        pre: [{method: requestUtil.validateHeader, assign: 'body'}],
        validate: validator.createTodo,
        handler: controller.create,
        description: 'Create a new todo',
        tags: ['api']
      },
    },
    {
      path: basePath + '/{id}',
      method: 'PUT',
      config: {
        pre: [{method: requestUtil.validateHeader, assign: 'body'}],
        validate: validator.updateTodo,
        handler: controller.update,
        description: '編輯',
        tags: ['api']
      },
    },
    {
      path: basePath + '/{id}',
      method: 'DELETE',
      config: {
        pre: [{method: requestUtil.validateHeader, assign: 'body'}],
        validate: validator.deleteTodo,
        handler: controller.delete,
        description: 'Delete todo',
        tags: ['api']
      },
    },
  ])
  ;
}

;
