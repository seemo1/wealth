'use strict';

const Joi = require("joi");
const Boom = require('../../../../commonlib/boom');

const request = {
  getCannedImage: {
    headers: Boom.headers,
    query: Joi.object().keys({
      offset: Joi.number().default(0).description('offset'),
      hits: Joi.number().default(10).description('hits'),
    }),
  },
  addCannedImage: {
    headers: Boom.headers,
    payload: Joi.object().keys({
      image: Joi.object().required().description('image').meta({ swaggerType: 'file' }),
      comment: Joi.string().description('comment'),
    }),
  },
  delCannedImage: {
    headers: Boom.headers,
    params: Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
    }),
  },
  updateCannedImage: {
    headers: Boom.headers,
    params: Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
    }),
    payload: Joi.object().keys({
      image: Joi.object().description('image').meta({ swaggerType: 'file' }),
      comment: Joi.string().default('').description('comment'),
    }),
  },
  getCannedImageById: {
    headers: Boom.headers,
    params: Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
    }),
  },

};

exports.request = request;

const response = {
  getCannedImage: Boom.validatorOk(
    Joi.object().keys({
      length: Joi.number().required().description('total data length'),
      data: Joi.array().items({
        seqno: Joi.number().required().description('seqno'),
        serving_url: Joi.string().required().description('serving_url'),
        comment: Joi.string().empty('').required().description('comment'),
        publish_time: Joi.number().required().description('publish time'),
        update_time: Joi.number().required().description('update time'),
      }),
    })
  ),
  addCannedImage: Boom.validatorOk(
    Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
      serving_url: Joi.string().required().description('serving_url'),
      comment: Joi.string().empty('').required().description('comment'),
      publish_time: Joi.number().required().description('publish time'),
      update_time: Joi.number().required().description('update time'),
    })
  ),
  delCannedImage: Boom.validatorOk({
    seqno: Joi.number().required().description("insert seqno"),
  }),
  updateCannedImage: Boom.validatorOk({
    seqno: Joi.number().required().description('seqno'),
    serving_url: Joi.string().required().description('serving_url'),
    comment: Joi.string().empty('').required().description('comment'),
    publish_time: Joi.number().required().description('publish time'),
    update_time: Joi.number().required().description('update time'),
  }),
  getCannedImageById: Boom.validatorOk(
    Joi.object().keys({
      seqno: Joi.number().required().description('seqno'),
      serving_url: Joi.string().required().description('serving_url'),
      comment: Joi.string().empty('').required().description('comment'),
      publish_time: Joi.number().required().description('publish time'),
      update_time: Joi.number().required().description('update time'),
    })
  ),
};

exports.response = response;