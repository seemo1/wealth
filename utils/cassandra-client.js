'use strict';

//INFO: create keyspace command
//CREATE KEYSPACE IF NOT EXISTS fdtsocial WITH REPLICATION = {'class':'NetworkTopologyStrategy', 'DC1': 3} AND DURABLE_WRITES = true;
//"CREATE KEYSPACE IF NOT EXISTS fdtsocial WITH replication = { 'class':'SimpleStrategy', 'replication_factor': 3 };"

var Config = require('config');
var logger = require('./logger');
var cassandra = require('cassandra-driver');
var distance  = cassandra.types.distance;
var Promise = require('bluebird');

var option = {
  contactPoints: Config.get('Cassandra.host'),
  /** add connection pool Added by Kim **/
  pooling: {
    coreConnectionsPerHost: {
      warmup: true,
    },
  },
  socketOptions: { connectTimeOut: 50000 },
  keyspace: Config.get('Cassandra.keyspace'),
  authProvider: new cassandra.auth.PlainTextAuthProvider(Config.get('Cassandra.username'), Config.get('Cassandra.password')),
};

option.pooling.coreConnectionsPerHost[distance.local] = 8;
option.pooling.coreConnectionsPerHost[distance.remote] = 4;

function initialCassandra() {
  var _conn = new cassandra.Client(option);

  return new Promise(function(resolve, reject) {
    _conn.connect(function(err) {
      _conn.on('log', function(level, className, msg) {
        if ('verbose' !== level) {
          logger.log(level, msg);
        }
      });

      if (err) {
        return reject(err);
      }

      cassandraClient = this;
      resolve(this);
    });
  });
}

function shutdown() {
  return new Promise(function(resolve, reject) {
    if (cassandraClient) {
      cassandraClient.shutdown(function(err) {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    } else {
      resolve();
    }
  });
}

function restart() {
  return shutdown().then(initialCassandra);
}

module.exports = {
  initial: initialCassandra,
  shutdown: shutdown,
  restart: restart,
};
