'use strict';

var Code = require('code');
var Joi = require('joi');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var systemSettings = require('../../../commonlib/settings-common');
var storageAgent = require('../../../commonlib/storage-agent-common');
var testServer  = require('../../test-server');

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var FollowControllerV1 = require('../../../modules/social-module/v1/follow-controller-v1');

var CASE_MSG = {
  CASE_WITH_ERROR_PARMS: '(Case with incorrect parameters)',
};

describe('follow model test', function() {
  testServer.start()
        .then(function() {
          systemSettings.load();
        });

  runCaseWithCorrectParameters();
});

function runCaseWithCorrectParameters() {
  case_followMoreUser();
}

function case_followMoreUser() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {
          follower: 'rayson,seemo,yauri,joedev',
        },
      },
    },
  };
  it(getCaseMsg(request, 'Follow More User'), {timeout:30000}, function(done) {

    FollowControllerV1.followMoreUser(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function getCaseMsg(reqPacket, caseMsg) {
  if (reqPacket.fake_data == true)
      caseMsg = caseMsg + CASE_MSG.CASE_WITH_ERROR_PARMS;

  return caseMsg;
}
