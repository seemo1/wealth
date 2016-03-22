/**
 * Created by rayson on 15/5/29.
 */
'use strict';
var jsModel = require('../commonlib/js-common');
var logger = require('../utils/logger');
var logTag = '[MySQLCentral-Commom]';
var MySQL = require('mysql');
var Fs = require('fs');
var Lodash = require('lodash');

var mysqlCenterModel = {};

mysqlCenterModel.insert = function(tag, sql, inserts, callback) {
  var query = MySQL.format(sql, inserts);
  mysqlCentralClient.query(query, function(err, res) {
    //mysqlCentralClient.query(query, function (error, res) {
    if (err) {
      callback(err, null);
      logger.info(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(null, res);
  });
};

mysqlCenterModel.delete = function(tag, sql, deletes, callback) {
  var query = MySQL.format(sql, deletes);
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

mysqlCenterModel.update = function(tag, sql, inserts_array, callback) {
  var query = MySQL.format(sql, inserts_array);
  mysqlCentralClient.query(query, function(err, res) {
    if (err) {
      callback(err, res);
      logger.info(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(err, res);
  });
};

/**
 * Created by chuck
 * different input with update
 */
mysqlCenterModel.update2 = function(tag, sql, conditions, callback) {
  sql = MySQL.format(sql, conditions);
  mysqlCentralClient.query(sql, function(err, res) {
    if (err) {
      callback(err, res);
      logger.info(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(err, res);
  });
};

mysqlCenterModel.select = function(tag, selectSql, where, callback) {
  var query = MySQL.format(selectSql, where);
  mysqlCentralClient.query(query, function(err, res) {
    if (err) {
      callback(err, res);
      logger.info(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(err, res);
  });
};

mysqlCenterModel.alter = function(tag, sql, callback) {
  var query = MySQL.format(sql);
  mysqlCentralClient.query(query, function(err, res) {
    if (err) {
      callback(err, res);
      logger.info(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(err, res);
  });
};

mysqlCenterModel.delete = function(tag, sql, where, callback) {
  var query = MySQL.format(sql, where);
  mysqlCentralClient.query(query, function(err, res) {
    if (err) {
      callback(err, res);
      logger.info(logTag, tag, query);
      logger.error(logTag, tag, err);
      return;
    }

    callback(err, res);
  });
};

module.exports = mysqlCenterModel;
