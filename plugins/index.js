'use strict';

const Config = require('config');

let plugins = [
  require('inert'),
  require('vision'),
  {
    register: require('hapi-router'),
    options: {
      routes: 'controllers/**/*router.js' // uses glob to include files
    },
  },
  {
    register: require('yar'), // session
    options: {
      storeBlank: false,
      name: 'sessionid',
      maxCookieSize: 0, //set zero , always save to redis
      cache: {
        cache: 'redisCache',
        segment: 'session',
        expiresIn: Config.get('Session.expire'), // 4 * 60 * 60 * 1000 = 4 hr
      },
      cookieOptions: {
        password: Config.get('Session.secret'),
        isSecure: Config.get('Session.isSecret'), //need https
        isHttpOnly: Config.get('Session.isHttpOnly'),
        path: '/',
        ttl: Config.get('Session.ttl'),
      },
    },
  },
  require('./exception-handle'),
];


if (Config.get('Server.environment') !== 'production') {
  plugins.push(require('./api-docs'));
  plugins.push(require('./access-log'));
  plugins.push(require('./hapi-log'));
}

//i18n
let i18n = {
  register: require('./i18n.js'),
  options: {}
}
if (Config.get('Server.environment') === 'development') {
  i18n.options.autoReload = true;
}
plugins.push(i18n);

module.exports = plugins;
