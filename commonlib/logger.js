'use strict';

/**
 *
 * It's the Winston logs common library.
 *
 * Author: seemo
 * Date: 2016/3/31
 *
 */

var _ = require('lodash');
var Moment = require('moment');
var Winston = require('winston');
require('winston-logstash');

//handle timestamp format use localtime
let logTime = () => {
  return Moment().format();
}

//處理 logs 的分類
let loadSetting = () => {
  let result = [];
  result.push(
      new (Winston.transports.Console)({
        name: 'console',
        colorize: true,
        prettyPrint: true,
      })
  );
  //all level setting
  result.push(
      new (require('winston-daily-rotate-file'))({
        name: 'all-file',
        filename: 'logs/winston-all',
        timestamp: logTime,
        datePattern: '.yyyy-MM-dd',
      })
  )
  //debug level setting
  result.push(
      new (require('winston-daily-rotate-file'))({
        name: 'debug-file',
        filename: 'logs/winston-debug',
        level: 'debug',
        timestamp: logTime,
        datePattern: '.yyyy-MM-dd',
      })
  );
  //error level setting (error & info write to same file)
  result.push(
      new (require('winston-daily-rotate-file'))({
        name: 'error-file',
        filename: 'logs/winston-error',
        level: 'error',
        timestamp: logTime,
        datePattern: '.yyyy-MM-dd',
      })
  );
  //info level setting (error & info write to same file)
  result.push(
      new (require('winston-daily-rotate-file'))({
        name: 'info-file',
        filename: 'logs/winston-error',
        level: 'info',
        timestamp: logTime,
        datePattern: '.yyyy-MM-dd',
      })
  );
  return result;
}

//初始化winston
let logger = new Winston.Logger({
  exitOnError: false,
  transports: loadSetting(),
});



//enable logstashTcp logger
logger.enableLogstashTcp = function() {
  var systemSettings = require('settings-common');
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
    reqId: _.clone(request.id),
    reqPath: _.clone(request.path),
    reqMethod: _.clone(request.method),
  };
  ['payload', 'query', 'params'].forEach(function(inputType) {
    if (_.has(request, inputType) && !_.isEmpty(request[inputType])) {
      meta['req' + inputType.charAt(0).toUpperCase() + inputType.substr(1)] = _.clone(request[inputType]);
    }
  });

  if (_.has(request, 'pre.body.user.Id')) {
    meta.userId = _.clone(request.pre.body.user.Id);
  }

  if (inputMeta) {
    meta = _.merge(meta, _.cloneDeep(inputMeta));
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
