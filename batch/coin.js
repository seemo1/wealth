'use strict';

var Config = require('config');
var CronJob = require('cron').CronJob;
var _ = require('lodash');
var Moment = require('moment');
var logger = require('../utils/logger');
var Async = require('async');
var commonUtil = require('../utils/common-util');

var Rfr = require('rfr');
var transactionModel = Rfr('/modules/transaction-module/v0/transaction-model-v0');

var MARKET = Config.get('MarketCode');

var TOPIC = _.template('/topic/GLOBAL.${market}-MQ.channel');
var SELF_QUEUE = '/queue/social-batch-' + MARKET;

var parseString = require('xml2js').parseString;

var Stomp = require('stompjs');
var client, timeoutId;

var cassandraConnect = require('../utils/cassandra-client');
var redisConnect = require('../utils/redis-client');
var mysqlCentralConnect = require('../utils/ltscentralmysql-client.js');
var mysqlGlobalConnect = require('../utils/ltsglobalmysql-client.js');

global.Promise = require('bluebird');
global.cassandraClient = null;
global.mysqlCentralPool = {};  /** much safier way when use pool.getConnection and release it when one process done **/
global.mysqlCentralClient = {};

// global.mysqlCloudClient = {};  /** no need it for current environment **/
global.mysqlPool = {};  /** much safier way when use pool.getConnection and release it when one process done **/
global.mysqlClient = {};
global.redisClient = {};

var xml = _.template(
    '<com.cyanspring.common.event.account.CoinSettingRequestEvent>\n\
     <key>${ txId }</key>\n\
     <priority>NORMAL</priority>\n\
     <sender>social-batch-${ market }</sender>\n\
     <txId>${ txId }</txId>\n\
     <market>${ market }</market>\n\
     <userId>${ userId }</userId>\n\
     <endDate>${ dateEnd }</endDate>\n\
     <coinType>${ coinType }</coinType>\n\
</com.cyanspring.common.event.account.CoinSettingRequestEvent>\n');

Promise.all([
        cassandraConnect.initial(),
        mysqlCentralConnect.initial(),
        mysqlGlobalConnect.initial(),
        redisConnect.initial(),
    ])
    .then(function(conn) {
      global.cassandraClient = conn[0];
      console.info('Cassandra is ready'.yellow);

      global.mysqlCentralPool = global.mysqlCentralClient = conn[1];
      console.info('MySQL(Central) is ready'.yellow);

      global.mysqlPool = global.mysqlClient = conn[2];
      console.info('MySQL(Global) is ready'.yellow);

      global.redisClient = conn[3];
      console.info('Redis is ready'.yellow);
    })
    .catch(function(e) {
      console.error(e);
    });

function stompConnect() {

  client = Stomp.overTCP(Config.get('LTSGlobalMQ.host'), Config.get('LTSGlobalMQ.port'));

  logger.info('Connecting to LTS MQ');

  //setTimeout(function () {
  //    if (!client.connected) {
  //        stompConnect();
  //    }
  //}, 5000);

  client.connect('', '', function() {

    client.subscribe(SELF_QUEUE, function(message) {
      logger.debug('GOT A SELF QUEUE MESSAGE', message);

      parseString(message.body, {explicitRoot: false, explicitArray: false}, function(err, result) {
        logger.debug(result);

        if (result.isOk === 'true') {

          transactionModel.confirmCoinOrder(result.userId, result.txId, true, function(res) {
            logger.info(res);
          });
        } else {
          transactionModel.confirmCoinOrder(result.userId, result.txId, false, function(res) {
            logger.info(res);
          });
        }
      });
    });
  }, stompFailureCallback);
}

var stompFailureCallback = function(error) {
  logger.error('STOMP: ' + error);

  if (!timeoutId) {
    timeoutId = setTimeout(stompReconnect, 10000);
    logger.info('STOMP: Reconnect in 10 seconds');
  }
};

function stompReconnect() {
  stompConnect();
  timeoutId = null;
}

stompConnect();

new CronJob('0 15 * * * *', function() {
  logger.info('Processing auto-renew');

  transactionModel.getSubscriptionsToRenewByMarket(MARKET, function(subscriptions) {
    logger.info('Renew Number:', subscriptions.length);
    logger.debug(subscriptions);

    Async.forEachOfSeries(subscriptions, function(sub, index, callback) {

      var txId = 'batch' + Date.now();

      transactionModel.addCoinOrder(sub.user_id, txId, sub.market, sub.feature, 1, sub.auto_renew,
                'batch', 'batch', function(res) {

                  logger.info(res);
                  callback();

                  if (res.meta.code != 200) {
                    return;
                  }

                  var message = xml({
                    txId: txId,
                    market: res.market,
                    userId: res.userId,
                    dateEnd: Moment.utc(res.dateEnd).format('YYYY-MM-DD hh:mm:ss.SSS [GMT]Z'),
                    coinType: transactionModel.FeatureToCoinType[res.feature],
                  });

                  logger.info(message);

                  client.send(TOPIC({market: res.market}), {
                    'content-length': false,
                  }, message);
                });
    });
  });
}, null, true);

new CronJob('0 20 * * * *', function() {
  logger.info('Checking auto-renew');

  transactionModel.getRenewProblemByMarket(MARKET, function(problems) {

    logger.info('Renew problems:', JSON.stringify(problems));

    if (!_.isEmpty(problems)) {
      logger.info('Send problems');
      commonUtil.sendErrorMail(JSON.stringify(problems));
    }
  });

}, null, true);
