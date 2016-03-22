'use strict';

var settingController = {};
var settingsModel = require('./settings-model-v0');
var Boom = require('boom');
var logTag = '[System Settings]';
var systemSettings = require('../../../commonlib/settings-common');

settingController.get = function(request, reply) {
  settingsModel.get()
        .then(function(result) {
          reply(result);
        })
        .catch(function(err) {
          reply([]);
        });
};

settingController.add = function(request, reply) {
  settingsModel.add(request.payload)
        .then(function(res) {
          reply(200);
        })
        .catch(function(err) {
          reply(err);
        });
};

settingController.update = function(request, reply) {
  settingsModel.update(request.payload)
        .then(function(res) {
          reply(200);
        })
        .catch(function(err) {
          reply(err);
        });
};

settingController.getValue = function(request, reply) {
  reply(systemSettings.get(request.params.type, request.params.key));
};

module.exports = settingController;
