'use strict';

global.mysqlCentralClient = {};
global.mysqlCentralPool = {};

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var mysqlUtil = require('../../utils/mysql-util');
var mysqlCon = require('../../utils/ltscentralmysql-client');

describe('test description', function() {

  before(function(done) {
    mysqlCon.initial()
        .then(function(conn) {
          mysqlUtil.setConnection(conn);
          done();
        });
  });

  it('mysqlUtil query should throw error on params is not an array', function(done) {
    var query = 'SELECT * FROM system_settings';
    mysqlUtil.query(query, 'not array')
        .catch(function(err) {
          expect(err).to.be.equal('params must be an array!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil query should returns an object', function(done) {
    var query = 'SELECT * FROM system_settings';
    mysqlUtil.query(query, [])
        .then(function(res) {
          expect(res).to.be.instanceOf(Object);
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil select should throw error on table name is empty', function(done) {
    mysqlUtil.select('', [], [])
        .then(function(res) {
          //do nothing
        })
        .catch(function(err) {
          expect(err).to.be.equal('table name must be a string!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil select should throw error on fields is not an array', function(done) {
    mysqlUtil.select('tableName', '', [])
          .then(function(res) {
            //do nothing
          })
          .catch(function(err) {
            expect(err).to.be.equal('fields must be an array!');
          })
          .finally(function() {
            done();
          });
  });

  it('mysqlUtil select should throw error on condition is not an object', function(done) {
    mysqlUtil.select('tableName', ['*'], [])
        .then(function(res) {
          //do nothing
        })
        .catch(function(err) {
          expect(err).to.be.equal('conditions must be a key value object!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil select should throw error on condition is not an object', function(done) {
    mysqlUtil.select('tableName', ['*'], '')
        .then(function(res) {
          //do nothing
        })
        .catch(function(err) {
          expect(err).to.be.equal('conditions must be a key value object!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil select should returns an object', function(done) {
    mysqlUtil.select('system_settings', ['*'], {type: 'Group'})
        .then(function(res) {
          //do nothing
          expect(res).to.be.instanceOf(Object);
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil insert with no table name should throw error', function(done) {
    mysqlUtil.insert('', {name: '123'})
        .catch(function(err) {
          expect(err).to.be.equal('table name must be a string!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil insert with params string should throw error', function(done) {
    mysqlUtil.insert('tableName', '')
        .catch(function(err) {
          expect(err).to.be.equal('params must be a key value object!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil insert with empty params should throw error', function(done) {
    mysqlUtil.insert('tableName', {})
        .catch(function(err) {
          expect(err).to.be.equal('params cannot be an empty object!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil insert should returns an object', function(done) {
    mysqlUtil.insert('system_settings', {key_code:'mysqlUtil', type: 'name', value:'123'})
        .then(function(res) {
          expect(res).to.be.instanceOf(Object);
        })
        .catch(function(err) {
          console.error(err);
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil delete should throw an error if table name is empty', function(done) {
    mysqlUtil.delete('', {key_code:'mysqlUtil', type: 'name'})
        .catch(function(err) {
          expect(err).to.be.equal('table name must be a string!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil delete should throw an error if conditions is not an object', function(done) {
    mysqlUtil.delete('tableName', [])
        .catch(function(err) {
          expect(err).to.be.equal('conditions must be a key value object!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil delete should throw an error if conditions is an empty object', function(done) {
    mysqlUtil.delete('tableName', {})
        .catch(function(err) {
          expect(err).to.be.equal('conditions must not be an empty object!');
        })
        .finally(function() {
          done();
        });
  });

  it('mysqlUtil delete should returns an object', function(done) {
    mysqlUtil.delete('system_settings', {key_code:'mysqlUtil', type: 'name'})
        .then(function(res) {
          expect(res).to.be.instanceOf(Object);
        })
        .catch(function(err) {
          console.error(err);
        })
        .finally(function() {
          done();
        });
  });

});
