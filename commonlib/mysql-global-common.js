/**
 * Created by rayson on 15/5/29.
 */
'use strict';

var logger = require('../utils/logger');
var logTag = '[MySQL-Global-Commom]';
var MySQL = require('mysql');

var mysqlGlobalModel = {};

mysqlGlobalModel.insert = function(tag, sql, inserts, callback) {
  var query = MySQL.format(sql, inserts);
  mysqlClient.query(query, function(err, res) {
    if (err) {
      callback(err, null);
      logger.error(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(null, res);
  });
};

mysqlGlobalModel.delete = function(tag, sql, deletes, callback) {
  var query = MySQL.format(sql, deletes);
  mysqlClient.query(query, function(err, res) {
    if (err) {
      callback(err, null);
      logger.error(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(null, res);
  });
};

mysqlGlobalModel.update = function(tag, sql, inserts_array, callback) {
  var query = MySQL.format(sql, inserts_array);
  mysqlClient.query(query, function(err, res) {
    if (err) {
      callback(err, null);
      logger.info(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(null, res);
  });
};

/**
 * Created by chuck
 * different input with update
 */
mysqlGlobalModel.update2 = function(tag, sql, conditions, callback) {
  sql = MySQL.format(sql, conditions);
  mysqlClient.query(sql, function(err, res) {
    if (err) {
      callback(err);
      logger.error(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(res);
  });
};

mysqlGlobalModel.select = function(tag, selectSql, where, callback) {
  var query = MySQL.format(selectSql, where);
  mysqlClient.query(query, function(err, res) {
    if (err) {
      callback(err, null);
      logger.error(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(null, res);
  });
};

mysqlGlobalModel.alter = function(tag, sql, callback) {
  var query = MySQL.format(sql);
  mysqlClient.query(query, function(err, res) {
    if (err) {
      callback(err, null);
      logger.error(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(null, res);
  });
};

mysqlGlobalModel.query = function(tag, sql, params, callback){
  var query = MySQL.format(sql, params);
  mysqlClient.query(sql, params, function(err, res) {
    if (err) {
      logger.error(logTag, tag, query);
      logger.error(logTag, tag, err);
      callback(err, null);
      return;
    }else {
      callback(null, res);
    }
  });
}

module.exports = mysqlGlobalModel;
