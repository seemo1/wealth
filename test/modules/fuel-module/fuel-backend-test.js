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

describe('Fuel backend API', function() {

  //it('insert fake transaction', function (done) {
  //    var count = 50;
  //    for (var i = 0; i < 50; i++) {
  //        var fields = 'tx_id, user_id, area, product, action_name, ' +
  //            'action_point, action_date, score_sum, memo';
  //        var query = 'INSERT INTO fuel_tx (' + fields + ') VALUES (?,?,?,?,?,?,?,?,?)';
  //        var params = [i, 'test_user', 'CN', 'FuturesMaster', 'comment',
  //            2, '2015-10-10', 10 * i, '-'];
  //        mysqlClient.query(query, params, function (err, result) {
  //            --count;
  //            if (count === 0) {
  //                done();
  //            }
  //        });
  //    }
  //});

  it('insert fake user to social_user_account', {timeout: 100000}, function(done) {
    var count = 100000;
    for (var i = 0; i < count; i++) {
      var query = 'INSERT INTO social_user_account (user_id, coins, fuel) VALUES (?,?,?)';
      var params = ['FDTFAKENAME-' + i, 1000,  Math.floor((Math.random() * 500) + 1)];
      mysqlClient.query(query, params, function(err, result) {
        --count;
        if (count === 0) {
          done();
        }
      });
    }
  });
});
