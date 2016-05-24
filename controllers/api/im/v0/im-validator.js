'use strict';

const Joi = require("joi");
const Boom = require('../../../../commonlib/boom');

const request = {
  getImAccount: {
    headers: Boom.headers,
    query: Joi.object().keys({
      user_id: Joi.string().required().description("user id"),
    }),
  },
};

exports.request = request;

const response = {
  getImAccount: Boom.validatorOk({
    yun_uid: Joi.string().required().description("user yun_uid"),
    token: Joi.string().required().description("yun token"),
  }),
};

exports.response = response;