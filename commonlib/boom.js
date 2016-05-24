'use strict';
const Joi = require("joi");
let Boom  = require('boom');

Boom.ok = function(result) {
  return {
    statusCode: 200,
    message: "ok",
    result: result,
  };
};

Boom.noContent = function(result) {
  return {
    statusCode: 204,
    message: "No Content",
    result:result,
  };
}

// ok 改，這裡也要改
Boom.validatorOk = function(result) {
  return Joi.object({
    statusCode: Joi.number(),
    message: Joi.string(),
    result: result,
  }).label("Result");
}

//
Boom.headers = Joi.object().keys({
    'x-token': Joi.string().required('server token'),
    'x-language': Joi.string().required('client app language'),
    'x-country': Joi.string().required('client country area'),
    //'x-market': Joi.string().required(''),
  }).options({allowUnknown: true})


module.exports = Boom;