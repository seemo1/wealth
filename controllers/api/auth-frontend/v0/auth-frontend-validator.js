'use strict';

const Joi = require("joi");
const Boom = require('../../../../commonlib/boom');

const request = {
  login: {
    headers: Boom.headers,
    payload: Joi.object().keys({
      user_id: Joi.string().required().description("user id"),
    }),
  },
};

exports.request = request;

const response = {
  login: Boom.validatorOk({
    yun_uid: Joi.string().description("user yun_uid"),
    token: Joi.string().description("yun token"),
  }),
};

exports.response = response;