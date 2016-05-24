'use strict';

// Load modules
const Fs = require('fs');
const Path = require('path');
const Util = require('util');
const Hoek = require('hoek');
const Moment = require('moment');
const pathRoot = global.PROJECT_ROOT || Path.join(__dirname, '..');
const commonUtil = require('../commonlib/common-util');
const logger = require('../commonlib/logger');

// Declare internals
let internals = {
  initialized: false,
  defaults: {
    fileException: pathRoot + '/logs/exception-',
  },
};

exports.register = function(server, options, next) {
  let settings = Hoek.applyToDefaults(internals.defaults, options || {});
  if (internals.initialized) {
    return next();
  }

  internals.initialized = true;

  function cleanUpExit(err) {
    console.log('\n !!!!!!!!! clean up and exit !!!!!!!!! check ' + settings.fileException);
    let now = new Date().getTime();
    let formattedErr = {
      timestamp: Moment(now).format('YYYY-MM-DD HH:mm:ss.SSS [GMT]Z'),
      message: '',
      stack: '',
    };

    if (err instanceof Error) {
      formattedErr.message = err.message;
      formattedErr.stack = err.stack.split('\n');
    } else if (typeof err === 'object') {
      formattedErr.message = Util.inspect(err, {depth: 5});
    } else {
      formattedErr.message = err;
    }

    let stack = new Error().stack;
    logger.error(formattedErr, stack);

    try {
      let log = JSON.stringify(formattedErr, null, 4) + '\n' + stack + '\n';
      commonUtil.sendMail(log.replace('\n', '<br>'));
      Fs.appendFileSync(settings.fileException + Moment(now).format('YYYY-MM-DD'), log);
    }
    catch (e) {
      logger.error('cannot parse formatted error', formattedErr);
    }
  }

  process.on('unhandledRejection', function(reason, p) {
    logger.error('unhandledRejection');
    cleanUpExit('unhandledRejection:' + Util.inspect({promise: p, reason: reason}, {depth: 5}));

    // application specific logging, throwing an error, or other logic here
  });

  process.on('uncaughtException', function(err) {
    logger.error('uncaughtException');
    cleanUpExit(err);
  });

  //handle request error
  server.on('request-error', function(request, err) {
    logger.error('request-error');
    cleanUpExit(err);
  });

  //處理特殊事件，程式不會結束
  //handle hapijs server events without exit
  server.on('request-internal', function(request, event, tags) {
    if (tags.error) {
      logger.logReqMeta('error', 'requestEvent', request,
          {emitter: 'hapijs', task: 'requestEvent', header: request.headers, tags: tags});
    }
  });

  // TODO: 未來存 db 可用，客製化 access log
  // server.on('response', function (request) {
  //   //console.log(request);
  //   console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
  // });

  return next();
};

exports.register.attributes = {
  name: 'exceptionHandle',
  version: '0.0.1',
};
