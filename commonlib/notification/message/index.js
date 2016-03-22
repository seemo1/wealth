'use strict';

var message = {};
var logger = require('../../../utils/logger');
var logTag = '[Message]';

message.get = function(lang, type, data) {
  var messageString = {};

  switch (lang) {
    case 'CN':
      messageString = require('./message-cn');
      break;
    case 'TW':
      messageString = require('./message-tw');
      break;
    case 'JA':
      messageString = require('./message-ja');
      break;
    case 'ES':
      messageString = require('./message-es');
      break;
    default:
      messageString = require('./message-en');
  }
  if (!data) {
    return '';
  }

  data.unshift('');
  return message.internals.injectData(messageString[type], data);
};

message.internals = {
  injectData: function(message, data) {
    logger.info(message, 'injectData', message, data);
    return message.replace(/({\d})/g, function(j) {
      return data[j.replace(/{/, '').replace(/}/, '')];
    });
  },
};

module.exports = message;
