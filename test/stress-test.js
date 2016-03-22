/**
 * Created by dev0x10 on 4/3/15.
 */
'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var Promise = require('bluebird');
var cassandraClient = require('../utils/cassandra-client');
var Wreck = require('wreck');

describe('Stress test', function() {

  it('get user performance AWS', {timeout: 10000000}, function(done) {
    var data = {
      type: 1,
      auth_token: 'Lg856akPa+Hlfh0nfRwDkWU9a2R4Rvd0cd+vCvA53+p2p6u5xCWn0I+rYVEFa5fK+c1QIV7ceEIyG9gk45erxOx0p+eIxDo1Z38R0Vdj9BT746sh1yiEXj6TJFL1jenukk7FV1Q6AxJO0PpBHnvGt262ovxS+f1EaBeH2vlzelizBCSxeatt1bDkBbyseG5YzXdvmlC3VIudsNbQW5SPUrjuKi83ge7AAHxw8Kt0QZPR1QULZe0bDvrErz7RDfXuiteJadn/778QYNksc2kjUsmF82D7zq0JYonbZRUDVRJNwhz9ucvt5ADh9ooVeJrhFo1PmNc0y4yXHevaXIGO6w==',
      userid: 'yaurie',
    };
    var url = 'http://52.69.7.170/apis/getPerformance';

    var counter = 0;
    for (var i = 0; i < 2000; i++) {
      Wreck.post(url, {payload: JSON.stringify(data)}, function(err, res, payload) {
        ++counter;
        console.log('done', i);
        if (counter == 2000) {
          done();
        }
      });
    }
  });

  it('Query cassandra', {timeout: 100000}, function(done) {
    var count = 0;
    var username = ['cc', 'rayson', 'seemo', 'joe', 'p001', 'cc', 'rayson', 'p001', 'seemo', 'rayson'];

    //select user_id,username,ossserving_url,serving_url from user where user_id = 'catmm'
    for (var i = 0; i < 5000; i++) {
      var user = username[Math.floor((Math.random() * 10) + 1)];
      cassandraClient.execute('select user_id,username,ossserving_url,serving_url from fdtsocial.user where user_id =?', [user], function(err, res) {
        ++count;
        console.log(count);
      });
    }

    for (var i = 0; i < 5000; i++) {
      var user = username[Math.floor((Math.random() * 10) + 1)];
      cassandraClient.execute('select user_id,username,ossserving_url,serving_url from fdtsocial.user where user_id =?', [user], function(err, res) {
        ++count;
        console.log(count);
      });
    }

    for (var i = 0; i < 5000; i++) {
      var user = username[Math.floor((Math.random() * 10) + 1)];
      cassandraClient.execute('select user_id,username,ossserving_url,serving_url from fdtsocial.user where user_id =?', [user], function(err, res) {
        ++count;
        console.log(count);
      });
    }

    for (var i = 0; i < 5000; i++) {
      var user = username[Math.floor((Math.random() * 10) + 1)];
      cassandraClient.execute('select user_id,username,ossserving_url,serving_url from fdtsocial.user where user_id =?', [user], function(err, res) {
        ++count;
        console.log(count);
        if (count === 20000) {
          done();
        }
      });
    }
  });

});
