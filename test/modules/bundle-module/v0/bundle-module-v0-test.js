'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var bundleModel = require('../../../../modules/bundle-module/v0/bundle-model-v0');
var Wreck = require('wreck');

describe('Bundle Model v0', function() {

  it('Bundle model get bundle', function(done) {
    var reqData = {
      product: 'ForexMaster',
      ver: '1.0',
      appid: 'EN',
      platform: 'Android',
    };
    bundleModel.get(reqData, function(err, bundleData) {
      if (err) {
        done(err);
      }

      done();
    });
  });

  it('Bundle get from http', function(done) {
    var reqData = {
      product: 'ForexMaster',
      ver: '1.0',
      appid: 'EN',
      platform: 'Android',
    };
    var options = {
      payload: JSON.stringify(reqData),
    };

    Wreck.post('http://10.1.1.108:8000/apis/getBundleFile', options, function(err, result) {
      console.log(err);
      done();
    });
  });

});
