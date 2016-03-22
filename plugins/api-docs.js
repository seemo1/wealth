'use strict';

var Swaggered = require('hapi-swaggered');
var SwaggeredUi = require('hapi-swaggered-ui');

var hapiSwaggered = {
  register: Swaggered,
  options: {

    tagging: {
      mode: 'path', //依路徑分群組
      pathLevel: 2  //路徑分組時的層次
    },
    tags: {
      'todos/v1': 'Sample todo description',
    },
  },
};

var hapiSwaggeredUi = {
  register: SwaggeredUi,
  options: {
    title: 'FDT.io',
  },
};

exports.register = function(server, options, next) {
  server.register(hapiSwaggered, {
    select: 'api',
    routes: {
      prefix: '/swagger',
    },
  }, function(err) {
    if (err) {
      throw err;
    }
  });

  server.register(hapiSwaggeredUi, {
    select: 'api',
    routes: {
      prefix: '/docs',
    },
  }, function(err) {
    if (err) {
      throw err;
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'fdt-docs',
  version: '1.0',
};
