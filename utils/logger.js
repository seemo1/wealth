'use strict';

var Lodash = require('lodash');
var Winston = require('winston');
require('winston-logstash');

var logger = new Winston.Logger({
  exitOnError: false,
  transports: [
        new (Winston.transports.Console)({
          name: 'console',
          colorize: true,
          prettyPrint: true,
        }),
    new (require('winston-daily-rotate-file'))({
      name: 'all-file',
      filename: 'logs/winston-all',
      datePattern: '.yyyy-MM-dd',
    }),
    new (require('winston-daily-rotate-file'))({
      name: 'error-file',
      filename: 'logs/winston-error',
      level: 'error',
      datePattern: '.yyyy-MM-dd',
    })
    ]
});

//enable logstashTcp logger
logger.enableLogstashTcp = function() {
  var systemSettings = require('../commonlib/settings-common');
  if (systemSettings.getD('logstashTcp', 'send', 'N') === 'Y') {
    logger.add(Winston.transports.Logstash, {
      name: 'logstash-tcp',

      //level: 'info', // this has no use
      colorize: false,
      port: systemSettings.getD('logstashTcp', 'port', '28777'),
      node_name: systemSettings.getD('logstashTcp', 'node_name', 'dev-web01'),
      host: systemSettings.getD('logstashTcp', 'host', '127.0.0.1'),
    });
  }
};

//logger.setLevels(Winston.config.syslog.levels);
//request 內屬性必須用clone複製，否則會造成request無法釋放，可能會與下一個request值重疊
logger.cookReqMeta = function(request, inputMeta) {
  var meta = {
    reqId: Lodash.clone(request.id),
    reqPath: Lodash.clone(request.path),
    reqMethod: Lodash.clone(request.method),
  };
  ['payload', 'query', 'params'].forEach(function(inputType) {
    if (Lodash.has(request, inputType) && !Lodash.isEmpty(request[inputType])) {
      meta['req' + inputType.charAt(0).toUpperCase() + inputType.substr(1)] = Lodash.clone(request[inputType]);
    }
  });

  if (Lodash.has(request, 'pre.body.user.Id')) {
    meta.userId = Lodash.clone(request.pre.body.user.Id);
  }

  if (inputMeta) {
    meta = Lodash.merge(meta, Lodash.cloneDeep(inputMeta));
  }

  return meta;
};

logger.logReqMeta = function(level, msg, request, inputMeta) {
  logger.log(level, msg, logger.cookReqMeta(request, inputMeta));
};

module.exports = logger;

////第一種用法，只用一次
//logger.logReqMeta('info', '第一種用法，只用一次', request, {code: 'hapi_log.js', task: 'helloHandler'});

////第二種用法，request先保存下來，避免重複呼叫
//var logMeta = logger.cookReqMeta(request, { code: 'hapi_log.js', task: 'callingCassandra'});
//logger.info('第二種用法，request先保存下來，避免重複呼叫 result of callingCassadra', logMeta);

//logMeta.task = 'callingMySQL';
//logger.error('第二種用法，避免重複呼叫 result of callingMySQL', logMeta);
