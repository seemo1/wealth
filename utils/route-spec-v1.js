/**
 * Modified by Micah 2015-08-10T11:23:00+08:00
 */
'use strict';

//用於設定 Hapijs 的路徑，並輸出swagger api docs,
//用法請參考 modules/symbol-vote-module/symbol-vote-router.js
//         modules/symbol-vote-module/v1/symbol-vote-router-v1.js
//         modules/symbol-vote-module/v1/symbol-vote-spec-v1.js

//內建或第三方模組
var Lodash = require('lodash');
var Joi = require('joi');

//應用程式共用模組
var requestUtil = require('./request-util');
var outfitUtil = require('./outfit-util');

//所有api共用的專有名詞之文字說明檔
var term = require('../commonlib/term-text.json');

//共用預設常數
var joConstant = {
  hits: 20,
  offset: 0,
};

//多個api path共用的物件，定義一個共用
var curt = {
  auth_token: Joi.string().required().description(term.auth_token),
  msg: Joi.string().required().description(term.msg),
  hits: Joi.number().integer().default(joConstant.hits).description(term.hits),
  offset: Joi.number().integer().default(joConstant.offset).description(term.offset),
  meta: Joi.object({
    code: Joi.number().integer().default(200).description(term.code),
    error_code: Joi.string().description(term.error_code),
    error_msg: Joi.string().description(term.error_msg),
  }).meta({className: 'commonOutputMeta'}),
  cursor: Joi.string().description(term.cursor),
  has_more: Joi.string().description(term.has_more),
  group_id: Joi.string().description(term.group_id),
  defaultSuccess: '成功時輸出資料',
  responseDescription: '預設的回應物件',
  response500: 'Internal server error',
  routeDescription: '暫無說明',
};
module.exports.curt = curt;

//當 Hapi 對輸入參數的驗證失敗時，共用的錯誤訊息輸出函數，
function validateFail(request, reply, source, error) {
  Lodash.merge(error.output.payload, outfitUtil.endResult('WSV001'));
  return reply(error);
}

module.exports.validateFail = validateFail;

//如果module spec 未定義物件，則用此預設的欄位定義，
var joDefault = {
  //在每個路徑加上此標籤，才會顯示於 api docs(swagger)
  apiTags: ['social'],
  validate: {
    payload: {
      auth_token: curt.auth_token,
    },
    failAction: validateFail,
  },
  response: {
    default: {
      description: curt.responseDescription,
      schema: Joi.object({
        meta: curt.meta,
      }),
    },
    500: {description: curt.response500},
  },
  routeDescription: curt.routeDescription,
};

//輸入：server {object} Hapi server object
//     rootPath {string} 要設定的api路徑前置(prefix)，ex: /apis, /social/v0兩個api路徑
//      routeController {class} 路徑控制處理器，內含的 method 名稱與 spec 定義名稱需一樣
//      joRouteSpec {json object} 定義路徑的輸入(validate)，輸出(resposne) 參數
module.exports.setRoutes = function(server, rootPath, joRouteSpec, routeController) {
  //根據 joRouteSpec 物件定義，設定每個路徑到 Hapi server
  Lodash.forOwn(joRouteSpec, function(joSpec, apiName) {

    //如果 spec 物件有定義則用，若沒有則用預設值 joDefault
    var routeConfig = {
      method: joSpec.method || 'POST',
      path: rootPath + '/' + apiName,
      config: {
        //處理 auth_token
        pre: [{method: requestUtil.validateToken, assign: 'body', failAction: 'error'}],

        //處理method
        handler: routeController[apiName],

        //驗證輸入的參數
        validate: joSpec.validate || joDefault.validate,

        //簡述 api
        description: joSpec.description || joDefault.routeDescription,

        //設定路徑標籤
        tags: joSpec.tags || joDefault.apiTags,

        //設定使用api doc(swagger)外掛
        plugins: {
          'hapi-swaggered': {
            responses: joSpec.response || joDefault.response,
          },
        },
      },
    };

    //其他設定
    if (Lodash.has(joSpec, 'extra')) {
      Lodash.forOwn(joSpec.extra, function(value, key) {
        routeConfig.config[key] = value;
      });
    }

    server.route(routeConfig);
  });
};
