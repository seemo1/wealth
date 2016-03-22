/**
 * Created by CCMa on 4/22/15.
 * Modified by Micah.Peng on 05/29/15.
 *
 * lab test/commonlib-test/cassModel-test.js -e localcass -m 0
 * export NODE_ENV=localcass,
 * check config/localcass.json for local cassandra server
 */
process.on('uncaughtException', function(err) {
  server.log('error', err);
  logger.error(err);
});

var Code = require('code');
var Lab = require('lab');

var lab = exports.lab = Lab.script();
var it = lab.it;
var before = lab.before;
var describe = lab.describe;
var expect = Code.expect;
var lodash = require('lodash');

//need to create keyspace fdtsocial because /utils/cassandra-client.js will use it first.
var cassModel = require('../../commonlib/cassandra-common');

var testKeyspace = 'lab_test';

describe('cassModel-updateCountColumns', function() {

  before(function(done) {
    var command = 'create keyspace if not exists ' + testKeyspace + ' WITH replication = {\'class\': \'SimpleStrategy\', \'replication_factor\' : 3};';
    cassModel.execute(command, function(res) {
      expect(res.success).to.equal(true);
      console.log('create keyspace', res);

      cassModel.useKeyspace(testKeyspace, function(res) {
        console.log('use keyspace', res);
        expect(res.success).to.equal(true);
        done();
      });
    });
  });

  //------------ create procedures
  it('use keyspace', function(done) {
    cassModel.useKeyspace(testKeyspace, function(res) {
      console.log('use keyspace', res);
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('drop table symbol_vote_user', function(done) {
    cassModel.execute('DROP TABLE IF EXISTS symbol_vote_user', function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('drop table symbol_vote_count', function(done) {
    cassModel.execute('DROP TABLE IF EXISTS symbol_vote_count', function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('create table symbol_vote_user', function(done) {
    var command = 'CREATE TABLE symbol_vote_user (' +
                       'symbol text,' +
                       'user_id text,' +
                       'vote text,' +
                       'PRIMARY KEY (symbol, user_id)' +
                   ')  WITH CLUSTERING ORDER BY (user_id DESC);';

    cassModel.execute(command, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('create table symbol_vote_count', function(done) {
    var command = 'CREATE TABLE symbol_vote_count (' +
                       'symbol text,' +
                       'bearish counter,' +
                       'bullish counter,' +
                       'PRIMARY KEY (symbol));';

    cassModel.execute(command, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('.updateCountColumns: update symbol_vote_count [1,0]', function(done) {
    var table = 'symbol_vote_count';
    var counterColumns = ['bearish', 'bullish'];
    var counterValues = [1, 0];
    var whereColumns = ['symbol'];
    var whereValues = ['EURUSD.FX'];

    cassModel.updateCountColumns(table, counterColumns, counterValues, whereColumns, whereValues, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('.updateCountColumns: update symbol_vote_count [0,1]', function(done) {
    var table = 'symbol_vote_count';
    var counterColumns = ['bearish', 'bullish'];
    var counterValues = [0, 1];
    var whereColumns = ['symbol'];
    var whereValues = ['EURUSD.FX'];

    cassModel.updateCountColumns(table, counterColumns, counterValues, whereColumns, whereValues, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('.updateCountColumns: update symbol_vote_count [3,3]', function(done) {
    var table = 'symbol_vote_count';
    var counterColumns = ['bearish', 'bullish'];
    var counterValues = [3, 3];
    var whereColumns = ['symbol'];
    var whereValues = ['EURUSD.FX'];

    cassModel.updateCountColumns(table, counterColumns, counterValues, whereColumns, whereValues, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('.updateCountColumns: update symbol_vote_count [-1,1]', function(done) {
    var table = 'symbol_vote_count';
    var counterColumns = ['bearish', 'bullish'];
    var counterValues = [-1, 1];
    var whereColumns = ['symbol'];
    var whereValues = ['EURUSD.FX'];

    cassModel.updateCountColumns(table, counterColumns, counterValues, whereColumns, whereValues, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('.updateCountColumns: update symbol_vote_count [1,-1]', function(done) {
    var table = 'symbol_vote_count';
    var counterColumns = ['bearish', 'bullish'];
    var counterValues = [1, -1];
    var whereColumns = ['symbol'];
    var whereValues = ['EURUSD.FX'];

    cassModel.updateCountColumns(table, counterColumns, counterValues, whereColumns, whereValues, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('.updateCountColumns: update symbol_vote_count [-1,-1]', function(done) {
    var table = 'symbol_vote_count';
    var counterColumns = ['bearish', 'bullish'];
    var counterValues = [-1, -1];
    var whereColumns = ['symbol'];
    var whereValues = ['EURUSD.FX'];

    cassModel.updateCountColumns(table, counterColumns, counterValues, whereColumns, whereValues, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('.insert: insert symbol_vote_user', function(done) {
    var table = 'symbol_vote_user';
    var columns = ['symbol', 'user_id', 'vote'];
    var values = ['EURUSD.FX', 'frank444', '2'];

    cassModel.insert(table, columns, values, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('select', function(done) {
    var fields =  ['vote'];
    var columns =  ['symbol', 'user_id'];
    var valules = ['EURUSD.FX', 'frank444'];
    cassModel.select('symbol_vote_user', fields, columns, valules, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('update', function(done) {
    var whereColumns =  ['symbol', 'user_id'];
    var whereValues = ['EURUSD.FX', 'frank444'];
    var setColumns = ['vote'];
    var setValues = ['1'];

    cassModel.update('symbol_vote_user', setColumns, setValues, whereColumns, whereValues, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

});

describe('cassModel-all', function() {
  before(function(done) {
    var command = 'create keyspace if not exists ' + testKeyspace + ' WITH replication = {\'class\': \'SimpleStrategy\', \'replication_factor\' : 3};';
    cassModel.execute(command, function(res) {
      expect(res.success).to.equal(true);
      console.log('create keyspace', res);

      cassModel.useKeyspace(testKeyspace, function(res) {
        console.log('use keyspace', res);
        expect(res.success).to.equal(true);
        done();
      });
    });
  });

  it('drop table', function(done) {
    cassModel.execute('drop table if exists users', function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('create table', function(done) {
    var command = 'create table if not exists users ( ' +
        'rowKey int,' +
        'userid text,' +
        'username text,' +
        'age int,' +
        'school text,' +
        'primary key(rowKey, userid)' +
        ')  WITH CLUSTERING ORDER BY (userid DESC);';

    cassModel.execute(command, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('create counter table', function(done) {
    var command = 'create table if not exists counters ( ' +
        'userid text,' +
        'count counter,' +
        'primary key(userid));';

    cassModel.execute(command, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  /* obsolete function, please don't use it */
  /*
     it('update counter', function (done) {
         var columns = ['userid'];
         var values = ['A01'];
         cassModel.updateCountN("counters", true, 5, columns, values, function (res) {
             console.log(res);
             expect(res.success).to.equal(true);
             done();
         });
     });
*/
  it('create index', function(done) {
    var command = 'create index on users (age);';
    cassModel.execute(command, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('insert', function(done) {
    var columns = ['rowkey', 'userid', 'username', 'age', 'school'];
    var values = [1, 'A01', 'a01', 20, 'NTU'];

    cassModel.insert('users', columns, values, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('insertJ', function(done) {
    var json = {rowkey:1, userid:'A14', username:'a14', age:14, school:'NTHU'};
    cassModel.insertJ('users', json, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('update', function(done) {
    var whereColumns = ['rowkey', 'userid'];
    var whereValues = [1, 'A01'];
    var setColumns = ['age'];
    var setValues = [18];

    cassModel.update('users', setColumns, setValues, whereColumns, whereValues, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('updateJ', function(done) {
    var whereJ = { rowkey:1, userid:'A01'};
    var setJ = { age:36, school:'NCCU'};

    cassModel.updateJ('users', setJ, whereJ, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('batch', function(done) {
    var columns = ['rowkey', 'userid', 'username', 'age', 'school'];
    var values = [1, 'A15', 'a15', 35, 'NCKU'];
    var query1 = cassModel.batchInsert('users', columns, values);

    var whereColumns = ['rowkey', 'userid'];
    var whereValues = [1, 'A15'];
    var setColumns = ['age'];
    var setValues = [99];
    var query2 = cassModel.batchUpdate('users', setColumns, setValues, whereColumns, whereValues);

    var query = [query1, query2];

    cassModel.batch(query, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('select', function(done) {
    var fields = ['userid', 'age', 'school'];
    var columns = ['rowkey', 'userid'];
    var valules = [1, 'A01'];
    cassModel.select('users', fields, columns, valules, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('page select', function(done) {
    var rowCount = 2;
    var pageState;
    var columns = ['rowkey', 'userid'];
    var values = [1, 'A02'];
    var cons = [cassModel.Condition.EQ, cassModel.Condition.GE];

    cassModel.pageSelectA(rowCount, null, 'users', [], columns, cons, values, function(res) {
      if (res.success) {
        if (res.result.next) {
          cassModel.pageSelectA(rowCount, res.result.pageState, 'users', [], columns, cons, values, function(res) {
            expect(res.success).to.equal(true);
            done();
          });
        }        else {
          expect(res.success).to.equal(true);
          done();
        }
      }      else {
        expect(res.success).to.equal(true);
        done();
      }
    });
  });

  it('delete', function(done) {
    var columns = ['rowkey', 'userid'];
    var values = [1, 'A01'];
    cassModel.delete('users', columns, values, function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });

  it('truncate', function(done) {
    cassModel.truncate('users', function(res) {
      expect(res.success).to.equal(true);
      done();
    });
  });
});

/*
    it('clear all key', function (done) {
        redisModel.clear(function() {
            expect(true).to.equal(true);
            done();
        });
    });

    it('get by key', function (done) {
        redisModel.getByKey("users", ['rowkey', 'userid'], [1, 'A01'], function(res) {
            expect(res == null ? false : true).to.equal(true);
            done();
        });
    });
*/

