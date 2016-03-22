/**
 * Created by rayson on 15/6/9.
 */
'use strict';
var Config = require('config'),
    MySQL = require('mysql'),
    _ = require('lodash');

var options = {
  connectionLimit: 25,
  host: Config.get('LTSCentralMySQL.host'),
  user: Config.get('LTSCentralMySQL.account'),
  password: Config.get('LTSCentralMySQL.password'),
  database: Config.get('LTSCentralMySQL.database'),
  port: Config.get('LTSCentralMySQL.port') || 3306,
};

function initial() {
  return new Promise(function(resolve) {
    var pool = MySQL.createPool(options);
    mysqlCentralPool = mysqlCentralClient = pool;
    return resolve(pool);
  });
}

function shutdown() {
  return new Promise(function(resolve, reject) {
    if (_.has(mysqlCentralClient, 'end')) {
      mysqlCentralClient.end(function(err) {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    } else {
      resolve();
    }
  })
    .then(function() {
      if (_.has(mysqlCentralPool, 'end')) {
        mysqlCentralPool.end(function(err) {
          if (err) {
            throw new Error(err);
          }

          return true;
        });
      } else {
        return true;
      }
    })
    .catch(function(e) {
      throw new Error(e);
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
