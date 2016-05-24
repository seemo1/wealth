'use strict';

/**
 *
 * It's the Redis connection client
 *
 * Author: seemo
 * Date: 2016/3/31
 *
 */

var Config = require('config');
var Redis = require('redis');
var Logger = require('./logger');

class RedisCommon {

  constructor(){
    this._redis = {};
    this._isConnected = false;
  }

  //Redis 初始化
  initial() {
    Logger.info('connection to Redis...');
    let that = this;
    return new Promise(function(resolve, reject) {
      that._redis = Redis.createClient(Config.get('Redis.port'), Config.get('Redis.host'));
      that.registEvent();
      that.checkConnect()
          .then(function(){
            return resolve();
          })
          .catch(function(err){
            return reject(err);
          });
    });
  }

  //檢查連線是否正常
  checkConnect(){
    let that = this;
    return new Promise(function(resolve,reject){
      that._redis.get('conntest', function(err, res) {
        if (err) {
          Logger.error(err);
          return reject(err)
        } else {
          return resolve();
        }
      });
    });
  }

  //註冊事件監聽的callback
  registEvent() {
    this._redis.on('ready', function() {
      Logger.info('redis is ready.');
    });

    this._redis.on('error', function(err) {
      Logger.error('redis error', err);
    });

    this._redis.on('reconnecting', function(){
      Logger.info('redis is reconnecting');
    });

    this._redis.on('connect',function(){
      Logger.info('redis is connect');
    });

    this._redis.on('end', function(){
      Logger.info('redis is end')
    });

  }

  //關閉Redis連線
  shutdown() {
    let that = this;
    return new Promise(function(resolve) {
      if (that._redis) {
        that._redis.end(true);
        resolve();
      }
    });
  }

  //斷開重連Redis
  restart() {
    this.shutdown().then(this.initial.bind(this));
  }

  //寫入
  set (key, value) {
    let ttl = 21600;
    let isObject = typeof value === 'object';

    //when value is object convert to string
    if (isObject) {
      this._redis.set(key, JSON.stringify(value));
    }  else {
      this._redis.set(key, value);
    }

    if (ttl == 0) {
      //預設六小時到期
      ttl = systemSettings.getD('Redis', 'TTL', 21600);
    }
    this._redis.expire(key, ttl);
    return true;
  };

  //讀出
  get (key) {
    let that = this;
    return new Promise(function(resolve, reject){
      that._redis.get(key, function(err, res) {
        if (err) {
          Logger.error(err);
          reject(err);
        }else{
          resolve(res);
        }
      });
    });
  };

  flushall(){

  }
}

module.exports = RedisCommon
