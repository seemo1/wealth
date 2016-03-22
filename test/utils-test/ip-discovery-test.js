/**
 * Created by yauri on 4/27/15.
 */

'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var ipDiscover = require('../../utils/ip-discovery');

//INFO: sample IP is taken from http://www.proxynova.com/proxy-server-list/
describe('IP Discover Test', function() {

  it('Test IP Taiwan', function(done) {
    ipDiscover.getCountry('122.116.81.245')
            .then(function(res) {
              expect(res).to.equal('TW');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP China-1', function(done) {
    ipDiscover.getCountry('221.182.62.115')
            .then(function(res) {
              expect(res).to.equal('CN');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP China-2', function(done) {
    ipDiscover.getCountry('183.207.228.22')
            .then(function(res) {
              expect(res).to.equal('CN');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP US', function(done) {
    ipDiscover.getCountry('104.236.147.107')
            .then(function(res) {
              expect(res).to.equal('US');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP India-2', function(done) {
    ipDiscover.getCountry('182.73.117.20')
            .then(function(res) {
              expect(res).to.equal('IN');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP India-2', function(done) {
    ipDiscover.getCountry('115.117.45.8')
            .then(function(res) {
              expect(res).to.equal('IN');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP HK-1', function(done) {
    ipDiscover.getCountry('58.96.177.117')
            .then(function(res) {
              expect(res).to.equal('HK');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP HK-2', function(done) {
    ipDiscover.getCountry('210.6.237.191')
            .then(function(res) {
              expect(res).to.equal('HK');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP UK-1', function(done) {
    ipDiscover.getCountry('195.40.6.43')
            .then(function(res) {
              expect(res).to.equal('GB');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test IP UK-2', function(done) {
    ipDiscover.getCountry('128.199.164.194')
            .then(function(res) {
              expect(res).to.equal('GB');
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('Test invalid ip format (number)', function(done) {
    ipDiscover.getCountry(1231)
            .then(function(res) {
              expect(res).to.equal('CN');
              done();
            })
            .catch(function(err) {
              done();
            });
  });

  it('Test invalid ip format (string)', function(done) {
    ipDiscover.getCountry('invalid ip format')
            .then(function(res) {
              expect(res).to.equal('CN');
              done();
            })
            .catch(function(err) {
              done();
            });
  });

});
