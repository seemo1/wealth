'use strict';

var errMessage = {};
var errorMsg = require('./error-msg');

/**
 *
 * @param language (string)
 * @param type (string
 * @returns string
 */
function getMessage(type, language, parames) {

  if (!language) {
    language = 'EN';
  }

  language = language.toUpperCase();
  var errorStr = '';
  if (errorMsg[type]) {
    errorStr = errorMsg[type][language] ? errorMsg[type][language] : errorMsg[type]['EN'];
    if (parames) {
      errorStr = injectData(errorStr,parames);
    }
  }else {
    console.log('Unknown type :' + type);
    errorStr = 'Unknown error';
  }

  return { errorMsg: errorStr };
};

function injectData(htmlMsg, data) {
  return htmlMsg.replace(/({\d})/g, function(j) {
    return data[j.replace(/{/, '').replace(/}/, '')];
  });
}

/**
 *
 * @param language (string)
 * @returns string
 */
errMessage.CONCENTRATION_IS_EXIST = function(language, parames) { return getMessage('CONCENTRATION_IS_EXIST', language, parames); };

module.exports = errMessage;
