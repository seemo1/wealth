'use strict';

const Fs = require('fs');
const Path = require('path');
const Hoek = require('hoek');
const Moment = require('moment');

// Declare internals
const internals = {};

internals.defaults = {
  type: 'file',
  file: Path.join(__dirname, '..') + '/logs/hapi-log-',
};

exports.register = function(server, options, next) {
  let settings = Hoek.applyToDefaults(internals.defaults, options || {});

  server.on('log', (event, tags) => {
    log('server.log', event);
  });

  server.on('request', (request, event, tags) => {
    log('request.log', event);
  });

  function log(type, event) {
    let now = new Date().getTime();
    let log = {
      type: type,
      time: Moment(event.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS [GMT]Z'),
      tags: event.tags,
      data: event.data,
      internal: event.internal,
    };
    if (type === 'request.log') {
      log.request_id = event.request;
    }

    Fs.appendFileSync(settings.file + Moment(now).format('YYYY-MM-DD'), JSON.stringify(log, null, 4) + ',\n');
  }

  return next();
};

exports.register.attributes = {
  name: 'hapi-log',
  version: '0.1.0',
};
