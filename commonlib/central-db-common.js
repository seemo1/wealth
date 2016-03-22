/**
 * Created by seemo on 2016/2/26.
 */
'use strict';

var logger = require('../utils/logger');
var logTag = '[CentralDBCommon]';
var centralDB = {};
var Config = require('config');

centralDB.get = function(market) {
  try {
    var result = '';
    var centDBs = Config.get('CentralDB');

    if (centDBs === null) {
      throwErrorStaticTree('config.js options centDBs is not defined.');
    } else {
      var centraldbs = [];
      centDBs.forEach(function(elem) {
        centraldbs[elem.Market] = elem.DB;
      });

      if (market == null) {
        result = '';
        throwErrorStaticTree(logTag, 'need input param [market]:', market);
      } else {
        result = centraldbs[market.toString().toUpperCase()];
        if (result == null) {
          result = '';
          throwErrorStaticTree(logTag, 'Market is not exists. Market:', market);

        }
      };
    };
  }catch (err) {
    throwErrorStaticTree(err);
  }finally {
    return result;
  }
};

//get all market database list & filter default marekt database;
centralDB.getMarketList = function() {
  var centDBs = Config.get('CentralDB');
  var result = {};
  centDBs.forEach(function(elem) {
    if (elem.Market != 'DEFAULT') {
      result[elem.Market] = elem.DB;
    }
  });

  return result;
};

// 用database name 反推 market code , 主要是給舊版比賽相容性使用的
centralDB.getMarketCodeByDatabaseName = function(databaseName){
  var centDBs = Config.get('CentralDB');
  var marketCode = '';
  centDBs.forEach(function(elem) {
    if (elem.Market != 'DEFAULT' && elem.DB == databaseName) {
      marketCode = elem.Market ;
    }
  });

  return marketCode;
};

function throwErrorStaticTree(msg) {
  var result = '';
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i] + ' ';
  }

  var stack = new Error().stack;
  logger.error(result, stack);

}

module.exports = centralDB;
