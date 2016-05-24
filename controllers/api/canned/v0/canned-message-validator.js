'use strict';

const Joi = require("joi");
const Boom = require('../../../../commonlib/boom');

const request = {
  getCannedMessage: {
    headers: Boom.headers,
    query: Joi.object().keys({
      offset: Joi.number().default(0).description('offset'),
      hits: Joi.number().default(10).description('hits'),
    }),
  },
  addCannedMessage: {
    headers: Boom.headers,
    payload: Joi.object().keys({
      message: Joi.string().required().description('message'),
    }),
  },
  delCannedMessage: {
    headers: Boom.headers,
    params: Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
    }),
  },
  updateCannedMessage: {
    headers: Boom.headers,
    params: Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
    }),
    payload: Joi.object().keys({
      message: Joi.string().required().description('message'),
    }),
  },
  getCannedMessageById: {
    //headers: Boom.headers,
    params: Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
    }),
  },

};

exports.request = request;

const response = {
  getCannedMessage: Boom.validatorOk(
    Joi.object().keys({
      length: Joi.number().required().description('total data length'),
      data: Joi.array().items({
        seqno: Joi.number().required().description('seqno'),
        message: Joi.string().required().description('message'),
        publish_time: Joi.number().required().description('publish time'),
        update_time: Joi.number().required().description('update time'),
      }),
    })
  ),
  addCannedMessage: Boom.validatorOk(
    Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
      message: Joi.string().required().description('message'),
      publish_time: Joi.number().required().description('publish time'),
      update_time: Joi.number().required().description('update time'),
    })
  ),
  delCannedMessage: Boom.validatorOk({
    seqno: Joi.number().required().description("insert seqno"),
  }),
  updateCannedMessage: Boom.validatorOk({
    seqno: Joi.number().required().description('seqno'),
    message: Joi.string().required().description('message'),
    publish_time: Joi.number().required().description('publish time'),
    update_time: Joi.number().required().description('update time'),
  }),
  getCannedMessageById: Boom.validatorOk(
    Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
      message: Joi.string().required().description('message'),
      publish_time: Joi.number().required().description('publish time'),
      update_time: Joi.number().required().description('update time'),
    })
  ),
};

exports.response = response;