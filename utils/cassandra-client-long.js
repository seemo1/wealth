'use strict';

//INFO: create keyspace command
//CREATE KEYSPACE IF NOT EXISTS fdtsocial WITH REPLICATION = {'class':'NetworkTopologyStrategy', 'DC1': 3} AND DURABLE_WRITES = true;
//"CREATE KEYSPACE IF NOT EXISTS fdtsocial WITH replication = { 'class':'SimpleStrategy', 'replication_factor': 3 };"

var Config = require('config');
var logger = require('./logger');
var Cassandra = require('cassandra-driver');

var cassandraClient = new Cassandra.Client(
    {
      contactPoints: Config.get('Cassandra.host'),
      socketOptions: { connectTimeOut: 660000 },
      keyspace: Config.get('Cassandra.keyspace'),
    }
);

cassandraClient.on('log', function(level, className, message) {
  if (level != 'verbose') {
    logger.log(level, message);
  }
});

module.exports = cassandraClient;
