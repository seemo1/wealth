'use strict';

// Load modules

var Fs = require('fs');
var Path = require('path');
var Util = require('util');
var Hoek = require('hoek');
var Moment = require('moment');

var pathRoot = global.PROJECT_ROOT || Path.join(__dirname, '..');
var logger = require(pathRoot + '/utils/logger');

// var cassandraClient = require(pathRoot + '/utils/cassandra-client');
// var redisClient = require(pathRoot + '/utils/redis-client');
var commonUtil = require('../utils/common-util');
var Promise = require('bluebird');

//logstash
var logger = require('../utils/logger');

if (process.env.NODE_ENV === 'node_env_dev') {
  var Longjohn = require('longjohn');
  Longjohn.async_trace_limit = 5;   // defaults to 10
  //longjohn.async_trace_limit = -1;  // unlimited
  //longjohn.empty_frame = 'ASYNC CALLBACK';
}

// Declare internals
var internals = {
  initialized: false,
  defaults: {
    fileException: pathRoot + '/logs/exception-',
  },
};

exports.register = function(server, options, next) {

  var settings = Hoek.applyToDefaults(internals.defaults, options || {});

  if (internals.initialized) {
    return next();
  }

  internals.initialized = true;

  function cleanUpExit(err) {
    console.log('\n !!!!!!!!! clean up and exit !!!!!!!!! check ' + settings.fileException);

    var formattedErr = {
          message: '',
          stack: '',
          timestamp: Date.now(),
        },
        restart = 0, /** if 0 will shutdown service, 1 will restart it **/
        action, message;

    if (err instanceof Error) {
      formattedErr.message = err.message;
      formattedErr.stack = err.stack;
    } else if (typeof err === 'object') {
      formattedErr.message = Util.inspect(err, {depth: 5});
    } else {
      formattedErr.message = err;
    }

    var stack = new Error().stack;
    logger.error(formattedErr, stack);

    //logger.error(formattedErr);


    try {
      if (formattedErr.message.indexOf('SIGINT') < 0 && formattedErr.message.indexOf('SIGTERM') < 0) {
        //commonUtil.sendErrorMail(JSON.stringify(formattedErr) + stack);
        restart = 1;
      }
      commonUtil.sendErrorMail(JSON.stringify(formattedErr) + stack);
      Fs.appendFileSync(settings.fileException + (new Date().toISOString().substr(0, 10)), JSON.stringify(formattedErr) + stack + '\n');
    }
    catch (e) {
      logger.error('cannot parse formatted error', formattedErr);
    }

    if (restart === 0) {
      action = 'shutdown';
      message = 'disconnected';
    } else {
      action = 'restart';
      message = 're-connect';
    }

    Promise.all([

          require('./../utils/redis-client.js')[action](),
          //require('./../utils/ltscentralmysql-client.js')[action](),
          //require('./../utils/ltsglobalmysql-client.js')[action]()
          //require('./../batch/contest/contest-job-push.js').reset(), /* 重啟服務時,會順便重置比賽的cronJob*/
        ])
        .then(function(conn) {
          /** only restart the services will retrieve connection(conn) object **/
          //console.info(('Contest cronJob ' + message).yellow);
          //server.log('Contest cronJob ' + message);

          console.info(('Redis ' + message).yellow);
          server.log('Redis ' + message);

          //console.info(('MySQL (central) ' + message).yellow);
          //server.log('MySQL (central) ' + message);

          //console.info(('MySQL (global) ' + message).yellow);
          //server.log('MySQL (global) ' + message);


        })
        .then(function() {
          if (restart === 0) {
            process.exit(1);
          }
        })
        .catch(function(e) {
          console.error('Restart storage connection error: %j', e);
        });
  }

  process.on('SIGINT', function() {
    cleanUpExit('received SIGINT');
  });

  process.on('SIGTERM', function() {
    cleanUpExit('received SIGTERM');
  });

  process.on('unhandledRejection', function(reason, p) {
    cleanUpExit('unhandledRejection:' + Util.inspect({promise: p, reason: reason}, {depth: 5}));

    // application specific logging, throwing an error, or other logic here
  });

  process.on('uncaughtException', function(err) {
    cleanUpExit(err);
  });

  //handle request error
  server.on('request-error', function(request, err) {
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

  return next();
};

exports.register.attributes = {
  name: 'exceptionHandle',
  version: '0.0.1',
};
