/**
 * Created by CCMa on 5/8/15.
 */

var api = {};
var lodash = require('lodash');
var table = require('./table');

api.convertIn = function(apiJson, ResJson)
{
  var tagAy = lodash.get(apiJson, 'in', []);
  var newJson = {};

  for (var ii = 0; ii < tagAy.length; ii++)
  {
    if (lodash.has(ResJson, tagAy[ii]))
    {
      lodash.set(newJson, tagAy[ii], lodash.get(ResJson, tagAy[ii], ''));
    }
  }

  return table.convertIn(lodash.get(apiJson, 'table', ''), newJson);
};

/**
 * 將查詢cassandra的json 轉成實際回覆的new Json
 * @param apiJson : 設定
 * @param ResJson : 內容
 * @returns {*}
 */
api.convertOut = function(apiJson, ResJson)
{
  var tagAy = lodash.get(apiJson, 'out', []);
  var newJson = {};

  for (var ii = 0; ii < tagAy.length; ii++)
  {
    if (lodash.has(ResJson, tagAy[ii]))
    {
      lodash.set(newJson, tagAy[ii], lodash.get(ResJson, tagAy[ii], ''));
    }
  }

  return table.convertOut(lodash.get(apiJson, 'table', ''), newJson);
};

/**
 * 檢查輸入的json，是否都有滿足必填資訊
 * @param apiJson : 設定
 * @param inputJson : 檢查
 * @returns {*}
 */
api.checkNecessity = function(apiJson, inputJson)
{
  var tagAy = lodash.get(apiJson, 'necessary', []);
  var result = true;

  for (var ii = 0; ii < tagAy.length; ii++) {
    if (!lodash.has(inputJson, tagAy[ii])) {
      result = false;
      break;
    }
  }

  return result;
};

module.exports = api;
