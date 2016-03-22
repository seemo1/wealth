'use strict';

var htmlMsg = {};
var logger = require('../../../utils/logger');
var logTag = '[htmlMsg]';

htmlMsg.get = function(lang, type, data) {
  var htmlMsgString = {};

  switch (lang) {
    case 'CN':
      htmlMsgString = require('./htmlMsg-cn');
      break;
    case 'TW':
      htmlMsgString = require('./htmlMsg-tw');
      break;
    case 'JA':
      htmlMsgString = require('./htmlMsg-ja');
      break;
    case 'ES':
      htmlMsgString = require('./htmlMsg-es');
      break;
    default:
      htmlMsgString = require('./htmlMsg-en');
  }
  if (!data || !type) {
    return '';
  }

  return htmlMsg.internals.injectData(htmlMsgString[type], data);
};

htmlMsg.internals = {
  injectData: function(htmlMsg, data) {
    return htmlMsg.replace(/({\d})/g, function(j) {
      return data[j.replace(/{/, '').replace(/}/, '')];
    });
  },
};

module.exports = htmlMsg;
