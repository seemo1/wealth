'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var inboxModel = require('../../../modules/inbox-module/v0/inbox-model-v0');
var messageKey = require('../../../commonlib/notification/message/message-key');
var cassandraCommon = require('../../../commonlib/cassandra-common');
var Cassandra = require('cassandra-driver');

describe('Inbox Module V0 Test', function() {

  it('save should returns true', {timeout: 50000}, function(done) {
    var inboxData = {
      inbox_id: new Cassandra.types.Uuid.random().toString(),
      publish_time: new Date().getTime(),
      action: 16,
      comment: 'null',
      commentId: 'null',
      contestOd: 'null',
      country: 'null',
      currency: 'null',
      fromUserId: 'null',
      groupId: cassandraCommon.assureUuid('dd20df71-1f97-11e5-b2f3-d11cf7232294'),
      groupName: 'new group a',
      hasread: '0',
      htmlmsg: 'message content',
      lastupdatetime: new Date().getTime(),
      newstime: 'null',
      postId: null,
      userId: 'yaurii',
    };

    inboxModel.save(inboxData)
            .then(function(res) {
              expect(res).to.be.equal(true);
              done();
            })
            .catch(function(err) {
              console.log(err);
              done(err);
            });
  });
});
