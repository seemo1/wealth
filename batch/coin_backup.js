// 這是 FX, FC, SC 一起處理的版本

'use strict';

var Config = require('config');
var CronJob = require('cron').CronJob;
var _ = require('lodash');
var Moment = require('moment');
var logger = require('../utils/logger');
var Async = require('async');

var Rfr = require('rfr');
var transactionModel = Rfr('/modules/transaction-module/v0/transaction-model-v0');

var TOPIC = _.template('/topic/GLOBAL.${market}-MQ.channel');
var SELF_QUEUE = '/queue/social-batch';

var parseString = require('xml2js').parseString;

var Stomp = require('stompjs');
var client, timeoutId;

var xml = _.template(
    '<com.cyanspring.common.event.account.CoinSettingRequestEvent>\n\
     <key>${ txId }</key>\n\
     <priority>NORMAL</priority>\n\
     <sender>social-batch</sender>\n\
     <txId>${ txId }</txId>\n\
     <market>${ market }</market>\n\
     <userId>${ userId }</userId>\n\
     <endDate>${ dateEnd }</endDate>\n\
     <coinType>${ coinType }</coinType>\n\
</com.cyanspring.common.event.account.CoinSettingRequestEvent>\n');

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

  transactionModel.getSubscriptionsToRenew(function(subscriptions) {
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
