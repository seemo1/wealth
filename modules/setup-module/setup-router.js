'use strict';

var cassandraSetup = require('./cassandra/cassandra-setup');
var MySQLSetup = require('./mysql/mysql-setup');

var rootPath = '/setup';

module.exports = function(server) {
  server.route({method: ['GET'], path: rootPath + '/buildKeyspace', handler: cassandraSetup.setup});
  server.route({method: 'GET', path: rootPath + '/mysql', handler: MySQLSetup.setup});

};

