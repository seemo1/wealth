'use strict';

const Joi = require('joi');

let validator = {
  index: {
    query: Joi.object().keys({
      user: Joi.string().required().description('username'),
    }),
  },
};

module.exports = validator;
