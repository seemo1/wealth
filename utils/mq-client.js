'use strict';

/**
 *
 * It's the rabbitmq (AMQP) connection client
 *
 * Author: Kim Hsiao
 * Date: 2015/10/21
 *
 */

var amqp = require('amqplib/callback_api'),
    util = require('util'),
    Config = require('config'),
    Async = require('async'),
    Promise = require('bluebird'),
    as = Config.get('RabbitMQ');

var amqpHost = util.format('amqp://%s:%s@%s:%s/%s', as.user, as.password, as.host, as.port, as.vhost),
    q = 'im';

function initial(callback) {
  Async.waterfall([
        function(cb) {
          amqp.connect(amqpHost, cb);
        },

        function(conn, cb) {
          conn.on('error', function(err) {
            return console.error('[AMQP] connection error: %j', err);
          });

          conn.on('close', function() {
            return console.info('[AMQP] connection closed');
          });

          conn.createConfirmChannel(cb);
        },
    ], function(err, result) {
      if (err) {
        return console.error('[AMQP] connection error: %j', err);
      }

      callback(null, result);
    });
}

function promise() {
  return new Promise(function(resolve, reject) {
    initial(function(err, ch) {
      if (err) {
        return reject(err);
      }

      return resolve(ch);
    });
  });
}

module.exports = {
  initial: initial,
  initialAsync: promise,
};
