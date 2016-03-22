/**
 * Created by CCMa on 5/9/15.
 */

var jsModel = {};
var util = require('util');
var lodash = require('lodash');
var errcode = require('../config/define/errcode');
var api = require('../config/define/api');

/**
 * 紀錄json object
 * @param json
 */
jsModel.logJ = function(json) {
  console.log(util.inspect(json, false, null));
};


jsModel.isString = function(o) {
  return typeof o == 'string' || (typeof o == 'object' && o.constructor === String);
};

jsModel.isValidString = function(str) {
  if (str == null)
      return false;
  if (!jsModel.isString(str))
      return false;
  str.trim();
  return str.length > 0;
};

jsModel.addJson = function(srcJson, srcPath, addJson) {
  lodash.forEach(addJson, function(value, key) {
    lodash.set(srcJson, srcPath + '.' + key, value);
  });
};

jsModel.getWhereValue = function(request, apiS) {

  var valueAy = [];
  var tag;
  var input = api.convertIn(apiS, request.pre.body.data);

  for (var ii = 0; ii < apiS.where.length; ii++) {
    tag = apiS.where[ii];
    if (tag == 'user_id') {
      valueAy.push(request.pre.body.user.Id);
    }    else {
      valueAy.push(lodash.get(input, tag));
    }
  }

  return valueAy;
};

jsModel.getWhereValue2 = function(request, apiS) {

  var valueAy = [];
  var tag;
  var input = api.convertIn(apiS, request.pre.body.data);

  for (var ii = 0; ii < apiS.where.length; ii++) {
    tag = apiS.where[ii];
    if (tag == 'user_id') {
      valueAy.push(request.pre.body.user.Id);
    }    else {
      valueAy.push(lodash.get(input, tag));
    }
  }

  return valueAy;
};

module.exports = jsModel;
