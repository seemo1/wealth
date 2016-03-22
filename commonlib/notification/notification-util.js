'use strict';

var redisCommon = require('../redis-common');
var parseNotification = require('./parse-notification');

//var cassandraClient = require('../../utils/cassandra-client');
var messageKey = require('./message/message-key');
var htmlMsgKey = require('./htmlMsg/htmlMsg-key');
var Promise = require('bluebird');
var logTag = '[Notification Util]';
var logger = require('../../utils/logger');
var cassandraCommon = require('../../commonlib/cassandra-common');
var inboxModel = require('../../modules/inbox-module/v0/inbox-model-v0');
var notificationUtil = {};
var _ = require('lodash');
var Cassandra = require('cassandra-driver');
var Async = require('async');
var message = require('./message');
var htmlMsg = require('./htmlMsg');
var systemSettings = require('../../commonlib/settings-common');
var Config = require('config');
var HTMLSanitizer = require('sanitize-html');
var storageAgent = require('../../commonlib/storage-agent-common');
var mysqlGlobalModel = require('../../commonlib/mysql-global-common');

var queue = {
  product: '',
  module: 'notification',
  method: '',
  data: [],
};

var imQueue = {
  user_id: '',     // for Both
  msg_type: 0,     // for inBox
  work_type: 0,    // for inBox
  icon: '',       // for inBox
  message: '',    // for Notification
  html_msg: '',    // for inBox
  deep_link: '',    // for Both
  target_id: '',
  serving_url: '',
};
var queues = {
  im: 'im',
  q: 'q',
};

notificationUtil.test = function() {

  var html = htmlMsg.get('CN', htmlMsgKey.INBOX_FOLLOW.str, ['test-follower']);
  imQueue.user_id = 'test-user-id';
  imQueue.msg_type = htmlMsgKey.INBOX_FOLLOW.id;
  imQueue.work_type = htmlMsgKey.INBOX_FOLLOW.workType;
  imQueue.icon = htmlMsgKey.INBOX_FOLLOW.icon;
  imQueue.html_msg = html;
  imQueue.message = HTMLSanitizer(html, {allowedTags: []});
  imQueue.deep_link = htmlMsg.internals.injectData(htmlMsgKey.INBOX_FOLLOW.deepLink, []);
  imQueue.target_id = '';
  imQueue.serving_url = 'http://forexmasterdev.oss-cn-beijing.aliyuncs.com/76d6d0dc-7429-4e4a-99f5-3ff1bd51dc53-144101468648736a4f10b-80cc-4e78-a13d-7261e515e5ab';
  logger.info(imQueue);
  mq.assertQueue(queues['im'], {durable: true});
  mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));

};

notificationUtil.likePost = function(userId, postId) {
  new Promise(function(resolve, reject) {
    cassandraClient.execute('SELECT user_id, msg FROM post WHERE post_id=?', [postId], function(err, result) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.rows.length > 0) {
            var post = result.rows[0];
            redisCommon.getUserRedis(userId, function(user) {
              redisCommon.getUserRedis(post.user_id, function(postOwner) {
                if (user && postOwner) {
                  if (user.user_id != postOwner.user_id) {

                    var product = systemSettings.get('Product', 'Name');
                    var language = notificationUtil.internals.getLanguage(postOwner);
                    var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_LIKE.deepLink, [Config.get('DeepLink'), postId]);

                    if (Config.get('Notification.parse')) {
                      inboxModel.save({
                        userId: postOwner.user_id,
                        fromUserId: userId,
                        postId: postId,
                        htmlmsg: message.get(postOwner.language, messageKey.INBOX_LIKE.str, [user.username, post.msg]),
                        comment: post.msg,
                        action: messageKey.INBOX_LIKE.id,
                      }).catch(notificationUtil.internals.saveInboxErrorHandler);

                      queue.product = systemSettings.get('Product', 'Name');
                      queue.method = 'likePost';
                      queue.data = [postOwner.user_id, notificationUtil.internals.getLanguage(postOwner), messageKey.INBOX_LIKE.str, [user.username, post.msg], deepLink];
                      queueUtil.send(JSON.stringify(queue), 0, function() {
                        console.log('queue sent'.red);
                      });

                      //parseNotification.send(postOwner.user_id, notificationUtil.internals.getLanguage(postOwner),
                      //    messageKey.INBOX_LIKE.str, [user.username, post.msg], postId);
                    }

                    if (Config.get('Notification.im')) {
                      var html = htmlMsg.get(language, htmlMsgKey.INBOX_LIKE.str, [user.username, post.msg]);

                      imQueue.user_id = postOwner.user_id;
                      imQueue.msg_type = htmlMsgKey.INBOX_LIKE.id;
                      imQueue.work_type = htmlMsgKey.INBOX_LIKE.workType;
                      imQueue.icon = htmlMsgKey.INBOX_LIKE.icon;
                      imQueue.html_msg = html;
                      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                      imQueue.deep_link = deepLink;
                      imQueue.target_id = postId;
                      imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(user.serving_url));

                      // send to MQ
                      logger.info(JSON.stringify(imQueue));
                      mq.assertQueue(queues['im'], {durable: true});
                      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                    }
                  }
                }
              });
            });
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'sendLikeNotification', err);
        });
};

notificationUtil.inviteGroupV3 = function(invitedUserId, inviteeId, groupId) {
  if (invitedUserId !== inviteeId) {
    logger.log(logTag, 'insertGroupInvited'.yellow, groupId);
    new Promise(function(resolve, reject) {
      mysqlGlobalModel.select(logTag, 'SELECT name FROM group_info WHERE group_id=?', [groupId], function(err, result) {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    })
            .then(function(result) {
              mysqlGlobalModel.select(logTag, 'select * from group_invited where user_id=?', invitedUserId, function(err, res) {
                if (!err) {
                  var groups = result;

                  if (groups.length > 0) {

                    redisCommon.getUserRedis(inviteeId, function(inviteeUser) {
                      if (inviteeUser) {

                        var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_INVITE.deepLink, [Config.get('DeepLink'), groupId]);
                        if (Config.get('Notification.im')) {
                          var html = htmlMsg.get(notificationUtil.internals.getLanguage(inviteeUser), htmlMsgKey.INBOX_INVITE.str, [inviteeUser.username, groups[0].name]);

                          imQueue.user_id = invitedUserId;
                          imQueue.msg_type = htmlMsgKey.INBOX_INVITE.id;
                          imQueue.work_type = htmlMsgKey.INBOX_INVITE.workType;
                          imQueue.icon = htmlMsgKey.INBOX_INVITE.icon;
                          imQueue.html_msg = html;
                          imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                          imQueue.deep_link = deepLink;
                          imQueue.target_id = groupId;
                          imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(inviteeUser.serving_url));

                          // send to MQ
                          logger.info(JSON.stringify(imQueue));
                          mq.assertQueue(queues['im'], {durable: true});
                          mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                        }
                      }

                      //parseNotification.send(user.user_id, notificationUtil.internals.getLanguage(user), messageKey.INBOX_INVITE.str, [inviteeUser.username, groups[0].name]);
                    });
                  }
                }
              });
            })
            .catch(function(err) {
              logger.error(logTag, 'send inviteGroup Notification', err);
            });
  }
};

notificationUtil.inviteGroup = function(invitedUserId, inviteeId, groupId) {
  //save to inbox_msg and notify invited user
  if (invitedUserId !== inviteeId) {
    logger.log(logTag, 'insertGroupInvited'.yellow, groupId);
    groupId = cassandraCommon.assureUuid(groupId);
    new Promise(function(resolve, reject) {
      cassandraClient.execute('SELECT name FROM group WHERE group_id=?', [groupId], function(err, result) {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    })
            .then(function(result) {
              redisCommon.getUserRedis(invitedUserId, function(user) {
                if (user) {

                  var groups = result.rows;

                  if (groups.length > 0) {

                    redisCommon.getUserRedis(inviteeId, function(inviteeUser) {
                      if (inviteeUser) {

                        var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_INVITE.deepLink, [Config.get('DeepLink'), groupId]);

                        if (Config.get('Notification.parse')) {
                          inboxModel.save({
                            userId: invitedUserId,
                            fromUserId: inviteeUser.user_id,
                            groupId: groupId,
                            action: messageKey.INBOX_INVITE.id,
                            groupName: groups[0].name,
                          }).catch(notificationUtil.internals.saveInboxErrorHandler);

                          queue.product = systemSettings.get('Product', 'Name');
                          queue.method = 'inviteGroup';
                          queue.data = [user.user_id, notificationUtil.internals.getLanguage(user), messageKey.INBOX_INVITE.str, [inviteeUser.username, groups[0].name], deepLink];
                          queueUtil.send(JSON.stringify(queue), 0, function() {
                                        });

                          //parseNotification.send(user.user_id, notificationUtil.internals.getLanguage(user), messageKey.INBOX_INVITE.str, [inviteeUser.username, groups[0].name]);
                        }

                        if (Config.get('Notification.im')) {
                          var html = htmlMsg.get(notificationUtil.internals.getLanguage(user), htmlMsgKey.INBOX_INVITE.str, [inviteeUser.username, groups[0].name]);

                          imQueue.user_id = invitedUserId;
                          imQueue.msg_type = htmlMsgKey.INBOX_INVITE.id;
                          imQueue.work_type = htmlMsgKey.INBOX_INVITE.workType;
                          imQueue.icon = htmlMsgKey.INBOX_INVITE.icon;
                          imQueue.html_msg = html;
                          imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                          imQueue.deep_link = deepLink;
                          imQueue.target_id = groupId;
                          imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(inviteeUser.serving_url));

                          // send to MQ
                          logger.info(JSON.stringify(imQueue));
                          mq.assertQueue(queues['im'], {durable: true});
                          mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                        }
                      }

                      //parseNotification.send(user.user_id, notificationUtil.internals.getLanguage(user), messageKey.INBOX_INVITE.str, [inviteeUser.username, groups[0].name]);
                    });
                  }
                }
              });
            })
            .catch(function(err) {
              logger.error(logTag, 'send inviteGroup Notification', err);
            });
  }
};

notificationUtil.requestToJoinGroupV3 = function(userId, groupId) {
  var query = 'SELECT name, create_userid FROM group_info WHERE group_id = ?';
  var params = [groupId];
  new Promise(function(resolve, reject) {
    mysqlGlobalModel.select(logTag, query, params, function(err, result) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  }) .then(function(result) {
    if (result.length > 0) {
      var groupCreatorId = result[0].create_userid;
      var groupName = result[0].name;
      redisCommon.getUserRedis(groupCreatorId, function(creator) {
        if (creator) {
          //user is the person who request to join
          //only for getting its username
          redisCommon.getUserRedis(userId, function(user) {
            if (user) {

              var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_REQUESTTOJOIN.deepLink, [Config.get('DeepLink'), groupId]);

              if (Config.get('Notification.parse')) {
                //send notification to group owner
                inboxModel.save({
                  userId: groupCreatorId,
                  fromUserId: user.user_id,
                  groupId: groupId,
                  action: messageKey.INBOX_REQUESTTOJOIN.id,
                  groupName: groupName,
                }).catch(notificationUtil.internals.saveInboxErrorHandler);

                queue.product = systemSettings.get('Product', 'Name');
                queue.method = 'requestToJoinGroup';
                queue.data = [creator.user_id, notificationUtil.internals.getLanguage(creator), messageKey.INBOX_REQUESTTOJOIN.str, [user.username, groupName], deepLink];
                queueUtil.send(JSON.stringify(queue), 0, function() {
                  //console.log('queue sent'.red);
                });
              }

              if (Config.get('Notification.im')) {
                var html = htmlMsg.get(notificationUtil.internals.getLanguage(creator), htmlMsgKey.INBOX_REQUESTTOJOIN.str, [user.username, groupName]);

                imQueue.user_id = groupCreatorId;
                imQueue.msg_type = htmlMsgKey.INBOX_REQUESTTOJOIN.id;
                imQueue.work_type = htmlMsgKey.INBOX_REQUESTTOJOIN.workType;
                imQueue.icon = htmlMsgKey.INBOX_REQUESTTOJOIN.icon;
                imQueue.html_msg = html;
                imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                imQueue.deep_link = deepLink;
                imQueue.target_id = user.user_id;
                imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(user.serving_url));

                // send to MQ
                logger.info(JSON.stringify(imQueue));
                mq.assertQueue(queues['im'], {durable: true});
                mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
              }

              //parseNotification.send(creator.user_id, notificationUtil.internals.getLanguage(creator), messageKey.INBOX_REQUESTTOJOIN.str, [user.username, groupName]);
            }
          });
        }
      });
    }
  })
        .catch(function(err) {
          logger.error(logTag, 'send requestToJoinGroup Notification', err);
        });
};

notificationUtil.requestToJoinGroup = function(userId, groupId) {
  var query = 'SELECT name, create_userid FROM group WHERE group_id = ?';
  var params = [groupId];

  new Promise(function(resolve, reject) {
    cassandraClient.execute(query, params, {prepare: true}, function(err, result) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.rows.length > 0) {
            var groupCreatorId = result.rows[0].create_userid;
            var groupName = result.rows[0].name;
            groupId = cassandraCommon.assureUuid(groupId);
            redisCommon.getUserRedis(groupCreatorId, function(creator) {
              if (creator) {
                //user is the person who request to join
                //only for getting its username
                redisCommon.getUserRedis(userId, function(user) {
                  if (user) {

                    var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_REQUESTTOJOIN.deepLink, [Config.get('DeepLink'), groupId]);

                    if (Config.get('Notification.parse')) {
                      //send notification to group owner
                      inboxModel.save({
                        userId: groupCreatorId,
                        fromUserId: user.user_id,
                        groupId: groupId,
                        action: messageKey.INBOX_REQUESTTOJOIN.id,
                        groupName: groupName,
                      }).catch(notificationUtil.internals.saveInboxErrorHandler);

                      queue.product = systemSettings.get('Product', 'Name');
                      queue.method = 'requestToJoinGroup';
                      queue.data = [creator.user_id, notificationUtil.internals.getLanguage(creator), messageKey.INBOX_REQUESTTOJOIN.str, [user.username, groupName], deepLink];
                      queueUtil.send(JSON.stringify(queue), 0, function() {
                        //console.log('queue sent'.red);
                      });
                    }

                    if (Config.get('Notification.im')) {
                      var html = htmlMsg.get(notificationUtil.internals.getLanguage(creator), htmlMsgKey.INBOX_REQUESTTOJOIN.str, [user.username, groupName]);

                      imQueue.user_id = groupCreatorId;
                      imQueue.msg_type = htmlMsgKey.INBOX_REQUESTTOJOIN.id;
                      imQueue.work_type = htmlMsgKey.INBOX_REQUESTTOJOIN.workType;
                      imQueue.icon = htmlMsgKey.INBOX_REQUESTTOJOIN.icon;
                      imQueue.html_msg = html;
                      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                      imQueue.deep_link = deepLink;
                      imQueue.target_id = user.user_id;
                      imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(user.serving_url));

                      // send to MQ
                      logger.info(JSON.stringify(imQueue));
                      mq.assertQueue(queues['im'], {durable: true});
                      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                    }

                    //parseNotification.send(creator.user_id, notificationUtil.internals.getLanguage(creator), messageKey.INBOX_REQUESTTOJOIN.str, [user.username, groupName]);
                  }
                });
              }
            });
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'send requestToJoinGroup Notification', err);
        });
};

notificationUtil.acceptGroupInvitationV3 = function(userId, groupId) {
  //notification =_='
  new Promise(function(resolve, reject) {
    //get group name
    mysqlGlobalModel.select(logTag, 'SELECT name, create_userid FROM group_info WHERE group_id = ?', [groupId], function(err, result) {
      if (err) {
        logger.error(logTag, 'notification user join group', err);
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.length > 0) {
            var groupName = result[0].name;
            var groupCreatorId = result[0].create_userid;

            //get user name
            redisCommon.getUserRedis(userId, function(user) {
              redisCommon.getUserRedis(groupCreatorId, function(creator) {
                if (user && creator) {

                  var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_ACCEPTED.deepLink, [Config.get('DeepLink'), groupId]);

                  if (Config.get('Notification.parse')) {
                    inboxModel.save({
                      userId: groupCreatorId,
                      fromUserId: userId,
                      htmlmsg: message.get(creator.language, messageKey.INBOX_ACCEPTED.str, [user.username, groupName]),
                      action: messageKey.INBOX_ACCEPTED.id,
                      groupName: groupName,
                    }).catch(notificationUtil.internals.saveInboxErrorHandler);

                    queue.product = systemSettings.get('Product', 'Name');
                    queue.method = 'acceptGroupInvitation';
                    queue.data = [creator.user_id, notificationUtil.internals.getLanguage(creator), messageKey.INBOX_ACCEPTED.str, [user.username, groupName], deepLink];
                    queueUtil.send(JSON.stringify(queue), 0, function() {
                                });
                  }

                  if (Config.get('Notification.im')) {
                    var html = htmlMsg.get(creator.language, htmlMsgKey.INBOX_ACCEPTED.str, [user.username, groupName]);

                    imQueue.user_id = groupCreatorId;
                    imQueue.msg_type = htmlMsgKey.INBOX_ACCEPTED.id;
                    imQueue.work_type = htmlMsgKey.INBOX_ACCEPTED.workType;
                    imQueue.icon = htmlMsgKey.INBOX_ACCEPTED.icon;
                    imQueue.html_msg = html;
                    imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                    imQueue.deep_link = deepLink;
                    imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(creator.serving_url));

                    logger.info(JSON.stringify(imQueue));
                    mq.assertQueue(queues['im'], {durable: true});
                    mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                  }
                }
              });
            });
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'acceptGroupInvitation', err);
        });
};

notificationUtil.acceptGroupInvitation = function(userId, groupId) {
  //notification =_='
  new Promise(function(resolve, reject) {
    //get group name
    cassandraClient.execute('SELECT name, create_userid FROM group WHERE group_id = ?', [groupId], {prepare: true}, function(err, result) {
      if (err) {
        logger.error(logTag, 'notification user join group', err);
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.rows.length > 0) {
            var groupName = result.rows[0].name;
            var groupCreatorId = result.rows[0].create_userid;

            //get user name
            redisCommon.getUserRedis(userId, function(user) {
              redisCommon.getUserRedis(groupCreatorId, function(creator) {
                if (user && creator) {

                  var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_ACCEPTED.deepLink, [Config.get('DeepLink'), groupId]);

                  if (Config.get('Notification.parse')) {
                    inboxModel.save({
                      userId: groupCreatorId,
                      fromUserId: userId,
                      htmlmsg: message.get(creator.language, messageKey.INBOX_ACCEPTED.str, [user.username, groupName]),
                      action: messageKey.INBOX_ACCEPTED.id,
                      groupName: groupName,
                    }).catch(notificationUtil.internals.saveInboxErrorHandler);

                    queue.product = systemSettings.get('Product', 'Name');
                    queue.method = 'acceptGroupInvitation';
                    queue.data = [creator.user_id, notificationUtil.internals.getLanguage(creator), messageKey.INBOX_ACCEPTED.str, [user.username, groupName], deepLink];
                    queueUtil.send(JSON.stringify(queue), 0, function() {
                                });
                  }

                  if (Config.get('Notification.im')) {
                    var html = htmlMsg.get(creator.language, htmlMsgKey.INBOX_ACCEPTED.str, [user.username, groupName]);

                    imQueue.user_id = groupCreatorId;
                    imQueue.msg_type = htmlMsgKey.INBOX_ACCEPTED.id;
                    imQueue.work_type = htmlMsgKey.INBOX_ACCEPTED.workType;
                    imQueue.icon = htmlMsgKey.INBOX_ACCEPTED.icon;
                    imQueue.html_msg = html;
                    imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                    imQueue.deep_link = deepLink;
                    imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(creator.serving_url));

                    // send to MQ

                    logger.info(JSON.stringify(imQueue));
                    mq.assertQueue(queues['im'], {durable: true});
                    mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                  }

                  //parseNotification.send(creator.user_id, notificationUtil.internals.getLanguage(creator), messageKey.INBOX_ACCEPTED.str, [user.username, groupName])
                }
              });
            });
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'acceptGroupInvitation', err);
        });
};

notificationUtil.likeComment = function(likeUserId, commentId, postId) {
  commentId = new Cassandra.types.Uuid.fromString(commentId);
  var query = 'SELECT user_id, comment FROM post_comment WHERE comment_id=?';
  var comment = '';
  new Promise(function(resolve, reject) {
    cassandraClient.execute(query, [commentId], {prepare: true}, function(err, result) {
      if (err) {
        logger.error(logTag, 'notification like', err);
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.rows.length > 0) {
            comment = result.rows[0].comment;
            Async.parallel([
                    function(next) {
                      redisCommon.getUserRedis(result.rows[0].user_id, function(commentOwner) {
                        next(null, commentOwner);
                      });
                    },

                    function(next) {
                      redisCommon.getUserRedis(likeUserId, function(likeUser) {
                        next(null, likeUser);
                      });
                    },
                ], function(err, result) {
                  if (result) {
                    if (result.length > 0) {
                      if (result[0].user_id != result[1].user_id) {

                        var product = systemSettings.get('Product', 'Name');
                        var language = notificationUtil.internals.getLanguage(result[0]);
                        var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_COMMENTLIKE.deepLink, [Config.get('DeepLink'), postId]);

                        if (Config.get('Notification.parse')) {
                          inboxModel.save({
                            userId: result[0].user_id,
                            fromUserId: result[1].user_id,
                            htmlmsg: comment, //special case
                            action: messageKey.INBOX_COMMENTLIKE.id,
                            comment: comment,
                            postId: postId,
                            commentId: commentId.toString(),
                          }).catch(notificationUtil.internals.saveInboxErrorHandler);

                          queue.product = product;
                          queue.method = 'likeComment';
                          queue.data = [result[0].user_id, language, messageKey.INBOX_COMMENTLIKE.str, [result[1].username, comment], deepLink];
                          queueUtil.send(JSON.stringify(queue), 0, function() {
                                    });

                        }

                        if (Config.get('Notification.im')) {
                          var html = htmlMsg.get(language, htmlMsgKey.INBOX_COMMENTLIKE.str, [result[1].username, comment]);

                          imQueue.user_id = result[0].user_id;
                          imQueue.msg_type = htmlMsgKey.INBOX_COMMENTLIKE.id;
                          imQueue.work_type = htmlMsgKey.INBOX_COMMENTLIKE.workType;
                          imQueue.icon = htmlMsgKey.INBOX_COMMENTLIKE.icon;
                          imQueue.html_msg = html;
                          imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                          imQueue.deep_link = deepLink;
                          imQueue.target_id = postId;
                          imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(result[1].serving_url));

                          // send to MQ
                          logger.info(JSON.stringify(imQueue));
                          mq.assertQueue(queues['im'], {durable: true});
                          mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                        }

                        //parseNotification.send(result[0].user_id, notificationUtil.internals.getLanguage(result[0]), messageKey.INBOX_COMMENTLIKE.str, [result[1].username, comment]);
                      }
                    }
                  }
                });
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'notification like', err);
        });
};

notificationUtil.mentionOnPost = function(postData, mentionedUserId) {
  redisCommon.getUserRedis(postData.user_id, function(postUser) {
    var keyLimitPos = mentionedUserId.indexOf(':');
    if (keyLimitPos > -1) {
      mentionedUserId = mentionedUserId.substr(0, keyLimitPos);
    }

    redisCommon.getUserRedis(mentionedUserId, function(mentionedUser) {
      if (postUser && mentionedUser) {

        var language = notificationUtil.internals.getLanguage(postUser);
        var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_MENTIONPOST.deepLink, [Config.get('DeepLink'), postData.post_id]);

        if (Config.get('Notification.parse')) {
          inboxModel.save({
            userId: mentionedUserId,
            fromUserId: postUser.user_id,
            postId: postData.post_id,
            action: messageKey.INBOX_MENTIONPOST.id,
            comment: postData.msg,
          }).catch(notificationUtil.internals.saveInboxErrorHandler);

          queue.product = systemSettings.get('Product', 'Name');
          queue.method = 'mentionOnPost';
          queue.data = [mentionedUserId, notificationUtil.internals.getLanguage(mentionedUser), messageKey.INBOX_MENTIONPOST.str, [postUser.username, postData.msg], deepLink];
          queueUtil.send(JSON.stringify(queue), 0, function() {
                    });
        }

        if (Config.get('Notification.im')) {
          var html = htmlMsg.get(language, htmlMsgKey.INBOX_MENTIONPOST.str, [postUser.username, postData.msg]);

          imQueue.user_id = mentionedUserId;
          imQueue.msg_type = htmlMsgKey.INBOX_MENTIONPOST.id;
          imQueue.work_type = htmlMsgKey.INBOX_MENTIONPOST.workType;
          imQueue.icon = htmlMsgKey.INBOX_MENTIONPOST.icon;
          imQueue.html_msg = html;
          imQueue.message = HTMLSanitizer(html, {allowedTags: []});
          imQueue.deep_link = deepLink;
          imQueue.target_id = postData.post_id;
          imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(postUser.serving_url));

          // send to MQ
          logger.info(JSON.stringify(imQueue));
          mq.assertQueue(queues['im'], {durable: true});
          mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
        }

        //parseNotification.send(mentionedUserId, notificationUtil.internals.getLanguage(mentionedUser),
        //    messageKey.INBOX_MENTIONPOST.str, [postUser.username, postData.msg], postData.post_id);
      }
    });
  });
};

function getDefaultPic(pic){
  if(pic){
    return pic;
  }
  return "http://img.investmaster.cn/defaultavatar.png";
}

notificationUtil.postOnGroup = function(userPostId, postData) {
  var groupId = '';
  try {
    // 不確定是不是Drive 更新後會報錯，但防呆一下
    groupId = new Cassandra.types.Uuid.fromString(postData.group_id); // maybe is object to string be error
  } catch (err) {
    console.log(err);
    console.log(postData);
    groupId = new Cassandra.types.Uuid.fromString(postData.group_id.toString());
  }

  var postMessage = postData.msg;
  notificationUtil.internals.getGroupName(groupId)
        .then(function(result) {
          var groupName = '';
          if (result.rows.length > 0) {
            groupName = result.rows[0].name;
            return new Promise(function(resolve, reject) {
              cassandraClient.execute('SELECT user_id FROM group_member WHERE group_id=?', [groupId], {prepare: true}, function(err, result) {
                if (err) {
                  logger.error(logTag, 'postOnGroup', err);
                  reject(err);
                }

                resolve(result);
              });
            })
                    .then(function(result) {
                      if (result.rows.length > 0) {
                        var users = result.rows;
                        redisCommon.getUserRedis(userPostId, function(userPost) {
                          if (userPost) {
                            users = _.reject(users, {user_id: userPostId});
                            _.forEach(users, function(user) {
                              redisCommon.getUserRedis(user.user_id, function(userToSend) {
                                if (userToSend) {

                                  var language = notificationUtil.internals.getLanguage(userToSend);
                                  var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_POSTGROUP.deepLink, [Config.get('DeepLink'), postData.post_id]);

                                  if (Config.get('Notification.parse')) {
                                    inboxModel.save({
                                      userId: userToSend.user_id,
                                      fromUserId: userPostId,
                                      postId: postData.post_id,
                                      action: messageKey.INBOX_POSTGROUP.id,
                                      groupId: groupId,
                                      comment: postData.msg,
                                      groupName: groupName,
                                    }).catch(notificationUtil.internals.saveInboxErrorHandler);

                                    queue.product = systemSettings.get('Product', 'Name');
                                    queue.method = 'postOnGroup';
                                    queue.data = [userToSend.user_id, notificationUtil.internals.getLanguage(userToSend), messageKey.INBOX_POSTGROUP.str, [userPost.username, groupName, postMessage], deepLink];
                                    queueUtil.send(JSON.stringify(queue), 0, function() {
                                                    });
                                  }

                                  if (Config.get('Notification.im')) {
                                    var html = htmlMsg.get(language, htmlMsgKey.INBOX_POSTGROUP.str, [userPost.username, groupName, postData.msg]);

                                    imQueue.user_id = userToSend.user_id;
                                    imQueue.msg_type = htmlMsgKey.INBOX_POSTGROUP.id;
                                    imQueue.work_type = htmlMsgKey.INBOX_POSTGROUP.workType;
                                    imQueue.icon = htmlMsgKey.INBOX_POSTGROUP.icon;
                                    imQueue.html_msg = html;
                                    imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                                    imQueue.deep_link = deepLink;
                                    imQueue.target_id = postData.post_id;
                                    imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(userPost.serving_url));
                                    logger.info(JSON.stringify(imQueue));
                                    mq.assertQueue(queues['im'], {durable: true});
                                    mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                                  }
                                }
                              });
                            });
                          }
                        });
                      }
                    })
                    .catch(function(err) {
                      logger.error(logTag, 'postOnGroup', err);
                    });
          }
        })
        .catch(function(err) {
          logger.error(logtag, 'postOnGroup', err);
        });
};

notificationUtil.createGroupV3 = function(groupCreatorId, groupId) {
  new Promise(function(resolve, reject) {
    mysqlGlobalModel.select(logTag, 'SELECT name FROM group_info WHERE group_id=?', [groupId], function(err, res) {
      resolve(res);
    });
  }).then(function(result) {
    if (result.length > 0) {
      var groupName = result[0].name;
      redisCommon.getUserRedis(groupCreatorId, function(groupCreator) {
        if (groupCreator) {
          if (groupCreator.hasOwnProperty('follower')) {
            if (groupCreator.follower) {
              var followers = groupCreator.follower.split(',');
              var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_GROUPCREATED.deepLink, [Config.get('DeepLink'), groupId]);
              _.forEach(followers, function(follower) {
                redisCommon.getUserRedis(follower, function(followerData) {
                  console.log(groupCreatorId, followerData.user_id);
                  if (followerData && (groupCreatorId != followerData.user_id)) {
                    if (followerData.user_id != null) {
                      if (Config.get('Notification.parse')) {
                        inboxModel.save({
                          userId: followerData.user_id,
                          fromUserId: groupCreatorId,
                          action: messageKey.INBOX_GROUPCREATED.id,
                          groupId: groupId,
                          groupName: groupName,
                        }).catch(notificationUtil.internals.saveInboxErrorHandler);

                        queue.product = systemSettings.get('Product', 'Name');
                        queue.method = 'createGroup';
                        queue.data = [follower, notificationUtil.internals.getLanguage(followerData), messageKey.INBOX_GROUPCREATED.str, [groupCreator.username, groupName], deepLink];
                        queueUtil.send(JSON.stringify(queue), 0, function() {
                                                    });
                      }

                      if (Config.get('Notification.im')) {
                        var language = notificationUtil.internals.getLanguage(followerData);
                        var html = htmlMsg.get(language, htmlMsgKey.INBOX_GROUPCREATED.str, [groupCreator.username, groupName]);

                        imQueue.user_id = followerData.user_id;
                        imQueue.msg_type = htmlMsgKey.INBOX_GROUPCREATED.id;
                        imQueue.work_type = htmlMsgKey.INBOX_GROUPCREATED.workType;
                        imQueue.icon = htmlMsgKey.INBOX_GROUPCREATED.icon;
                        imQueue.html_msg = html;
                        imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                        imQueue.deep_link = deepLink;
                        imQueue.target_id = groupId;
                        imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(groupCreator.serving_url));

                        // send to MQ
                        logger.info(JSON.stringify(imQueue));
                        mq.assertQueue(queues['im'], {durable: true});
                        mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                      }
                    }
                  }
                });
              });
            }
          }
        }
      });
    }
  })
        .catch(function(err) {
          logger.error(logTag, 'createGroup', err);
        });
};

notificationUtil.createGroup = function(groupCreatorId, groupId) {
  new Promise(function(resolve, reject) {
    cassandraClient.execute('SELECT name FROM group WHERE group_id=?', [groupId], {prepare: true}, function(err, result) {
      if (err) {
        logger.error(logTag, 'createGroup', err);
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.rows.length > 0) {
            var groupName = result.rows[0].name;
            redisCommon.getUserRedis(groupCreatorId, function(groupCreator) {
              if (groupCreator) {
                if (groupCreator.hasOwnProperty('follower')) {
                  if (groupCreator.follower) {
                    var followers = groupCreator.follower.split(',');

                    var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_GROUPCREATED.deepLink, [Config.get('DeepLink'), groupId]);

                    _.forEach(followers, function(follower) {
                      redisCommon.getUserRedis(follower, function(followerData) {
                        console.log(groupCreatorId, followerData.user_id);
                        if (followerData && (groupCreatorId != followerData.user_id)) {
                          if (followerData.user_id != null) {
                            if (Config.get('Notification.parse')) {
                              inboxModel.save({
                                userId: followerData.user_id,
                                fromUserId: groupCreatorId,
                                action: messageKey.INBOX_GROUPCREATED.id,
                                groupId: groupId,
                                groupName: groupName,
                              }).catch(notificationUtil.internals.saveInboxErrorHandler);

                              queue.product = systemSettings.get('Product', 'Name');
                              queue.method = 'createGroup';
                              queue.data = [follower, notificationUtil.internals.getLanguage(followerData), messageKey.INBOX_GROUPCREATED.str, [groupCreator.username, groupName], deepLink];
                              queueUtil.send(JSON.stringify(queue), 0, function() {
                                                    });
                            }

                            if (Config.get('Notification.im')) {
                              var language = notificationUtil.internals.getLanguage(followerData);
                              var html = htmlMsg.get(language, htmlMsgKey.INBOX_GROUPCREATED.str, [groupCreator.username, groupName]);

                              imQueue.user_id = followerData.user_id;
                              imQueue.msg_type = htmlMsgKey.INBOX_GROUPCREATED.id;
                              imQueue.work_type = htmlMsgKey.INBOX_GROUPCREATED.workType;
                              imQueue.icon = htmlMsgKey.INBOX_GROUPCREATED.icon;
                              imQueue.html_msg = html;
                              imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                              imQueue.deep_link = deepLink;
                              imQueue.target_id = groupId;
                              imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(groupCreator.serving_url));

                              // send to MQ
                              logger.info(JSON.stringify(imQueue));
                              mq.assertQueue(queues['im'], {durable: true});
                              mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                            }

                            //parseNotification.send(follower, notificationUtil.internals.getLanguage(followerData), messageKey.INBOX_GROUPCREATED.str, [groupCreator.username, groupName]);
                          }
                        }
                      });
                    });
                  }
                }
              }
            });
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'createGroup', err);
        });
};

notificationUtil.approveGroupRequestV3 = function(userId, requesterId, groupId) {
  new Promise(function(resolve, reject) {
    mysqlGlobalModel.select(logTag, 'SELECT name FROM group_info WHERE group_id=?', [groupId], function(err, result) {
      if (err) {
        logger.error(logTag, 'approveGroupRequest', err);
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.length > 0) {
            var groupName = result[0].name;
            redisCommon.getUserRedis(userId, function(user) {
              if (user != null) {
                redisCommon.getUserRedis(requesterId, function(requester) {
                  if (requester != null) {
                    var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_APPROVETOJOIN.deepLink, [Config.get('DeepLink'), groupId]);
                    if (Config.get('Notification.parse')) {
                      inboxModel.save({
                        userId: requesterId,
                        fromUserId: userId,
                        action: messageKey.INBOX_APPROVETOJOIN.id,
                        groupId: groupId,
                        groupName: groupName,
                      }).catch(notificationUtil.internals.saveInboxErrorHandler);
                      queue.product = systemSettings.get('Product', 'Name');
                      queue.method = 'approveGroupRequest';
                      queue.data = [requesterId, notificationUtil.internals.getLanguage(requester), messageKey.INBOX_APPROVETOJOIN.str, [user.username, groupName], deepLink];
                      queueUtil.send(JSON.stringify(queue), 0, function() {
                        console.log('queue sent'.red);
                      });

                      //parseNotification.send(requesterId, notificationUtil.internals.getLanguage(requester), messageKey.INBOX_APPROVETOJOIN.str, [user.username, groupName]);
                    }

                    if (Config.get('Notification.im')) {
                      var html = htmlMsg.get(requester.language, htmlMsgKey.INBOX_APPROVETOJOIN.str, [user.username, groupName]);

                      imQueue.user_id = requester.user_id;
                      imQueue.msg_type = htmlMsgKey.INBOX_APPROVETOJOIN.id;
                      imQueue.work_type = htmlMsgKey.INBOX_APPROVETOJOIN.workType;
                      imQueue.icon = htmlMsgKey.INBOX_APPROVETOJOIN.icon;
                      imQueue.html_msg = html;
                      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                      imQueue.deep_link = deepLink;
                      imQueue.target_id = groupId;
                      imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(user.serving_url));

                      // send to MQ
                      logger.info(JSON.stringify(imQueue));
                      mq.assertQueue(queues['im'], {durable: true});
                      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                    }
                  }
                });
              }
            });
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'approveGroupRequest', err);
        });
};

notificationUtil.approveGroupRequest = function(userId, requesterId, groupId) {
  new Promise(function(resolve, reject) {
    cassandraClient.execute('SELECT name FROM group WHERE group_id=?', [groupId], {prepare: true}, function(err, result) {
      if (err) {
        logger.error(logTag, 'approveGroupRequest', err);
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.rows.length > 0) {
            var groupName = result.rows[0].name;

            redisCommon.getUserRedis(userId, function(user) {
              if (user != null) {
                redisCommon.getUserRedis(requesterId, function(requester) {
                  if (requester != null) {

                    var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_APPROVETOJOIN.deepLink, [Config.get('DeepLink'), groupId]);

                    if (Config.get('Notification.parse')) {
                      inboxModel.save({
                        userId: requesterId,
                        fromUserId: userId,
                        action: messageKey.INBOX_APPROVETOJOIN.id,
                        groupId: groupId,
                        groupName: groupName,
                      }).catch(notificationUtil.internals.saveInboxErrorHandler);

                      queue.product = systemSettings.get('Product', 'Name');
                      queue.method = 'approveGroupRequest';
                      queue.data = [requesterId, notificationUtil.internals.getLanguage(requester), messageKey.INBOX_APPROVETOJOIN.str, [user.username, groupName], deepLink];
                      queueUtil.send(JSON.stringify(queue), 0, function() {
                        console.log('queue sent'.red);
                      });

                      //parseNotification.send(requesterId, notificationUtil.internals.getLanguage(requester), messageKey.INBOX_APPROVETOJOIN.str, [user.username, groupName]);
                    }

                    if (Config.get('Notification.im')) {
                      var html = htmlMsg.get(requester.language, htmlMsgKey.INBOX_APPROVETOJOIN.str, [user.username, groupName]);

                      imQueue.user_id = requester.user_id;
                      imQueue.msg_type = htmlMsgKey.INBOX_APPROVETOJOIN.id;
                      imQueue.work_type = htmlMsgKey.INBOX_APPROVETOJOIN.workType;
                      imQueue.icon = htmlMsgKey.INBOX_APPROVETOJOIN.icon;
                      imQueue.html_msg = html;
                      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                      imQueue.deep_link = deepLink;
                      imQueue.target_id = groupId;
                      imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(user.serving_url));

                      // send to MQ
                      logger.info(JSON.stringify(imQueue));
                      mq.assertQueue(queues['im'], {durable: true});
                      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                    }
                  }
                });
              }
            });
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'approveGroupRequest', err);
        });
};

notificationUtil.postComment = function(userId, responseData) {
  new Promise(function(resolve, reject) {
    var postId = cassandraCommon.assureTimeUuid(responseData.comment.postid);
    cassandraClient.execute('SELECT user_id, msg FROM post WHERE post_id=?', [postId], {prepare: true}, function(err, result) {
      if (err) {
        logger.error(logTag, 'postComment', err);
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.rows.length > 0) {
            var postOwnerId = result.rows[0].user_id;
            var postMsg = result.rows[0].msg;
            if (postOwnerId !== userId) {
              redisCommon.getUserRedis(postOwnerId, function(postOwner) {
                redisCommon.getUserRedis(userId, function(user) {
                  if (postOwner != null && user != null) {

                    var language = notificationUtil.internals.getLanguage(postOwner);
                    var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_COMMENT.deepLink, [Config.get('DeepLink'), responseData.comment.postid]);

                    if (Config.get('Notification.parse')) {
                      inboxModel.save({
                        userId: postOwnerId,
                        fromUserId: userId,
                        action: messageKey.INBOX_COMMENT.id,
                        postId: responseData.comment.postid,
                        comment: responseData.comment.comment,
                        htmlmsg: postMsg,
                        commentId: responseData.comment.commentid,
                      }).catch(notificationUtil.internals.saveInboxErrorHandler);

                      queue.product = systemSettings.get('Product', 'Name');
                      queue.method = 'postComment';
                      queue.data = [postOwnerId, notificationUtil.internals.getLanguage(postOwner), messageKey.INBOX_COMMENT.str, [user.username, postMsg], deepLink];
                      queueUtil.send(JSON.stringify(queue), 0, function() {
                        console.log('queue sent'.red);
                      });
                    }

                    if (Config.get('Notification.im')) {
                      var html = htmlMsg.get(language, htmlMsgKey.INBOX_COMMENT.str, [user.username, responseData.comment.comment]);

                      imQueue.user_id = postOwnerId;
                      imQueue.msg_type = htmlMsgKey.INBOX_COMMENT.id;
                      imQueue.work_type = htmlMsgKey.INBOX_COMMENT.workType;
                      imQueue.icon = htmlMsgKey.INBOX_COMMENT.icon;
                      imQueue.html_msg = html;
                      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                      imQueue.deep_link = deepLink;
                      imQueue.target_id = responseData.comment.postid;
                      imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(user.serving_url));

                      // send to MQ
                      logger.info(JSON.stringify(imQueue));
                      mq.assertQueue(queues['im'], {durable: true});
                      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                    }
                  } else {
                    logger.info('user not found', 'postOwnerId:', postOwnerId, 'userId:', userId);
                  }

                  //parseNotification.send(postOwnerId, notificationUtil.internals.getLanguage(postOwner),
                  //    messageKey.INBOX_COMMENT.str, [user.username, postMsg], responseData.comment.postid);
                });
              });
            }
          }
        })
        .catch(function(err) {
          logger.error(logTag, 'postComment', err);
        });
};

notificationUtil.mentionComment = function(userId, responseData) {
  new Promise(function(resolve, reject) {
    var postId = cassandraCommon.assureTimeUuid(responseData.comment.postid);
    cassandraClient.execute('SELECT user_id, msg FROM post WHERE post_id=?', [postId], {prepare: true}, function(err, result) {
      if (err) {
        logger.error(logTag, 'mentionComment', err);
        reject(err);
      }

      resolve(result);
    });
  })
        .then(function(result) {
          if (result.rows.length > 0) {
            var postMsg = result.rows[0].msg;
            redisCommon.getUserRedis(userId, function(user) {
              _.forEach(responseData.comment.mentionuseridarray, function(mentionedUserId) {
                var keyLimitPos = mentionedUserId.indexOf(':');
                if (keyLimitPos > -1) {
                  mentionedUserId = mentionedUserId.substr(0, keyLimitPos);
                }

                redisCommon.getUserRedis(mentionedUserId, function(mentionedUser) {
                  if (mentionedUser != null) {

                    var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_MENTIONCOMMENT.deepLink, [Config.get('DeepLink'), responseData.comment.postid]);

                    if (Config.get('Notification.parse')) {
                      inboxModel.save({
                        userId: mentionedUserId,
                        fromUserId: userId,
                        action: messageKey.INBOX_MENTIONCOMMENT.id,
                        postId: responseData.comment.postid,
                        comment: responseData.comment.comment,
                        htmlmsg: postMsg,
                        commentId: responseData.comment.commentid,
                      }).catch(notificationUtil.internals.saveInboxErrorHandler);

                      queue.product = systemSettings.get('Product', 'Name');
                      queue.method = 'mentionComment';
                      queue.data = [mentionedUserId, notificationUtil.internals.getLanguage(mentionedUser), messageKey.INBOX_MENTIONCOMMENT.str, [user.username, postMsg], deepLink];
                      queueUtil.send(JSON.stringify(queue), 0, function() {
                        console.log('queue sent'.red);
                      });
                    }

                    if (Config.get('Notification.im')) {
                      var html = htmlMsg.get(user.language, htmlMsgKey.INBOX_MENTIONCOMMENT.str, [user.username, postMsg]);

                      imQueue.user_id = mentionedUserId;
                      imQueue.msg_type = htmlMsgKey.INBOX_MENTIONCOMMENT.id;
                      imQueue.work_type = htmlMsgKey.INBOX_MENTIONCOMMENT.workType;
                      imQueue.icon = htmlMsgKey.INBOX_MENTIONCOMMENT.icon;
                      imQueue.html_msg = html;
                      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
                      imQueue.deep_link = deepLink;
                      imQueue.target_id = responseData.comment.postid;
                      imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(user.serving_url));

                      // send to MQ
                      logger.info(JSON.stringify(imQueue));
                      mq.assertQueue(queues['im'], {durable: true});
                      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
                    }
                  } else {
                    console.log('no search user in redis!!');
                  }
                });
              });
            });
          }

        })
        .catch(function(err) {
          logger.error(logTag, 'mentionComment', err);
        });
};

notificationUtil.follow = function(userId, followUserId) {
  redisCommon.getUserRedis(followUserId, function(user) {
    redisCommon.getUserRedis(userId, function(follower) {
      if (user) {
        var followStatus = 'false';
        if (user.hasOwnProperty('following')) {
          if (user.following.split(',').indexOf(userId) > -1) {
            followStatus = 'true';
          }
        }

        var deepLink = htmlMsg.internals.injectData(htmlMsgKey.INBOX_FOLLOW.deepLink, [Config.get('DeepLink'), userId, followStatus]);

        if (Config.get('Notification.parse')) {
          inboxModel.save({
            userId: followUserId,
            fromUserId: userId,
            action: messageKey.INBOX_FOLLOW.id,
          }).catch(notificationUtil.internals.saveInboxErrorHandler);

          queue.product = systemSettings.get('Product', 'Name');
          queue.method = 'follow';
          queue.data = [followUserId, user.language, messageKey.INBOX_FOLLOW.str, [follower.username], deepLink];
          queueUtil.send(JSON.stringify(queue), 0, function() {
            //console.log('queue sent'.red);
          });
        }

        if (Config.get('Notification.im')) {
          var html = htmlMsg.get(user.language, htmlMsgKey.INBOX_FOLLOW.str, [follower.username]);

          imQueue.user_id = followUserId;
          imQueue.msg_type = htmlMsgKey.INBOX_FOLLOW.id;
          imQueue.work_type = htmlMsgKey.INBOX_FOLLOW.workType;
          imQueue.icon = htmlMsgKey.INBOX_FOLLOW.icon;
          imQueue.html_msg = html;
          imQueue.message = HTMLSanitizer(html, {allowedTags: []});
          imQueue.deep_link = deepLink;
          imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(follower.serving_url));

          // send to MQ
          logger.info(JSON.stringify(imQueue));
          mq.assertQueue(queues['im'], {durable: true});
          mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
        }

        //parseNotification.send(followUserId, user.language, messageKey.INBOX_FOLLOW.str, [follower.username]);
      }
    });
  });
};

notificationUtil.referralCode = function(codeOwnerId, codeUserId) {
  redisCommon.getUserRedis(codeOwnerId, function(codeOwner) {
    redisCommon.getUserRedis(codeUserId, function(codeUser) {
      var coinBonus = '';
      return new Promise(function(resolve, reject) {
        var query = 'SELECT * FROM ' + centraldb.get('DEFAULT') + '.social_coin_settings WHERE feature=98';
        mysqlGlobalModel.select(logTag, query, [], function(err, res) {
          if (err) {
            logger.error(logTag, '[select invite default coin]', err);
            resolve();
          }

          coinBonus = res[0].coins;
          resolve();
        });
      })
        .then(function() {
          if (codeUser && codeOwner) {

            var deepLink = htmlMsg.internals.injectData(htmlMsgKey.REFERRAL_CONFIRMED.deepLink, [Config.get('DeepLink')]);

            if (Config.get('Notification.parse')) {
              inboxModel.save({
                userId: codeOwnerId,
                fromUserId: codeUserId,
                comment: message.get(codeOwner.language, messageKey.REFERRAL_CONFIRMED.str, [codeUser.username, coinBonus]),
                htmlmsg: message.get(codeOwner.language, messageKey.REFERRAL_CONFIRMED.str, [codeUser.username, coinBonus]),
                action: messageKey.REFERRAL_CONFIRMED.id,
              }).catch(notificationUtil.internals.saveInboxErrorHandler);

              queue.product = systemSettings.get('Product', 'Name');
              queue.method = 'referralCode';
              queue.data = [codeOwnerId, codeOwner.language, messageKey.REFERRAL_CONFIRMED.str, [codeUser.username, coinBonus], deepLink];
              queueUtil.send(JSON.stringify(queue), 0, function() {
                console.log('queue sent'.red);
              });
            }

            if (Config.get('Notification.im')) {
              var html = htmlMsg.get(notificationUtil.internals.getLanguage(codeUser), htmlMsgKey.REFERRAL_CONFIRMED.str, [codeUser.username, coinBonus]);

              imQueue.user_id = codeOwnerId;
              imQueue.msg_type = htmlMsgKey.REFERRAL_CONFIRMED.id;
              imQueue.work_type = htmlMsgKey.REFERRAL_CONFIRMED.workType;
              imQueue.icon = htmlMsgKey.REFERRAL_CONFIRMED.icon;
              imQueue.html_msg = html;
              imQueue.message = HTMLSanitizer(html, {allowedTags: []});
              imQueue.deep_link = deepLink;
              imQueue.serving_url = getDefaultPic(storageAgent.getSmallImageUrl(codeUser.serving_url));

              // send to MQ
              logger.info(JSON.stringify(imQueue));
              mq.assertQueue(queues['im'], {durable: true});
              mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
            }
          }
        });
    });
  });
};

notificationUtil.fuel = {
  exchange: function(userId, fuelChangeLimit, fuelChangeQty) {
    redisCommon.getUserRedis(userId, function(user) {
      if (user) {

        var deepLink = htmlMsg.internals.injectData(htmlMsgKey.FUEL_EXCHANGE.deepLink, [Config.get('DeepLink')]);

        if (Config.get('Notification.parse')) {
          var msg = message.get(user.language, messageKey.FUEL_EXCHANGE.str, [fuelChangeLimit, fuelChangeQty]);
          inboxModel.save({
            userId: userId,
            fromUserId: userId,
            comment: msg,
            htmlmsg: msg,
            action: messageKey.FUEL_EXCHANGE.id,
          }).catch(notificationUtil.internals.saveInboxErrorHandler);

          queue.product = systemSettings.get('Product', 'Name');
          queue.method = 'fuelExchange';
          queue.data = [userId, user.language, messageKey.FUEL_EXCHANGE.str, [fuelChangeLimit, fuelChangeQty], deepLink];
          queueUtil.send(JSON.stringify(queue), 0, function() {
            console.log('queue sent'.red);
          });
        }

        if (Config.get('Notification.im')) {
          var html = htmlMsg.get(user.language, htmlMsgKey.FUEL_EXCHANGE.str, [fuelChangeLimit, fuelChangeQty]);

          imQueue.user_id = userId;
          imQueue.msg_type = htmlMsgKey.FUEL_EXCHANGE.id;
          imQueue.work_type = htmlMsgKey.FUEL_EXCHANGE.workType;
          imQueue.icon = htmlMsgKey.FUEL_EXCHANGE.icon;
          imQueue.html_msg = html;
          imQueue.message = HTMLSanitizer(html, {allowedTags: []});
          imQueue.deep_link = deepLink;
          imQueue.serving_url = '';

          // send to MQ
          logger.info(JSON.stringify(imQueue));
          mq.assertQueue(queues['im'], {durable: true});
          mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
        }
      }
    });
  },

  full: function(userId) {
    redisCommon.getUserRedis(userId, function(user) {
      if (user) {

        var deepLink = htmlMsg.internals.injectData(htmlMsgKey.FUEL_FULL.deepLink, [Config.get('DeepLink')]);

        if (Config.get('Notification.parse')) {
          var msg = message.get(user.language, messageKey.FUEL_FULL.str, []);
          inboxModel.save({
            userId: userId,
            fromUserId: userId,
            comment: msg,
            htmlmsg: msg,
            action: messageKey.FUEL_FULL.id,
          }).catch(notificationUtil.internals.saveInboxErrorHandler);

          queue.product = systemSettings.get('Product', 'Name');
          queue.method = 'fuelFull';
          queue.data = [userId, user.language, messageKey.FUEL_FULL.str, [], deepLink];
          queueUtil.send(JSON.stringify(queue), 0, function() {
            console.log('queue sent'.red);
          });
        }

        if (Config.get('Notification.im')) {
          var html = htmlMsg.get(user.language, htmlMsgKey.FUEL_FULL.str, []);

          imQueue.user_id = userId;
          imQueue.msg_type = htmlMsgKey.FUEL_FULL.id;
          imQueue.work_type = htmlMsgKey.FUEL_FULL.workType;
          imQueue.icon = htmlMsgKey.FUEL_FULL.icon;
          imQueue.html_msg = html;
          imQueue.message = HTMLSanitizer(html, {allowedTags: []});
          imQueue.deep_link = deepLink;
          imQueue.serving_url = '';

          // send to MQ
          logger.info(JSON.stringify(imQueue));
          mq.assertQueue(queues['im'], {durable: true});
          mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
        }
      }
    });
  },

  low: function(userId) {
    redisCommon.getUserRedis(userId, function(user) {
      if (user != null) {

        var deepLink = htmlMsg.internals.injectData(htmlMsgKey.FUEL_LOW.deepLink, [Config.get('DeepLink')]);

        if (Config.get('Notification.parse')) {
          var msg = message.get(user.language, messageKey.FUEL_LOW.str, []);
          inboxModel.save({
            userId: userId,
            fromUserId: userId,
            comment: msg,
            htmlmsg: msg,
            action: messageKey.FUEL_LOW.id,
          }).catch(notificationUtil.internals.saveInboxErrorHandler);

          queue.product = systemSettings.get('Product', 'Name');
          queue.method = 'fuelLow';
          queue.data = [userId, user.language, messageKey.FUEL_LOW.str, [], deepLink];
          queueUtil.send(JSON.stringify(queue), 0, function() {
            console.log('queue sent'.red);
          });
        }

        if (Config.get('Notification.im')) {
          var html = htmlMsg.get(user.language, htmlMsgKey.FUEL_LOW.str, []);

          imQueue.user_id = userId;
          imQueue.msg_type = htmlMsgKey.FUEL_LOW.id;
          imQueue.work_type = htmlMsgKey.FUEL_LOW.workType;
          imQueue.icon = htmlMsgKey.FUEL_LOW.icon;
          imQueue.html_msg = html;
          imQueue.message = HTMLSanitizer(html, {allowedTags: []});
          imQueue.deep_link = deepLink;
          imQueue.serving_url = '';

          // send to MQ
          logger.info(JSON.stringify(imQueue));
          mq.assertQueue(queues['im'], {durable: true});
          mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
        }
      }
    });
  },
};

notificationUtil.internals = {
  getGroupName: function(groupId) {
    return new Promise(function(resolve, reject) {
      groupId = cassandraCommon.assureUuid(groupId);
      cassandraClient.execute('SELECT name FROM group WHERE group_id=?', [groupId], {prepare: true}, function(err, result) {
        if (err) {
          logger.error(logTag, 'getGroupName', err);
          reject(err);
        }

        resolve(result);
      });
    });
  },

  saveInboxErrorHandler: function(err) {
    logger.error(logTag, 'saveInboxError', err);
  },

  getLanguage: function(user) {
    if (!_.has(user, 'language')) {
      return 'EN';
    }

    return user.language;
  },
};

notificationUtil.school = {
  pass: function(userId) {
    redisCommon.getUserRedis(userId, function(user) {
      var deepLink = htmlMsg.internals.injectData(htmlMsgKey.SCHOOL_PASS.deepLink, [Config.get('DeepLink')]);

      var html = htmlMsg.get(user.language, htmlMsgKey.SCHOOL_PASS.str, []);
      imQueue.user_id = userId;
      imQueue.msg_type = htmlMsgKey.SCHOOL_PASS.id;
      imQueue.work_type = htmlMsgKey.SCHOOL_PASS.workType;
      imQueue.icon = htmlMsgKey.SCHOOL_PASS.icon;
      imQueue.html_msg = html;
      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
      imQueue.deep_link = deepLink;
      imQueue.serving_url = '';

      // send to MQ
      logger.info(JSON.stringify(imQueue));
      mq.assertQueue(queues['im'], {durable: true});
      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
    });
  },

  rejected: function(userId) {
    redisCommon.getUserRedis(userId, function(user) {
      var deepLink = htmlMsg.internals.injectData(htmlMsgKey.SCHOOL_REJECTED.deepLink, [Config.get('DeepLink')]);

      var html = htmlMsg.get(user.language, htmlMsgKey.SCHOOL_REJECTED.str, []);
      imQueue.user_id = userId;
      imQueue.msg_type = htmlMsgKey.SCHOOL_REJECTED.id;
      imQueue.work_type = htmlMsgKey.SCHOOL_REJECTED.workType;
      imQueue.icon = htmlMsgKey.SCHOOL_REJECTED.icon;
      imQueue.html_msg = html;
      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
      imQueue.deep_link = deepLink;
      imQueue.serving_url = '';

      // send to MQ
      logger.info(JSON.stringify(imQueue));
      mq.assertQueue(queues['im'], {durable: true});
      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
    });
  },

  remind: function(userId) {
    redisCommon.getUserRedis(userId, function(user) {
      var deepLink = htmlMsg.internals.injectData(htmlMsgKey.SCHOOL_REMIND.deepLink, [Config.get('DeepLink')]);

      var html = htmlMsg.get(user.language, htmlMsgKey.SCHOOL_REMIND.str, []);
      imQueue.user_id = userId;
      imQueue.msg_type = htmlMsgKey.SCHOOL_REMIND.id;
      imQueue.work_type = htmlMsgKey.SCHOOL_REMIND.workType;
      imQueue.icon = htmlMsgKey.SCHOOL_REMIND.icon;
      imQueue.html_msg = html;
      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
      imQueue.deep_link = deepLink;
      imQueue.serving_url = '';

      // send to MQ
      logger.info(JSON.stringify(imQueue));
      mq.assertQueue(queues['im'], {durable: true});
      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
    });
  },

  expired: function(userId) {
    redisCommon.getUserRedis(userId, function(user) {
      var deepLink = htmlMsg.internals.injectData(htmlMsgKey.SCHOOL_EXPIRED.deepLink, [Config.get('DeepLink')]);

      var html = htmlMsg.get(user.language, htmlMsgKey.SCHOOL_EXPIRED.str, []);
      imQueue.user_id = userId;
      imQueue.msg_type = htmlMsgKey.SCHOOL_EXPIRED.id;
      imQueue.work_type = htmlMsgKey.SCHOOL_EXPIRED.workType;
      imQueue.icon = htmlMsgKey.SCHOOL_EXPIRED.icon;
      imQueue.html_msg = html;
      imQueue.message = HTMLSanitizer(html, {allowedTags: []});
      imQueue.deep_link = deepLink;
      imQueue.serving_url = '';

      // send to MQ
      logger.info(JSON.stringify(imQueue));
      mq.assertQueue(queues['im'], {durable: true});
      mq.sendToQueue(queues['im'], new Buffer(JSON.stringify(imQueue)));
    });
  },
};

module.exports = notificationUtil;
