'use strict';

const Fs = require('fs');
const Path = require('path');
const Hoek = require('hoek');
const Moment = require('moment');

// Declare internals
const internals = {};

internals.defaults = {
  type: 'file',
  file: Path.join(__dirname, '..') + '/logs/access-log-',
};

exports.register = function(server, options, next) {
  let settings = Hoek.applyToDefaults(internals.defaults, options || {});

  server.on('response', function(request) {

    let response = {
      type: request.response.variety,
    };
    switch (response.type) {
      case 'plain' :
        response.data = request.response.source;
        break;
      case 'view'  :
        response.template = request.response.source.template;
        break;
      default : // 'file' do not record
        return;
    }
    response.code = (response.isBoom) ? request.response.output.statusCode : request.response.statusCode;

    //redirect
    if (response.code === 302 || response.code === 301) {
      response.redirect = request.response.headers.location;
    }

    let now = new Date().getTime();
    let execute_time = now - request.info.received;
    let post = {};
    if (request.payload) {
      for (let p in request.payload) {
        if (request.payload[p] instanceof Buffer) {
          post[p] = "Buffer";
          continue;
        }
        if (request.payload[p]._data && request.payload[p]._data instanceof Buffer) {
          post[p] = request.payload[p].hapi;
          continue;
        }
        post[p] = request.payload[p];
      }
    }

    let log = {
      time: Moment(now).format('YYYY-MM-DD HH:mm:ss.SSS [GMT]Z'),
      execute_time: execute_time + 'ms',
      client: {
        ip: request.info.remoteAddress,
        referrer: request.info.referrer,
        received: Moment(request.info.received).format('YYYY-MM-DD HH:mm:ss.SSS [GMT]Z'),
      },
      route: {
        method: request.route.method,
        path: request.route.path,
      },
      request: {
        id: request.id,
        url: request.url.path,
        method: request.method.toUpperCase(),
        mime: request.mime,
        headers: request.headers,
        route: request.params,
        get: request.query,
        post: post,
      },
      response: response,
      locale: request.i18n.locale
    };

    //unset data
    delete log.request.headers.cookie;

    Fs.appendFileSync(settings.file + Moment(now).format('YYYY-MM-DD'), JSON.stringify(log, null, 4) + ',\n');
  });

  return next();
};

exports.register.attributes = {
  name: 'access-log',
  version: '0.1.0',
};
/*
  常用資料說明
  request.id      : unique request id
  request.method  : http request method
  request.mime    : http request mime type
  request.headers : request headers
  request.params  : router rules parameters
  request.query   : get method parameters (the key-value part of the URI between '?' and '#')
  request.payload : post method parameters

  request.info               : about client
  request.info.received      : received timestamp
  request.info.host          : reqeust host (ex: localhost:8000)
  request.info.hostname      : request hostname (ex: localhost)
  request.info.remoteAddress : client ip
  request.info.remotePort    : client port
  request.info.referrer      : client referrer

  request.url      : about request url
  request.url.path : request url path

  request.response                   : about server response
  request.response.variety           : response type
     'file': static file
     'view': reply.view()
     'plain': reply()
  request.response.statusCode        : no error, and response code
  request.response.source            : server response data
  request.response.isBoom            : has error
  request.response.output.statusCode : response error code when isBoom=true
  request.response.source.template   : user view template when variety=view
  request.response.source.settings.compileOptions.filename : template name

  request.route        : about route
  request.route.method : 'get'
  request.route.path   : route rules path
*/