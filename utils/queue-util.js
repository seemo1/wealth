//REF: https://github.com/mpneuried/rsmq-worker
'use strict';

var Config = require('config');
var RSMQWorker = require('../commonlib/redis-worker');

function initial() {
  return new Promise(function(resolve, reject) {
    var _conn = new RSMQWorker('fdt', {
      host: Config.get('Redis.host'),
      port: Config.get('Redis.port'),
      alwaysLogErrors: true,
      defaultDelay: 0,
    });

    _conn.on('error', function(err) {
      return reject(err);
    });

    _conn.on('ready', function() {
      redisQueue = _conn;
      return resolve(_conn);
    });
  });
}
/*
 SAMPLE

 .send( msg [, delay ][, cb ] )

 msg : ( String of msgObject ): The rsmq message. In best practice it's a stringified JSON with additional data.
 delay : ( Number optional; default = 0 ): The message delay to hide this message for the next x seconds.
 cb : ( Function optional ): An optional callback to get a secure response for a successful send.

 msgObject : {product: 'product name', module: 'notification', method: 'method name', data: {...}
 redisQueue.send(JSON.stringify(msgObject), 120, function (res) {
    console.log(res);
 });

*/

module.exports = {
  initial: initial,
};
