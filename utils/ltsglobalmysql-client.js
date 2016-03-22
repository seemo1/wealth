'use strict';

var Config = require('config'),
    MySQL = require('mysql'),
    _ = require('lodash');

var options = {
  connectionLimit: 25,
  host: Config.get('LTSGlobalMySQL.host'),
  user: Config.get('LTSGlobalMySQL.account'),
  password: Config.get('LTSGlobalMySQL.password'),
  database: Config.get('LTSGlobalMySQL.database'),
  port: Config.get('LTSGlobalMySQL.port') || 3306,
};

function initial(connectionLimit) { /* 增加可以指定連線數的邏輯 */
  var getType = typeof(connectionLimit) ;
  if( getType != 'undefined' && ( getType == 'number' || getType == 'string' ) ){
    options.connectionLimit = connectionLimit;
    console.log(options);
  }
  return new Promise(function(resolve) {
    var pool = MySQL.createPool(options);
    mysqlPool = mysqlClient = pool;
    return resolve(pool);
  });
}

function shutdown() {
  return new Promise(function(resolve, reject) {
    if (_.has(mysqlClient, 'end')) {
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
      if (_.has(mysqlPool, 'end')) {
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
      console.error(e);
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
