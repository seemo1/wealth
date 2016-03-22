'use strict';

var crypto = require('crypto');
var cbcAlgorithm = 'aes-128-cbc';
var encryptUtil = {};

encryptUtil.aesCBCEncrypt = function(text, tokenSalt, iv) {
  var cipher = crypto.createCipheriv(cbcAlgorithm, tokenSalt, iv);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

encryptUtil.aesCBCDecrypt = function(text, tokenSalt, iv) {
  var decipher = crypto.createDecipheriv(cbcAlgorithm, tokenSalt, iv);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

encryptUtil.genRandomStr = function(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  var chartLen = chars.length - 1;
  for (var i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chartLen))];
  }

  return result;
};

encryptUtil.sha1Hash = function(text) {
  return crypto.createHash('sha1').update(text).digest('hex');
};

module.exports = encryptUtil;
