'use strict';

global.cassandraClient = null;
global.mysqlCentralPool = {};
global.mysqlCentralClient = {};
global.mysqlPool = {};
global.mysqlClient = {};
global.redisClient = {};
global.redisQueue = {};
global.queueUtil = {};
global.mq = {};

var Promise = require('bluebird');
var cassandraConnect = require('./cassandra-client');
var redisConnect = require('./redis-client');
var redisQueueConnect = require('./queue-util');
var mysqlCentralConnect = require('./ltscentralmysql-client.js');
var mysqlGlobalConnect = require('./ltsglobalmysql-client.js');
var mqConnect = require('./mq-client.js');

var createConnection = function() {
  return Promise.all([
    cassandraConnect.initial(),
    mysqlCentralConnect.initial(),
    mysqlGlobalConnect.initial(),
    redisConnect.initial(),
    redisQueueConnect.initial(),
    mqConnect.initialAsync(),
  ]);
};

var saveConnection = function(connections) {
  return new Promise(function(resolve, reject) {

    cassandraClient = connections[0];
    console.info('Cassandra is ready'.yellow);

    mysqlCentralPool = mysqlCentralClient = connections[1];
    console.info('MySQL(Central) is ready'.yellow);

    mysqlPool = mysqlClient = connections[2];
    console.info('MySQL(Global) is ready'.yellow);

    redisClient = connections[3];
    console.info('Redis is ready'.yellow);

    redisQueue = queueUtil = connections[4];
    console.info('Redis queue connection is ready'.yellow);

    mq = connections[5];
    console.info('MQ service is ready'.yellow);

    resolve();
  });
};

module.exports = function() {
  return createConnection()
      .then(function(connections) {
        return saveConnection(connections);
      });
};
