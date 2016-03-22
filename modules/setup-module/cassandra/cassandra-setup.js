'use strict';

var logger = require('../../../utils/logger');
var Async = require('async');
var _ = require('lodash');
var cassandraSetup = {};
var cqlScript = require('../../../schema/cql_script');
var Promise = require('bluebird');

cassandraSetup.createKeySpecs = {};

cassandraSetup.setup = function(request, reply) {
  Async.mapSeries(cqlScript, cassandraSetup.execute, function(err, result) {
    if (err) {
      reply(err);
    } else {
      reply(result.join('<br>'));
    }
  });
};

cassandraSetup.execute = function(item, callback) {
  new Promise(function(resolve, reject) {
    cassandraClient.execute(item.cql, function(error, success) {
      if (error) {
        logger.error(error);
        reject(item.do + ' fail!');

      } else {
        console.log(item.cql);
        resolve(item.do + ' done');
      }
    });
  })
        .then(function(success) {
          callback(null, success);
        })
        .catch(function(err) {

          callback(err, null);
        });
};

module.exports = cassandraSetup;
