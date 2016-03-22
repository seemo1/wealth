'use strict';

var Config = require('config');
var Redis = require('redis');
var logger = require('./logger');
var Promise = require('bluebird');

function initial() {
  return new Promise(function(resolve, reject) {
    var _conn = Redis.createClient(Config.get('Redis.port'), Config.get('Redis.host'));

    _conn.on('ready', function() {
      redisClient = _conn;
      return resolve(_conn);
    });

    _conn.on('error', function(err) {
      return reject(err);
    });
  });
}

function shutdown() {
  return new Promise(function(resolve, reject) {
    if (redisClient) {
      redisClient.end();
    }

    resolve();
  });
}

function restart() {
  return shutdown().then(initial);
}

module.exports = {
  initial: initial,
  shutdown: shutdown,
  restart: restart,
};
