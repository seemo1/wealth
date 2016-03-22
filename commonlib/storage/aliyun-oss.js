/**
 * create by seemo on 2015-05-11
 */
/*
 * host - default: oss.aliyuncs.com
 * port - default: 8080
 * timeout - default: 30000000
 * agent - default: agent.maxSockets = 20
 */

var Oss = require('oss-client');
var logging = require('../../utils/logger');
var logTag = '[Aliyun-Oss-Commonlib]';
var logger = require('../../utils/logger');
var Config = require('config');
var ossConfig = Config.get('AliyunOss');

// var cassandraClient = rfr('/utils/cassandra-client');
var Uuid = require('node-uuid');
var options = {
  accessKeyId: ossConfig.accessKeyId,
  accessKeySecret: ossConfig.accessKeySecret,
  host: ossConfig.host,
};

var aliyunOss = {
  storage: Oss.create(options),
};

aliyunOss.put = function(key, buffer, fileType, callback) {
  var response = {
    url: ossConfig.bucket.concat('.', ossConfig.host),
    key: null,
  };
  aliyunOss.storage.putObject({
    bucket: ossConfig.bucket,
    object: key,
    srcFile: buffer,
    contentType: fileType,
  }, function(err, result) {
    if (err) {
      logging.error(logTag, 'put', err);
      return callback(err, response);
    }else {
      response.key = key;
      response.url = 'http://' + response.url + '/' + response.key;
      logger.info(logTag, 'put', 'done', response);
      callback(null, response);
    }
  });
};

aliyunOss.delete = function(key, callback) {
  aliyunOss.storage.deleteObject({
    bucket: ossConfig.bucket,
    object: key,
  }, function(err) {
    if (err) {
      logging.error(logTag, err);
      return callback(err, null);
    }

    logging.info(logTag, 'delete', 'done');
    callback(null, null);
  });
};

aliyunOss.internals = {
  saveToDb: function(ownerId, key, url, callback) {
    var query = 'INSERT INTO user_image (owner_id, key, url) VALUES (?, ?, ?)';
    var params = [ownerId, key, url];
    cassandraClient.execute(query, params, function(err, result) {
      if (err) {
        //logger.error(logTag, 'save to db', err);
        return callback(err, null);
      }

      //logger.info(logTag, 'save to db', 'done');
      callback(null, result);
    });
  },
};

module.exports = aliyunOss;
