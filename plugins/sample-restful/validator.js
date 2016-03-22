'use strict';

var Joi = require('joi');
var Boom = require('boom');

var schema = {
  header: Joi.object().keys({
    'x-token': Joi.string().required(),
    'x-language': Joi.string().required(),
    'x-country': Joi.string().required(),
  }),
  todo: Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.date().format('YYYY-MM-DD').required(),
    endDate: Joi.date().format('YYYY-MM-DD').required(),
    description: Joi.string().required(),
    extraInfo: Joi.object({
      location: Joi.string().optional(),
      priority: Joi.string().optional(),
    }).optional(),
  }),
  editTodo: Joi.object().keys({
    name: Joi.string().optional(),
    endDate: Joi.date().format('YYYY-MM-DD').optional(),
    description: Joi.string().optional(),
    extraInfo: Joi.object({
      location: Joi.string().optional(),
      priority: Joi.string().optional(),
    }).optional(),
  }),
};

var validator = {
  getTodo: {
    headers: schema.header,
    params: {
      id: Joi.string().required(),
    },
  },
  createTodo: {
    headers: schema.header,
    payload: schema.todo,
    failAction: failHandler,
  },
  updateTodo: {
    headers: schema.header,
    params: {id: Joi.string().required()},
    payload: schema.editTodo,
    failAction: failHandler,
  },
  deleteTodo: {
    headers: schema.header,
    params: {id: Joi.string().required()},
    failAction: failHandler,
  },
};

function failHandler(request, reply, source, error) {
  if (source === 'headers') {
    return reply(new Boom.unauthorized('Invalid headers'));
  }

  reply(new Boom.badData(error));
}

module.exports = validator;
