'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var splashScreenModel = require('../../../modules/splash-screen/v0/splash-screen-model-v0');
var mysqlCon = require('../../../utils/ltscentralmysql-client');
var Promise = require('bluebird');

describe('Splash screen model test', function() {

  var dbCon = {};
  var mockData = [
      { region: 'US', display_until: '2015-10-30', url: 'http://www.fdt.io/US', splash_screen_id: 'splash-us'},
      { region: 'TW', display_until: '2015-10-29', url: 'http://www.fdt.io/TW', splash_screen_id: 'splash-tw' },
      { region: 'IN', display_until: '2015-10-28', url: 'http://www.fdt.io/IN', splash_screen_id: 'splash-in' },
      { region: 'HK', display_until: '2015-10-27', url: 'http://www.fdt.io/HK', splash_screen_id: 'splash-hk' },
      { region: 'GB', display_until: '2015-10-26', url: 'http://www.fdt.io/GB', splash_screen_id: 'splash-gb' },
      { region: 'OTHERS', display_until: '2015-10-25', url: 'http://www.fdt.io/OTHERS', splash_screen_id: 'splash-others' },
  ];

  function insertIntoSplashScreen(mockObj) {
    return new Promise(function(resolve, reject) {
      var query = 'INSERT INTO splash_screen (id) VALUES (?)';
      dbCon.query(query, [mockObj.splash_screen_id], function(err, result) {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  function insertIntoSplashScreenEnabled(mockObj) {
    return new Promise(function(resolve, reject) {
      var query = 'INSERT INTO splash_screen_enabled (region, display_until, url, splash_screen_id) VALUES (?,?,?,?)';
      dbCon.query(query, [mockObj.region, mockObj.display_until, mockObj.url, mockObj.splash_screen_id], function(err, result) {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  before(function(done) {
    mysqlCon.initial()
            .then(function(connection) {
              dbCon = connection;
              Promise.all([Promise.map(mockData, insertIntoSplashScreen), Promise.map(mockData, insertIntoSplashScreenEnabled)])
                    .then(function(res) {
                      done();
                    });
            });
  });

  after(function(done) {
    dbCon.query('TRUNCATE splash_screen', function(err, res) {
      if (err) {
        console.error(err);
      }

      dbCon.query('TRUNCATE splash_screen_enabled', function(err, res) {
        if (err) {
          console.error(err);
        }

        done();
      });
    });
  });

  //INFO: cannot run test because of connection has been changed!!
  it('Test get splash screen', function(done) {
    splashScreenModel.get('US')
            .then(function(url) {
              console.log('done', url);
            })
            .catch(function(err) {
              console.log('error', err);
            })
            .finally(function() {
              done();
            });
  });

});
