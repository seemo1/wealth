'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

//INFO: lib for http call
//REF: https://github.com/hapijs/wreck
var Wreck = require('wreck');

describe('test description', function() {

  it('test case 1 name', function(done) {
    //do something
    done();
  });

  it('test case 2 name', function(done) {
    //do something
    done();
  });
});
