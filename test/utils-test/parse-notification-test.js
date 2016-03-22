'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var message = require('../../commonlib/notification/message');
var messageKey = require('../../commonlib/notification/message/message-key');
var parseNotification = require('../../commonlib/notification/parse-notification');
var systemSettings = require('../../commonlib/settings-common');

describe('Parse Notification Test', function() {

  before(function(done) {
    systemSettings.load()
            .then(function(res) {
              done();
            });
  });

  it('injectData should replace all {?} with data from array', function(done) {
    var messageString = '{1} is a {2}. He grew up in {3}.';
    var data = ['', 'Andy', 'reporter', 'Dallas'];
    console.log(message.internals.injectData(messageString, data));
    done();
  });

  it('get should returns message based on language and type', function(done) {
    var lang = 'ES';
    var type = messageKey.INBOX_ACCEPTED.str;
    var data = ['Yauri', 'Group name'];
    console.log(message.get(lang, type, data));
    done();
  });

  it('testing parse', {timeout: 30000}, function(done) {
    var user = {Id: 'yaurie', language: 'TW'};

    parseNotification.send(user, messageKey.INBOX_COMMENT.str, ['seemo', 'new group'])
            .then(function(res) {
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

});
