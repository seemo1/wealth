'use strict';

var Hapi = require('hapi');
var redisConnect = require('../utils/redis-client');
var redisQueueConnect = require('../utils/queue-util');
var mysqlCentralConnect = require('../utils/ltscentralmysql-client.js');
var mysqlGlobalConnect = require('../utils/ltsglobalmysql-client.js');
var cassandraConnect = require('../utils/cassandra-client');
var queueConnection = require('../utils/queue-util');
var mqConnect = require('../utils/mq-client.js');
var server = new Hapi.Server();

global.Promise = require('bluebird');
global.cassandraClient = {};
global.SERVER = server;
global.mysqlCentralPool = {};  /** much safier way when use pool.getConnection and release it when one process done **/
global.mysqlCentralClient = {};

// global.mysqlCloudClient = {};  /** no need it for current environment **/
global.mysqlPool = {};  /** much safier way when use pool.getConnection and release it when one process done **/
global.mysqlClient = {};
global.redisClient = {};
global.redisQueue = {};
global.queueUtil = {};
global.mq = {};

var testServer = {};

testServer.start = function() {
  return Promise.all([
    cassandraConnect.initial(),
    mysqlCentralConnect.initial(),
    mysqlGlobalConnect.initial(),
    redisConnect.initial(),
    redisQueueConnect.initial(),
    queueConnection.initial(),
    mqConnect.initialAsync(),
  ])
      .then(function(conn) {
        cassandraClient = conn[0];
        console.info('Cassandra is ready'.yellow);
        server.log('Cassandra is ready');

        mysqlCentralPool = mysqlCentralClient = conn[1];
        console.info('MySQL(Central) is ready'.yellow);
        server.log('info', 'MySQL(Central) is ready');

        mysqlPool = mysqlClient = conn[2];
        console.info('MySQL(Global) is ready'.yellow);
        server.log('info', 'MySQL(Global) is ready');

        redisClient = conn[3];
        console.info('Redis is ready'.yellow);
        server.log('info', 'Redis is ready');

        redisQueue = conn[4];
        console.info('Redis Queue is ready'.yellow);
        server.log('info', 'Redis Queue is ready');

        queueUtil = conn[5];
        console.info('Redis queue connection is ready'.yellow);
        server.log('info', 'Redis queue connection ');

        mq = conn[6];
        console.info('MQ service is ready'.yellow);
        server.log('info', 'MQ service connection ');
      });
};

module.exports = testServer;
