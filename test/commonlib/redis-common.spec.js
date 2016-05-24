'use strict';

const Test = require('mocha').Test;
const RedisCommon = require('../../commonlib/redis-common');
const expect = require('chai').expect;

let RedisConn = new RedisCommon();

describe('Redis CommonLib Test.',function() {
  describe('連線功能驗証',function() {
    it('連線',function() {
      return RedisConn.initial();
    });

    it('關閉連線', function() {
      return RedisConn.shutdown();
    });

    it('斷開重連', function() {
      return RedisConn.restart();
    });
  });

  describe('讀寫功能測試.',function() {

    it('寫入',function() {
      RedisConn.set('wealth-test-case', 'redis');
    });

    it('讀取',function() {
      return RedisConn.get('wealth-test-case')
          .then(function(res) {
            console.log('res:',res);
            expect(res).is.equal('redis');
          });
    });
  })

});