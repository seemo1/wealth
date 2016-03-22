'use strict';

var Config = require('config');
var Boom = require('boom');
var logger = require('./logger');
var rsaUtil = require('./rsa-util');
var pkey = Config.get('PrivateKey');
var logTag = '[Request-util]';
var errCode = require('../config/define/errcode');
var userComm = require('../commonlib/user-common');
var redisModel = require('../commonlib/redis-common');
var requestUtil = {};
var _ = require('lodash');
var errorMsg = require('../config/define/error/error-msg.js');

requestUtil.authenticatedRouteConfig = function(routeHandler) {
  var joReturn = {
    handler: routeHandler,
    pre: [{method: requestUtil.validateToken, assign: 'body', failAction:'error'}],
  };
  if (arguments.length > 1) {
    joReturn.validate = arguments[1]();
  }

  return joReturn;

};

requestUtil.authenticatedRouteFileConfig = function(routeHandler) {
  return {
    payload: {
      output: 'data',
      parse: true,//INFO: this will cause all request payload becomes string
      maxBytes: (1024 * 1024 * 5),
    },
    handler: routeHandler,
    pre: [{method: requestUtil.validateToken, assign: 'body', failAction:'error'}],
  };
};

requestUtil.validateRequest = function(payload, options, next) {
  if (payload) {
    if (!payload.hasOwnProperty('auth_token')) {
      logger.log('warn', 'Unauthorized request');
      return next(Boom.create(403, 'Forbidden'));
    }
  }  else {
    logger.log('warn', 'Unauthorized request');
    return next(Boom.create(403, 'Forbidden'));
  }

  next();
};

//REF: https://github.com/hapijs/hapi/blob/master/test/auth.js
requestUtil.validateHeaders = function(server, options) {
  var scheme = {};

  scheme.authenticate = function(request, reply) {
    var req = request.raw.req;
    var token = req.headers.auth_token;

    if (!token) {
      return reply(Boom.unauthorized(null, 'Unauthorized'));
    }

    var user = rsaUtil.decrypt(pkey, token);
    return reply.continue({ credentials: user }); //INFO: using prop 'credentials' is MUST
  };

  return scheme;
};

requestUtil.validateToken = function(request, reply) {
  var authToken = requestData(request).auth_token;
  var rtnJson = {};
  if (!authToken) {
    logger.error(logTag, ' AuthToken Data ', ' invalid auth token ', authToken);
    rtnJson.meta = errCode.WAT000;
    return reply(rtnJson).takeover();
  }

  var user;
  try {
    user = JSON.parse(rsaUtil.decrypt(pkey, authToken));
  }
  catch (e) {
    logger.error(logTag, 'validateToken', e);logger.error(logTag, ' AuthToken Data ', ' token is error ! check POST / GET ! ', authToken);
    rtnJson.meta = errCode.WAT000;
    return reply(rtnJson).takeover();
  }

  if (user.error) {
    logger.error(logTag, ' AuthToken Data ', ' token is error ! check POST / GET ! ', authToken);
    rtnJson.meta = errCode.WAT000;
    return reply(rtnJson).takeover();
  }

  //for android default token
  if (user.Id == 'cndeftokenuser' || user.Id == 'endeftokenuser' || user.Id == 'twdeftokenuser') {
    var blackList = ['/apis/post', '/apis/createGroup', '/apis/setUserProfile', '/apis/follow', '/apis/joinContest',
      '/apis/unfollow', '/user/v1/setUserProfile', '/apis/setReferralCode', '/apis/comment', '/apis/repost',
      '/apis/like', '/apis/requestToJoinGroup', '/apis/joinGroup',
    ];
    if (blackList.indexOf(request.path) > -1) {
      if (user.Id == 'cndeftokenuser') {
        rtnJson.meta = {code: 400, error_code: 'WUU002', error_msg: '当前网络不稳定，请稍后再试'};
      }

      if (user.Id == 'endeftokenuser') {
        rtnJson.meta = {code: 400, error_code: 'WUU002', error_msg: 'Your internet connection is unstable. Please try again'};
      }

      if (user.Id == 'twdeftokenuser') {
        rtnJson.meta = {code: 400, error_code: 'WUU002', error_msg: '您的網路連線不穩定，請稍候再試'};
      }

      return reply(rtnJson).takeover();
    }
  }

  if (isTokenExpired(user.exp)) {
    rtnJson.meta = errCode.WAT001;
    return reply(rtnJson).takeover();
  }

  if (request.payload) {
    if (request.payload.hasOwnProperty('language')) {
      user.language = request.payload.language;
    }
  }

  var data = {
    data:requestData(request),
    user:user,
    auth_token:authToken,
  };

  //TODO:更新使用者data has_login
  userComm.updateUserHasLogin(user);

  logger.info(logTag, ' AuthToken Data ', user);
  logger.info(logTag, ' Request Data ', data.data);
  delete data.data.auth_token;
  reply(data);
};

function requestData(request) {
  if (request.method == 'get') {
    return request.query || request.params;
  } else if (request.method == 'post') {
    return request.payload;
  } else {
    return {};
  }
};

function isTokenExpired(tokenTime) {
  return tokenTime < (new Date).getTime();
}

requestUtil.validateHeader = function(request, reply) {
  console.log('#headers#', request.head);
  console.log('#path#', request.path);
  if (request.method == 'get') {
    console.log('#query#', request.query);
  }else {
    console.log('#payload#', request.payload);
  }

  var data = {};
  try {
    var user = JSON.parse(rsaUtil.decrypt(pkey, request.headers['x-token']));
    user.language = request.headers['x-language'];
    user.country = request.headers['x-country'];
    user.id = user.Id;
    data = {
      data: getRequestData(request),
      user: user,
      auth_token: request.headers['x-token'],
    };
    if (request.headers['x-market']) {
      user.market = request.headers['x-market'];
    }

    if (data.user.error) {
      logger.info('[token] Invalid token!', data);
      return reply(new Boom.unauthorized('Invalid token'));
    }

    if (isTokenExpired(data.user.exp)) {
      logger.info('[token] Token expired!', data);
      return reply(new Boom.unauthorized(errorMsg.TOKEN_EXPIRED[user.language]));
    }
  }
  catch (e) {
    return reply(new Boom.unauthorized());
  }

  reply(data);

};

requestUtil.validateHeaderSkipExpTime = function(request, reply) {

  var data = {};
  try {
    var user = JSON.parse(rsaUtil.decrypt(pkey, request.headers['x-token']));
    user.language = request.headers['x-language'];
    user.country = request.headers['x-country'];
    user.id = user.Id;
    data = {
      data: getRequestData(request),
      user: user,
      auth_token: request.headers['x-token'],
    };
    if (request.headers['x-market']) {
      user.market = request.headers['x-market'];
    }

    if (data.user.error) {
      logger.info('[token] Invalid token!', data);
      return reply(new Boom.unauthorized('Invalid token'));
    }
  }
  catch (e) {
    return reply(new Boom.unauthorized());
  }

  reply(data);

};

requestUtil.validateServerHeader = function(request, reply) {
  console.log('#AppServer headers#', request.head);
  console.log('#AppServer path#', request.path);
  if (request.method == 'get') {
    console.log('#AppServer query#', request.query);
  }else {
    console.log('#AppServer payload#', request.payload);
  }
  var data = {};
  try {
    var user = JSON.parse(rsaUtil.decrypt(pkey, request.payload.auth_token));
    user.id = user.Id;
    data = {
      data: getRequestData(request),
      user: user,
    };
    if (request.headers['x-market']) {
      user.market = request.headers['x-market'];
    }

    if (data.user.error) {
      logger.info('[token] Invalid token!', data);
      return reply(new Boom.unauthorized('Invalid token'));
    }

    if (isTokenExpired(data.user.exp)) {
      logger.info('[token] Token expired!', data);
      return reply(new Boom.unauthorized('Token expired'));
    }
  }
  catch (e) {
    return reply(new Boom.unauthorized());
  }

  reply(data);

};


function getRequestData(request) {
  var reqMethod = request.method.toLowerCase();
  if (reqMethod === 'get' || reqMethod === 'delete') {

    var params = {};
    var query = {};
    if (!_.isEmpty(request.params)) params = request.params;
    if (!_.isEmpty(request.query)) query = request.query;

    try {
      return _.merge({}, params, query);
    }
    catch (e) {
      logger.error(logTag, 'getRequestData', e);
      return {};
    }

  } else if (reqMethod === 'post' || reqMethod === 'put') {
    if (request.payload) {
      return request.payload;
    }else {
      return {};
    }

  }

}

//for not verify token
requestUtil.validateHeaderNotToken = function(request, reply) {

  var data = {};
  var user = {};
  user.language = request.headers['x-language'];
  user.country = request.headers['x-country'];
  user.id = user.Id;
  data = {
    data: getRequestData(request),
    user: user,
  };
  if (request.headers['x-market']) {
    user.market = request.headers['x-market'];
  }

  reply(data);
};

requestUtil.backendCookieValidate = function(request, reply) {
  console.log('request.cookie=', request.headers['cookie']);
  var path = request.path.split('/');
  var redisKey;
  request.headers.cookie && request.headers.cookie.split(';').forEach(function(Cookie) {
    var parts = Cookie.split('=');
    if (parts[0].trim() == 'utoken') {
      redisKey = (parts[1] || '').trim();
    }
  });

  redisModel.getRedis(redisKey, function(val) {
    if (val == '') {
      return reply(new Boom.unauthorized('Invalid token'));
    }else {
      var validate = val.split(';');

      console.log('username=', validate[0]);
      console.log('role=', validate[1]);
      return reply('ok').state('fdt', {id: 'fdtio'});
    }
  });
};

module.exports = requestUtil;
