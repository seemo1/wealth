'use strict';

const Test = require('mocha').Test;
const RabbitMQCommon = require('../../commonlib/rabbitmq-common');
const expect = require('chai').expect;

let MQConn = {}
describe('RabbitMQ CommonLib Test.',function() {
  before(function() {
    MQConn = new RabbitMQCommon();
  });

  describe('Connection',function() {
    it('初始化連線',function() {
      return MQConn.initial();
    });

    it('斷線', function() {
      return MQConn.shutdown();
    });

    it('斷開重連', function() {
      return MQConn.restart();
    });
  });
});