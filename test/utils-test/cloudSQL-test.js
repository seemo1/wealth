/**
 * Created by rayson on 15/4/13.
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

//INFO: lib for http call
//REF: https://github.com/hapijs/wreck
var Wreck = require('wreck');

describe('Google Cloud SQL Test', function() {

  it('Select user by user id', function(done) {
    done();
  });

});
