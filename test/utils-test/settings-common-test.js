'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var systemSettings = require('../../commonlib/settings-common');

describe('Settings Common Test', function() {

  before({timeout: 5000}, function(done) {
    systemSettings.load()
            .then(function(res) {
              done();
            })
            .error(function(err) {
              console.log('system init error');
              done();
            });
  });

  it('test case 1 name', function(done) {
    var testing = systemSettings.get('AccountRegion', 'CheckMode');
    expect(testing).to.equal('byRegion');
    done();
  });
});
