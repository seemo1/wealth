/**
 * Created by Chucklee on 6/5/15.
 */
'use strict';

var Config = require('config');
var Encryptor = require('./encrypt-util');
var IMClient = {};
var IMConfig = {
  uri: Config.get('IMClient.uri'),
  appKey: Config.get('IMClient.appKey'),
  appSecret: Config.get('IMClient.appSecret'),
  tokenSalt: Config.get('IMClient.tokenSalt'),
  iv: Config.get('IMClient.iv'),

};
var nonce = Encryptor.genRandomStr(10);
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
var videoMsgType = 3;
var geoMsgType = 4;
var thirdPartyMsgType = 100;
var httpClient = {};
var request = require('request');

httpClient.post = function(url, headers, formData, callback) {
  var options = {
    url: url,
    method: 'post',
  };
  if (headers)
    options.headers = headers;
  if (formData)
    options.formData = formData;
  console.log(options);
  request(options, callback);
};

IMClient.createAccount = function(user_id, name, props, icon, callback)
{
  var currTm  = Date.now();
  var accid = user_id;
  //var token = Encryptor.aesCBCEncrypt(user_id, IMConfig.tokenSalt, IMConfig.iv);
  //console.log('token=',token);
  var checkSum = Encryptor.sha1Hash(IMConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
    name:name,
    //token:token,
  };

  if (icon)
      formData['icon'] = icon;

  if (props)
      formData['props'] = props;

  var headers = genHeaders(IMConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(IMConfig.uri + userCreate, headers, formData, function(err, httpResponse, body)
  {
  console.log('imbody : ',body);
    genRtnMsg(callback, body);
  });
};

IMClient.updateAccount = function(user_id, name, props, icon, callback)
{
  var currTm  = Date.now();
  var accid = user_id;
  var token = Encryptor.aesCBCEncrypt(user_id, IMConfig.tokenSalt, IMConfig.iv);
  var checkSum = Encryptor.sha1Hash(IMConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
    name:name,
    token:token,
  };

  if (icon)
      formData['icon'] = icon;

  if (props)
      formData['props'] = props;

  var headers = genHeaders(IMConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(IMConfig.uri + userUpdate, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

IMClient.checkOnline = function(user_id, callback)
{
  var currTm  = Date.now();
  var accid = user_id;
  var checkSum = Encryptor.sha1Hash(IMConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
  };

  var headers = genHeaders(IMConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(IMConfig.uri + checkOnline, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

IMClient.refreshToken = function(user_id, callback)
{
  var currTm  = Date.now();
  var accid = user_id;
  var checkSum = Encryptor.sha1Hash(IMConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
  };

  var headers = genHeaders(IMConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(IMConfig.uri + refreshToken, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

IMClient.block = function(user_id, callback)
{
  var currTm  = Date.now();
  var accid = user_id;
  var checkSum = Encryptor.sha1Hash(IMConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
  };

  var headers = genHeaders(IMConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(IMConfig.uri + block, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

IMClient.unblock = function(user_id, callback)
{
  var currTm  = Date.now();
  var accid = user_id;
  var checkSum = Encryptor.sha1Hash(IMConfig.appSecret + nonce + currTm);

  var formData = {
    accid:accid,
  };

  var headers = genHeaders(IMConfig.appKey, nonce, currTm, checkSum);

  httpClient.post(IMConfig.uri + unblock, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

IMClient.sendTextMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, textMsgType, body, callback);
};

IMClient.sendJpgMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, jpgMsgType, body, callback);
};

IMClient.sendVoiceMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, voiceMsgType, body, callback);
};

IMClient.sendVedioMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, videoMsgType, body, callback);
};

IMClient.sendGeoMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, geoMsgType, body, callback);
};

IMClient.sendThirdPartyMsg = function(fromID, toID, body, callback)
{
  _sendMsg(fromID, toID, thirdPartyMsgType, body, callback);
};

function _sendMsg(fromID, toID, type, body, callback)
{
  var currTm  = Date.now();
  var accid = fromID;
  var accToID = toID;

  var checkSum = Encryptor.sha1Hash(IMConfig.appSecret + nonce + currTm);
  var headers = genHeaders(IMConfig.appKey, nonce, currTm, checkSum);

  var formData = {
    from:accid,
    ope:sendMsgOpe,
    to:accToID,
    type:type,
    body:JSON.stringify(body),
  };

  httpClient.post(IMConfig.uri + sendMsg, headers, formData, function(err, httpResponse, body)
  {
    genRtnMsg(callback, body);
  });
};

IMClient.sendAttachMsg = function(fromID, toID, attach, pushcontent, payload, callback)
{
  var currTm  = Date.now();
  var accid = fromID;
  var accToID = toID;

  var checkSum = Encryptor.sha1Hash(IMConfig.appSecret + nonce + currTm);
  var headers = genHeaders(IMConfig.appKey, nonce, currTm, checkSum);

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

  httpClient.post(IMConfig.uri + sendAttachMsg, headers, formData, function(err, httpResponse, body)
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
        callback({success: false, result: jsonBody});
      }else
        {
          callback({success: true, result: jsonBody});
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

module.exports = IMClient;
