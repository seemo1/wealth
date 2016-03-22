'use strict';

var forge = require('node-forge');
var pki = forge.pki;

var rsaUtil = {};

rsaUtil.decrypt = function(privateKey, encryptedString) {
  try {
    var privateKeyPem = pki.privateKeyFromPem(privateKey);
    encryptedString = forge.util.decode64(encryptedString);
    return privateKeyPem.decrypt(encryptedString);
  }catch (e) {
    return JSON.stringify({error:'Token error'});
  }
};

module.exports = rsaUtil;
