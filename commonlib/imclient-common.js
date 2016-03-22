/**
 * Created by Chucklee on 6/5/15.
 */
'use strict';

var Config = require('config');
var encryptor = require('../utils/encrypt-util');
var imclient = {};
var imConfig = {
  uri: Config.get('IMClient.uri'),
  appKey: Config.get('IMClient.appKey'),
  appSecret: Config.get('IMClient.appSecret'),
  tokenSalt: Config.get('IMClient.tokenSalt'),
  iv: Config.get('IMClient.iv'),

};
var nonce = encryptor.genRandomStr(10);
var userCreate = 'user/create.action';
var userUpdate = 'user/update.action';
var checkOnline = 'user/checkOnline.action';
var refreshToken = 'user/refreshToken.action';
var block = 'user/block.action';
var unblock = 'user/unblock.action';
var sendMsg = 'msg/sendMsg.action';
var sendAttachMsg = 'msg/sendAttachMsg.action';
var sendMsgOpe = '0';
var textMsgType = 0;
var jpgMsgType = 1;
var voiceMsgType = 2;
var vedioMsgType = 3;
var geoMsgType = 4;
var thirdPartyMsgType = 100;
var httpClient = {};

httpClient.post = function(url, headers, formData, callback) {
  var options = {
    url: url,
    method: 'post',
  };
  if (headers)
    options.headers = headers;
  if (formData)
    options.formData = formData;
  request(options, callback);
};

imclient.createAccount = function(userID, name, props, icon, callback)
{
  var currTm  = Date.now();
  var accid = userID;
  var token = encryptor.aesCBCEncrypt(userID, imConfig.tokenSalt, imConfig.iv);
  var checkSum = encryptor.sha1Hash(imConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
    name:name,
    token:token,
  };

  if (icon)
      formData['icon'] = icon;

  if (props)
      formData['props'] = props;

  var headers = genHeaders(imConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(imConfig.uri + userCreate, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

imclient.updateAccount = function(userID, name, props, icon, callback)
{
  var currTm  = Date.now();
  var accid = userID;
  var token = encryptor.aesCBCEncrypt(userID, imConfig.tokenSalt, imConfig.iv);
  var checkSum = encryptor.sha1Hash(imConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
    name:name,
    token:token,
  };

  if (icon)
      formData['icon'] = icon;

  if (props)
      formData['props'] = props;

  var headers = genHeaders(imConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(imConfig.uri + userUpdate, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

imclient.checkOnline = function(userID, callback)
{
  var currTm  = Date.now();
  var accid = userID;
  var checkSum = encryptor.sha1Hash(imConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
  };

  var headers = genHeaders(imConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(imConfig.uri + checkOnline, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

imclient.refreshToken = function(userID, callback)
{
  var currTm  = Date.now();
  var accid = userID;
  var checkSum = encryptor.sha1Hash(imConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
  };

  var headers = genHeaders(imConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(imConfig.uri + refreshToken, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

imclient.block = function(userID, callback)
{
  var currTm  = Date.now();
  var accid = userID;
  var checkSum = encryptor.sha1Hash(imConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
  };

  var headers = genHeaders(imConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(imConfig.uri + block, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

imclient.unblock = function(userID, callback)
{
  var currTm  = Date.now();
  var accid = userID;
  var checkSum = encryptor.sha1Hash(imConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
  };

  var headers = genHeaders(imConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(imConfig.uri + unblock, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

imclient.sendTextMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, textMsgType, body, callback);
};

imclient.sendJpgMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, jpgMsgType, body, callback);
};

imclient.sendVoiceMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, voiceMsgType, body, callback);
};

imclient.sendVedioMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, vedioMsgType, body, callback);
};

imclient.sendGeoMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, geoMsgType, body, callback);
};

imclient.sendThirdPartyMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, thirdPartyMsgType, body, callback);
};

function _sendMsg(fromID, toID, type, body, callback)
{
  var currTm  = Date.now();
  var accid = fromID;
  var accToID = toID;

  var checkSum = encryptor.sha1Hash(imConfig.appSecret + nonce + currTm);
  var headers = genHeaders(imConfig.appKey, nonce, currTm, checkSum);

  var formData = {
    from:accid,
    ope:sendMsgOpe,
    to:accToID,
    type:type,
    body:JSON.stringify(body),
  };

  httpClient.post(imConfig.uri + sendMsg, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

imclient.sendAttachMsg = function(fromID, toID, attach, pushcontent, payload, callback)
{
  var currTm  = Date.now();
  var accid = fromID;
  var accToID = toID;

  var checkSum = encryptor.sha1Hash(imConfig.appSecret + nonce + currTm);
  var headers = genHeaders(imConfig.appKey, nonce, currTm, checkSum);

  var formData = {
    from:accid,
    msgtype:sendMsgOpe,
    to:accToID,
    attach:attach,
  };

  if (pushcontent)
      formData['pushcontent'] = pushcontent;
  if (payload)
      formData['payload'] = payload;

  httpClient.post(imConfig.uri + sendAttachMsg, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

function genRtnMsg(callback, body)
{

  if (!body)
  {
    callback({success: false, result: body});
  }else
    {
      console.log('!!!body=' + body);
      var jsonBody = JSON.parse(body);
      if (jsonBody.code != 200)
      {
        callback({success: false, result: body});
      }else
        {
          callback({success: true, result: body});
        }
    }
}

function genHeaders(appKey, nonce, curTm, checkSun)
{
  return {
    AppKey: appKey,
    Nonce: nonce,
    CurTime: curTm,
    CheckSum: checkSun,
  };
}

module.exports = imclient;
