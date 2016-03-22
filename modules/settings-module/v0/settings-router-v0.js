'use strict';

var rootPath = '/settings/v0';
var settingsController = require('./settings-controller-v0');

module.exports = function(server) {
  server.route({method: 'GET', path: rootPath, handler: settingsController.get});
  server.route({method: 'POST', path: rootPath, handler: settingsController.add});
  server.route({method: 'PUT', path: rootPath, handler: settingsController.update});
  server.route({method: 'GET', path: rootPath + '/{type}/{key}', handler: settingsController.getValue});
};
