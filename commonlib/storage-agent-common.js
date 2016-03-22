'use strict';

var rfr = require('rfr');
var aliyunOss = require('./storage/aliyun-oss');
var logger = rfr('/utils/logger');
var Config = require('config');
var Uuid = require('node-uuid');
var Split = require('smart-split');
var Cassandra = require('cassandra-driver');
var storageAgent = {};
var Lodash = require('lodash');
var ossConfig = Config.get('AliyunOss');
var systemSettings = rfr('/commonlib/settings-common');

storageAgent.put = function(theBuffer, callback) {
  if (!theBuffer || Lodash.isEmpty(theBuffer)) {
    return callback(null, null);
  }

  var key = new Cassandra.types.Uuid.random().toString() + '-' + new Date().getTime() + Uuid.v4();

  aliyunOss.put(key, theBuffer, '', function(err, res) {
    if (err) {
      callback(err, null);
    } else {
      callback(err, res.url);
    }
  });
};

storageAgent.delete = function(url, callback) {
  if (url != null) {
    var array = Split(url, '/');

    if (array.length > 0) {
      var key = array[array.length - 1];
      aliyunOss.delete(key, function(err, ret) {
        return callback(err == null);
      });
    }    else {
      return callback(false);
    }
  }  else {
    callback(false);
  }
};

storageAgent.getDomainUrl = function(url, host, domain, bucket, resize) {
  if (bucket != null && url.search(bucket) >= 0) {
    return url.replace(bucket.concat('.', host), domain) + resize;
  }

  return null;
};

storageAgent.getImageUrl = function(url) {
  if (url != null && url != '') {
    var resize = systemSettings.getD('Image', 'BigSize', '@1024w_1024h_1l?');
    var newUrl = storageAgent.getDomainUrl(url, ossConfig.host, ossConfig.domain, ossConfig.bucket, resize);

    if (newUrl != null) {
      return newUrl;
    }

    newUrl = storageAgent.getDomainUrl(url, ossConfig.host2, ossConfig.domain2, ossConfig.bucket2, resize);

    if (newUrl != null) {
      return newUrl;
    }
  }

  return url;
};

storageAgent.getSmallImageUrl = function(url) {
  if (url != null && url != '') {
    var resize = systemSettings.getD('Image', 'SmallSize', '@100w?');
    var newUrl = storageAgent.getDomainUrl(url, ossConfig.host, ossConfig.domain, ossConfig.bucket, resize);

    if (newUrl != null) {
      return newUrl;
    }

    newUrl = storageAgent.getDomainUrl(url, ossConfig.host2, ossConfig.domain2, ossConfig.bucket2, resize);

    if (newUrl != null) {
      return newUrl;
    }
  }

  return url;
};

storageAgent.getUrlByImageUuid = function(imageUuid) {
  if (imageUuid) {
    return 'http://' + ossConfig.bucket + '.' + ossConfig.host + '/' + imageUuid;
  } else {
    return imageUuid;
  }
};

module.exports = storageAgent;
