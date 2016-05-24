'use strict';

/**
 *
 * It's the rabbitmq (AMQP) connection client
 *
 * Author: seemo
 * Date: 2016/3/31
 *
 */
const Amqp = require('amqplib/callback_api');
const Config = require('config');
const Util = require('util');
const Logger = require('./logger');

class rabbitmqCommon{
  constructor(){
    let options = Config.get('RabbitMQ');
    this._amqpHost = Util.format('amqp://%s:%s@%s:%s/%s', options.user, options.password, options.host, options.port, options.vhost);
    this._conn = {};
    this._channel = {};
  };

  //連線到RabbitMQ
  initial(){
    Logger.info('connection to RabbitMQ...');
    let that = this;
    return new Promise((resolve, reject) => {
      Amqp.connect(that._amqpHost, function(err, conn){
        if (err) {
          Logger.error('RabbitMQ connection failed.');
          reject(err);
        }else{
          that._conn = conn;
          that.registEvent();
          that._conn.createConfirmChannel(function(err,ch){
            that._channel = ch;
            Logger.info('RabbitMQ is ready.');
            return resolve();
          });
        }
      });
    });
  }

  //將訊息傳送到Queue
  sendToQueue(channel,msg){
    this._channel.assertQueue(channel, {durable: true});
    this._channel.sendToQueue(channel, new Buffer(JSON.stringify(msg)));
  }

  //for subscribe test 註冊一個callback訂閱以接收訊息
  consume(channel){
    let that = this
    that._channel.assertQueue(channel);
    that._channel.consume(channel, function(msg) {
      if (msg !== null) {
        //console.log(msg.content.toString());
        //console.log(msg);
        that._channel.ack(msg)
      }
    });
  }

  shutdown(){
    let that = this;
    return new Promise(function(resolve, reject){
      that._conn.close(function(err){
        resolve()
      });
    });
  }

  restart(){
    return this.shutdown().then(this.initial.bind(this));
  }

  //事件監聽
  registEvent() {
      //on error
      this._conn.on('error', function(err) {
        return Logger.error('[AMQP] connection error: %j.', err);
      });

      //on error
      this._conn.on('close', function(e) {
        return Logger.info('[AMQP] connection closed.',e);
      });
  }
}

module.exports = rabbitmqCommon;
