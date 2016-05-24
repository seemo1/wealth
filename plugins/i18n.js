'use strict';
// from https://github.com/mashpie/i18n-node
const Fs = require('fs');
const Path = require('path');
const Hoek = require('hoek');
const Moment = require('moment');
const I18n = require('i18n');
const Logger = require('../commonlib/logger');

// Declare internals
const internals = {};
const TAG = '[i18n]';
internals.defaults = {
  locales: ['en', 'cn', 'tw'],
  defaultLocale: 'en',
  directory: 'lang',

  // sets a custom cookie name to parse locale settings from - defaults to NULL
  // not working in hapi-i18n
  // cookie: 'yourcookiename',

  // query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
  // not working in hapi-i18n
  queryParameter: 'lang',

  // 雖說官網有支援 .js 但 i18n-node source 也只是用 fs 把 js 讀進來(不是 module.exports)，所以也等於是 json (不能像 js 能註解)
  extension: '.json',

  //register: global.i18n,
  updateFiles: false,
  indent: '    ', //4 space
  autoReload: false,
};

exports.register = function(server, options, next) {
  let settings = Hoek.applyToDefaults(internals.defaults, options || {});

  //擴展讓 i18n 支援 queryParameter
  I18n.configure(settings);
  server.ext('onPreAuth', function(request, reply) {
    request.i18n = {};
    I18n.init(request, request.i18n);
    if (request.headers && request.headers['x-language']) {
      request.i18n.setLocale(request.headers['x-language'].toLowerCase());
    }
    if (settings.queryParameter && settings.queryParameter != '') {
      if (request.query && request.query[settings.queryParameter] && settings.queryParameter != '') {
        request.i18n.setLocale(request.query[settings.queryParameter].toLowerCase());
      }
    }

    return reply.continue();
  });

  server.ext('onPreResponse', function(request, reply) {
    if (!request.i18n || !request.response) {
      return reply.continue();
    }

    var response = request.response;
    if (response.variety === 'view') {
      if (!response.source.context) {
        response.source.context = {};
      }
      response.source.context.i18n = {};
      response.source.context.i18n = Hoek.merge(response.source.context.i18n || {}, request.i18n);
    }

    return reply.continue();
  });

  return next();
};

exports.register.attributes = {
  name: 'i18n',
  version: '0.1.0',
};
