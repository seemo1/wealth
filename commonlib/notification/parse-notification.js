'use strict';

var message = require('./message');
var Parse = require('parse').Parse;
var Config = require('config');
var Wreck = require('wreck');
var logTag = '[Parse Notification]';
var systemSettings = require('../../commonlib/settings-common');
var logger = require('../../utils/logger');
var Promise = require('bluebird');
var Lodash = require('lodash');
var parseNotification = {};
var HTMLSanitizer = require('sanitize-html');

parseNotification.send = function(userId, language, type, data, postId) {

  //console.log(logTag, 'send', userId, language, type, data, postId);

  new Promise(function(resolve, reject) {

    var url = 'https://api.parse.com/1/push/';
    var action = 'com.hkfdt.activity.SOCIAL_UPDATE';
    var badgeType = 'Increment';

    var headers = {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': systemSettings.get('Parse', 'APPLICATION_ID'),
      'X-Parse-REST-API-Key': systemSettings.get('Parse', 'REST_API_KEY'),
    };

    var payload = {
      data: {
        alert: HTMLSanitizer(message.get(language, type, data), {allowedTags: []}),
        badge: badgeType,
        action: action,
      },
      where: {userId: userId},
    };

    //for deeplink
    if (postId) {
      payload.data.deeplink = getDeepLink(postId);
    }

    var options = { headers: headers, payload: JSON.stringify(payload) };

    //console.log(logTag, 'send', options);

    if (!userId) {
      return resolve();
    }

    Wreck.post(url, options, function(err, res) {

      if (res) {
        if (res.hasOwnProperty('statusMessage')) {
          if (!res.statusMessage === 'OK') {
            logger.error(logTag, 'send', res.statusMessage);
          }

          logger.info(logTag, 'send', res.statusMessage);
        }
      }

      resolve();
    });
  })
        .then(function(res) {
          //TODO: do nothing?
        })
        .catch(function(err) {
          logger.error(logTag, err);
        });
};

function getDeepLink(postId) {
  var proto = systemSettings.getD('Product', 'Name', 'ForexMaster');
  proto = String(proto).toLowerCase();

  //INFO: currently only for post
  //still has different link
  //ref: https://docs.google.com/spreadsheets/d/1ambWKTQj2LleI5jbJU0mdYnl7ASqNxQ53jJzTu9zTEw/edit#gid=0
  return proto.concat('://fdt/timelines/post?postid=' + postId);
}

module.exports = parseNotification;
