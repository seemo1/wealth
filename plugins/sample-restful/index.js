'use strict';

var router = require('./routers');

exports.register = function(server, options, next) {
  router(server);
  return next();
};

exports.register.attributes = {
  name: 'sample-restful',
  version: '1.0',
};
