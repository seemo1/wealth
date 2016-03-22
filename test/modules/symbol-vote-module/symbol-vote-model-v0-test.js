/**
* Created by Micah on 2015/05/26
* lab test\modules\symbol-vote-module\symbol-vote-model-v0-test.js -e localcass -m 0
* node_modules/lab/bin/lab test/modules/symbol-vote-module/symbol-vote-model-v0-test.js -m 0
*/
'use strict';
var symbolVoteModel = require('../../../modules/symbol-vote-module/v0/symbol-vote-model-v0');
var Util = require('util');
var Code = require('code');
var Lab = require('lab');

var lab = exports.lab = Lab.script();
var it = lab.it;
var before = lab.before;
var describe = lab.describe;
var expect = Code.expect;
var Lodash = require('lodash');

describe('Vote', function() {
  it('symbolVoting', function(done) {
    //var input = { symbol:'CHFUSD.FX', userId : 'micah', vote: 'Bearish'};
    var input = { symbol:'CHFUSD.FX', userId: 'micah', vote: 'Bullish'};
    var input = { symbol:'CHFUSD.FX', userId: 'micah', vote: 'Cancel'};
    symbolVoteModel.symbolVoting(input).then(function(result) {
      console.log('Success:', result);
      done();
    }).catch(function(error) {
      console.log('Fail: ', error);
      done();
    });
  });

  /*
      it('updateUserVote', function(done) {
          var input = { symbol:'CHFUSD.FX', userId : 'def444', vote: 'Bullish'};
          symbolVoteModel.updateUserVote(input).then( function (result) {
              console.log(input, ' updateUserVote =', result);
              done();
          });
      });
      it('deleteUserVote', function(done) {
          var input = { symbol:'CHFUSD.FX', userId : 'abc444', vote: 'Bullish'};
          symbolVoteModel.deleteUserVote(input).then( function (result) {
              console.log(input, ' deleteUserVote =', result);
              done();
          });
      });
      it('decreaseVoteCount', function(done) {
          var input = { symbol:'CHFUSD.FX', vote: 'Bullish'};
          symbolVoteModel.decreaseVoteCount(input).then( function (result) {
              console.log(input, ' decreaseVoteCount =', result);
              done();
          });
      });
*/
  /*
  it('deleteVoteCount', function(done) {
      var input = { symbol:'CHFUSD.FX'};
      symbolVoteModel.deleteUserVote(input).then( function (result) {
          console.log(input, ' delete =', result);
          done();
      });
  });
  */
});

describe('symbolVoteModel', function() {
  it('insert user votes', function(done) {
    var aryUserVotes = [
        ['USDJPY.FX', 'frank5444', 'Bearish'],
        ['USDJPY.FX', 'abc5444', 'Bearish'],
        ['USDJPY.FX', 'def5444', 'Bearish'],
        ['USDJPY.FX', 'ghj5444', 'Bullish'],
        ['USDJPY.FX', 'qwe5444', 'Bearish'],
        ['USDCHF.FX', 'frank444', 'Bearish'],
        ['USDCHF.FX', 'abc444', 'Bearish'],
        ['USDCHF.FX', 'def444', 'Bearish'],
        ['USDCHF.FX', 'ghj444', 'Bullish'],
        ['USDCHF.FX', 'qwe444', 'Bearish'],
    ];
    var input;
    var intCheckDone = aryUserVotes.length;
    for (var ii = 0; ii < aryUserVotes.length; ii++) {
      input = {symbol: aryUserVotes[ii][0], userId: aryUserVotes[ii][1], vote: aryUserVotes[ii][2]};

      //keep the input value inside callback
      (function(input) {
        symbolVoteModel.insertUserVote(input).then(function(result) {
          console.log('insertUserVote:', Util.inspect(result, {depth:null}));
          console.log('inside callback input=', input);
          return symbolVoteModel.increaseVoteCount(input);
        }).then(function(result) {
          console.log('increaseVoteCount:', Util.inspect(result, {depth:null}));
          console.log('intCheckDone=', intCheckDone);
          (intCheckDone === 1) ? done() : intCheckDone--;
        }).catch(function(error) {
          console.log('Error: ', Util.inspect(error, {depth:null}));
          done();
        });
      })(input);

    };
  }); //end it('insert user votes')
});

/*
symbolVoteModel.insertUserVote(input).then(function(result){
    console.log('insertUserVote:', Util.inspect(result, {depth:null}) );
    return symbolVoteModel.increaseVoteCount(input);
}).then( function (result) {
    console.log('increaseVoteCount:', Util.inspect(result, {depth:null}) )
    return symbolVoteModel.selectUserVote(input);
}).then(function(result){
       console.log('selectUserVote:', Util.inspect(result, {depth:null}) );
       return symbolVoteModel.selectVoteCount(input);
}).then(function(result) {
    console.log('selectVoteCount:', Util.inspect(result, {depth:null}));
}).catch(function (error) {
    console.log('Error:', Util.inspect(error, {depth:null}));
});
*/
/*
 symbolVoteModel.ThrowVoteAllTime('frank444', 'EURUSD.FX', 'Bearish').then( function(result) {
    console.log('final result= ', result);
 });
*/