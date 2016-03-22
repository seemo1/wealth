'use strict';

var configHandler = {};
var Config = require('config');
var Redis = require('redis');
var redisHost = Config.get('Redis.host');
var redisPort = Config.get('Redis.port');
var channelName = 'ReloadSettings';
var logger = require('../utils/logger');
var systemSettings = require('./settings-common');

var redisSubscriber = Redis.createClient(redisPort, redisHost);
var redisPublisher = Redis.createClient(redisPort, redisHost);

redisSubscriber.on('connect', function() {
  logger.log('info', 'Redis config handler SUBSCRIBER connected');
});

redisPublisher.on('connect', function() {
  logger.log('info', 'Redis config handler PUBLISHER connected');
});

redisSubscriber.on('subscribe', function(channel, count) {
  logger.log('info', 'Config handler subscribed to channel: ' + channel);
});

redisSubscriber.on('message', function(channel, message) {
  if (channel === channelName) {
    systemSettings.loadFromMysql();
  }
});

redisSubscriber.subscribe(channelName);

configHandler.reloadSettings = function() {
  redisPublisher.publish(channelName, '');
};

module.exports = configHandler;
