'use strict';
const moment = require('moment');
const Logger = require('../commonlib/logger');
const logTag = '[Canned-Message-Model]';

class CannedMessageModel {

  constructor() {
  }

  getCannedMessage(offset, hits) {
    // get total record count
    let sqlScripts = [
      {
        sql: "SELECT SQL_CALC_FOUND_ROWS seqno, message, unix_timestamp(publish_time) as publish_time, unix_timestamp(update_time) as update_time " +
            "FROM canned_message WHERE del_flag = 0 limit :offset , :hits" ,
        params: {
          offset: offset,
          hits: hits,
        },
      },
      {
        sql: "SELECT FOUND_ROWS() as data_length",
        params: {},
      },
    ];
    
    let result = {};
    return new Promise(function(resolve, reject) {
      MySqlConn.multipleQuery(logTag, sqlScripts)
        .then(function(res) {

          result.data = res[0];
          result.length = res[1][0].data_length;
          console.log(result);
          resolve(result);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  }
  
  addCannedMessage(message) {
    let that = this;
    let sql = "INSERT INTO `canned_message`(`message`,`publish_time`,`update_time`)" +
      "VALUES(:message,now(),now())" ;

    let params = {
      message: message,
    };

    return new Promise(function(resolve, reject) {
      MySqlConn.query(logTag, sql, params)
        .then(function(res) {
          return that.getCannedMessageById(res.insertId);
        })
        .then(function(res) {
          return resolve(res[0]);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  }

  delCannedMessage(seqno) {
    let sql = "UPDATE `canned_message` SET `del_flag` = 1 WHERE `seqno` = :seqno";

    let params = {
      seqno: seqno,
    };

    return new Promise(function(resolve, reject) {
      MySqlConn.query(logTag, sql, params)
        .then(function(res) {
          let result = {seqno: seqno};
          resolve(result);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  };

  updateCannedMessage(seqno, message) {
    let that = this;
    let sql = "UPDATE `canned_message` SET `message` = :message, `update_time` = now() " +
      "WHERE `seqno` = :seqno and del_flag = 0";

    let params = {
      seqno: seqno,
      message: message,
    };

    return new Promise(function(resolve, reject) {
      MySqlConn.query(logTag, sql, params)
        .then(function(res) {
          return that.getCannedMessageById(seqno);
        })
        .then(function(res) {
          return resolve(res[0]);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  };

  getCannedMessageById(seqno) {
    let sql = "SELECT seqno, message, unix_timestamp(publish_time) as publish_time, unix_timestamp(update_time) as update_time " +
      "FROM canned_message WHERE seqno = :seqno and del_flag = 0 " ;

    let params = {
      seqno: seqno,
    };

    return new Promise(function(resolve, reject) {
      MySqlConn.query(logTag, sql, params)
        .then(function(res) {
          return resolve(res);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  };

}

module.exports = CannedMessageModel;
