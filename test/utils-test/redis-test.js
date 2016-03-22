'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var redisClient = require('../../utils/redis-client');

describe('Redis test', function() {
  it('redis simple test', {timeout: 8000}, function(done) {
    var key = 'fdt-key';
    var value = 'fdt-social-node';
    redisClient.set(key, value);

    //INFO: it seems like sometimes redis connection is slow
    setTimeout(function() {
      redisClient.get(key, function(err, res) {
        console.log(err);
        expect(res).to.equal(value);
        done();
      });
    }, 1500);
  });

  it('get Redis TTL setting', function(done) {
    redisClient.get('RedisTTL', function(err, res) {
      console.log(res);
      done();
    });
  });
});
