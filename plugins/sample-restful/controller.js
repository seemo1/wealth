'use strict';

var controller = {};
var model = require('./model');
var Boom = require('boom');
var _ = require('lodash');
var Promise = require('bluebird');

controller.get = function (request, reply) {
  var reqData = request.pre.body;
  if (Object.prototype.hasOwnProperty.call(reqData.data, 'expand')) {
    getWithAdditionalInfo(reqData)
        .then(function (res) {
          reply(res);
        })
        .catch(function (err) {
          reply(new Boom.badImplementation());
        });
  }
  else {
    model.get(reqData.data.id, function (err, res) {
      reply(res);
    })
  }
};

controller.create = function (request, reply) {
  var reqData = request.pre.body;
  model.create(reqData, function (err, res) {
    if (!res) {
      return reply(new Boom.badRequest());
    }

    reply(res).code(201);
  });
};

controller.update = function (request, reply) {
  var reqData = request.pre.body;
  model.update(reqData, function (err, res) {
    if (!res) {
      return reply(new Boom.badRequest());
    }

    reply().code(200);
  });
};

controller.delete = function (request, reply) {
  var reqData = request.pre.body;
  model.delete(reqData, function (err, res) {
    reply(res).code(201);
  });
};

function getWithAdditionalInfo(reqData) {
  return new Promise(function (resolve, reject) {
    model.get(reqData.data.id, reqData.data.expand.split(','), function (err, res) {
      if(err) {
        return reject(err);
      }
      resolve(res);
    });
  });
}

module.exports = controller;
