"use strict";

const Joi = require("joi");
const Boom = require('../../../commonlib/boom');

const request = {
  login: {
    payload: Joi.object().keys({
      email   : Joi.string().required().description("email"),
      password: Joi.string().required().description("password"),
    }),
  },
};

exports.request = request;

const response = {
  login: Boom.validatorOk({
      name: Joi.string().description("user's name"),
      token: Joi.string().description("user's token"),
  }),
};

exports.response = response;