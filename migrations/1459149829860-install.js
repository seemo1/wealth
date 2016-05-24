'use strict'
const Config = require('config');
const colors = require('colors');
const MySqlCommon = require('../commonlib/mysql-common');
const TAG = "[1459149829860-install]";

let mysqlOption = Config.get('MySQL');

let MySqlConn = new MySqlCommon(mysqlOption);

exports.up = function(next) {
  MySqlConn.initial().then(function() {
    let sql = [
      "CREATE TABLE IF NOT EXISTS `system_settings` (",
      "  `type` varchar(50) NOT NULL,",
      "  `key_code` varchar(50) NOT NULL,",
      "  `value` text NOT NULL,",
      "  `memo` text,",
      "  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,",
      "  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,",
      "  PRIMARY KEY (`type`,`key_code`)",
      ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"
    ].join("\n");
    console.log("--- Create system_settings ---");
    console.log(sql);
    return MySqlConn.query(TAG, sql, []);
  })
  .then(function (result) {
    let sql = [
      "INSERT INTO `system_settings`",
      "  (`type`, `key_code`, `value`, `memo`)",
      "VALUES",
      "  ('admin', 'email', 'fdt@hkfdt.com', NULL),",
      "  ('admin', 'password', 'fdt54642121', NULL);"
    ].join("\n");
    console.log(sql);
    return MySqlConn.query(TAG, sql, []);
  })
  .then(function (result) {
    console.log("--- Create system_settings completed ---");
    next();
  })
  .catch(function(err) {
    console.error("!!! Create system_settings failed !!!");
    console.log(err);
    next();
  });
};

exports.down = function(next) {
  MySqlConn.initial().then(function() {
    let sql = "DROP TABLE IF EXISTS `system_settings`";
    console.log("--- Drop system_settings ---");
    console.log(sql);
    return MySqlConn.query(TAG, sql, []);
  })
  .then (function(result) {
    console.log("--- Drop system_settings completed ---");
    next();
  })
  .catch (function(err) {
    console.log("!!! Drop system_settings failed !!!");
    console.log(err);
    next();
  });
};
