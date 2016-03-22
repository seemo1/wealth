'use strict';

var notificationUtil = require('../commonlib/notification/notification-util');
var emitter = require('events').EventEmitter;
var Config = require('config');
var cassandraConnect = require('../utils/cassandra-client');
var redisConnect = require('../utils/redis-client');
var systemSettings = require('../commonlib/settings-common');
var redisQueueConnect = require('../utils/queue-util');
var mysqlCentralConnect = require('../utils/ltscentralmysql-client.js');
var mysqlGlobalConnect = require('../utils/ltsglobalmysql-client.js');
var mqConnect = require('../utils/mq-client.js');
var logger = require('../utils/logger');
var queueConnection = require('../utils/queue-util');

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var Promise = require('bluebird');

var target_user = 'rayson';
var push_user = 'seemo';

global.evt = new emitter();
global.cassandraClient = null;
global.mysqlCentralPool = {};
/** much safier way when use pool.getConnection and release it when one process done **/
global.mysqlCentralClient = {};
global.mysqlPool = {};
/** much safier way when use pool.getConnection and release it when one process done **/
global.mysqlClient = {};
global.redisClient = {};
global.redisQueue = {};
global.queueUtil = {};
global.mq = {};

describe('IM Notification TEST ', function() {
  var dbCentral = {};
  var dbGlobal = {};
  var cassandraClient = {};

  before(function(done) {
    Promise.all([
        cassandraConnect.initial(),
        mysqlCentralConnect.initial(),
        mysqlGlobalConnect.initial(),
        redisConnect.initial(),
        redisQueueConnect.initial(),
        queueConnection.initial(),
    ])
          .then(function(conn) {
            cassandraClient = conn[0];
            console.info('Cassandra is ready'.yellow);

            mysqlCentralPool = mysqlCentralClient = conn[1];
            console.info('MySQL(Central) is ready'.yellow);

            mysqlPool = mysqlClient = conn[2];
            console.info('MySQL(Global) is ready'.yellow);

            redisClient = conn[3];
            console.info('Redis is ready'.yellow);

            queueUtil = conn[5];
            console.info('Redis queue connection is ready'.yellow);

          })
          .then(mqConnect.initialAsync)
          .then(function(channel) {
            mq = channel;
            console.info('MQ service is ready'.yellow);

          }).then(redisQueueConnect.initial)
          .then(function(conn) {
            redisQueue = conn;
            console.info('Redis Queue is ready'.yellow);

          }).then(systemSettings.loadFromMysql)
          .then(function(res) {
            console.log(res);
            done();
          })
          .catch(function(e) {
            console.error(e);
          });

  });

    it('Follow Message', function(done) {
        notificationUtil.follow(push_user, target_user);
        done();
      });

    it('Reffural Code', function(done) {
        notificationUtil.referralCode(target_user, push_user);
        done();
      });

    it('Like Post', function(done) {
        var sql = 'select post_id from post where user_id = ? limit 1;';
        cassandraClient.execute(sql, [target_user], {prepare: true}, function(err, res) {
            if (err) {
              console.log(err);
            }

            if (res.rows.length > 0) {

              notificationUtil.likePost(push_user, res.rows[0].post_id);
              done();

            }
          });
      });

    it('Group Test.. ', function(done) {
      var sql = 'select group_id from group limit 1;';
      cassandraClient.execute(sql, [], {prepare: true}, function(err, res) {
        if (err) {
          console.log(err);
        }

        if (res.rows.length > 0) {
          notificationUtil.createGroup(push_user, res.rows[0].group_id);
          notificationUtil.approveGroupRequest(push_user, target_user, res.rows[0].group_id);
          notificationUtil.requestToJoinGroup(target_user, res.rows[0].group_id);
          notificationUtil.acceptGroupInvitation(target_user, res.rows[0].group_id);
          notificationUtil.inviteGroup(target_user, push_user, res.rows[0].group_id);
          done();
        }
      });
    });

    it('timeline test Post', function(done) {

      var sql = 'select * from post where user_id = ? limit 1;';
      cassandraClient.execute(sql, [target_user], {prepare: true}, function(err, res) {
        if (err) {
          console.log(err);
        }

        if (res.rows.length > 0) {
          notificationUtil.mentionOnPost(res.rows[0], target_user);
          notificationUtil.likePost(push_user, res.rows[0].post_id);
          done();
        }
      });
    });

  it('group post', function(done) {
    new Promise(function(resolve, reject) {
      var sql = 'select post_id from post_group limit 1;';
      cassandraClient.execute(sql, [], {prepare:true}, function(err, res) {
        if (err) {
          console.log(err);
          reject();
        }else {
          resolve(res.rows[0].post_id);
        }
      });
    })
    .then(function(post_id) {
      new Promise(function(resolve, reject){
      var sql = 'select * from post where post_id = ?;';
      cassandraClient.execute(sql, [post_id], {prepare:true}, function(err, res) {
        if (err) {
          console.log(err);
        }else {
          if (res.rows.length > 0) {
            notificationUtil.postOnGroup(target_user, res.rows[0]);
            resolve();

          }
        }
      });
    })
    .then(function() {done();});

    });
  });

  it('post test comment', function(done) {
    new Promise(function(resolve, reject) {
      var sql = 'select * from post_comment limit 1;';
      cassandraClient.execute(sql, [], {prepare: true}, function(err, res) {
        if (err) {
          console.log(err);
          reject();
        } else {

          if (res.rows.length > 0) {

              resolve(res.rows[0]);
          }
        }
      });
    }).then(function(comment) {
      new Promise(function(resolve, reject) {

        cassandraClient.execute('select * from post where post_id=?;', [comment.post_id], {prepare: true}, function(err, res) {
          if (err) {
            //
          } else {

            if (res.rows.length == 0) {
              cassandraClient.execute('delete from post_comment where post_id=?;', [comment.post_id], {prepare: true}, function(err, res) {

              });
              reject();
            } else {
              console.log(comment);
              var obj = {comment: comment};
              obj.comment.postid = comment.post_id;
              notificationUtil.postComment(push_user, obj);
              notificationUtil.mentionComment(push_user,obj);
              done();
            }
          }
        });
      });
    })

  });

  it('FUEL Message', function(done) {
    notificationUtil.fuel.exchange(target_user,'300','1');
    notificationUtil.fuel.full(target_user);
    notificationUtil.fuel.low(target_user);
    done();
  });


  it('school',function(done){
      notificationUtil.school.pass(target_user);
      notificationUtil.school.remind(target_user);
      notificationUtil.school.expired(target_user);
      notificationUtil.school.rejected(target_user);
  });

  it('wait 2 sec ...', function(done) {
    setTimeout(function() {done();}, 2000);
  });


});
