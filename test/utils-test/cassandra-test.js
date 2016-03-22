/**
 * Created by CCMa on 4/22/15.
 */

var Code = require('code');
var Lab = require('lab');

var lab = exports.lab = Lab.script();
var it = lab.it;
var before = lab.before;
var describe = lab.describe;
var expect = Code.expect;
var lodash = require('lodash');
var rfr = require('rfr');

var redisModel = rfr('/commonlib/redis-common');
var cassModel = rfr('/commonlib/cassandra-common');
var api = rfr('/config/define/api');

describe('cass-test', function() {
  it('api/table define', function(done) {
    var json = { user_id: '11', background_url: 22, num_trade:'2', phone:'2222', publish_time:'aaaa', ranking:345, ranking_per:'123', aa: 1, bb: 2 };

    console.log(json.user_id.trim());

    //var ret = api.convert("getUserProfile", json);
    done();
  });
  /*
      before(function (done) {
          var command = "create keyspace if not exists fdt WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};";
          cassModel.execute(command, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('use keyspace', function (done) {
          cassModel.useKeyspace("fdt", function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('drop table', function (done) {
          cassModel.execute("drop table if exists users", function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('create table', function (done) {
          var command = "create table if not exists users ( " +
              "rowKey int," +
              "userid text," +
              "username text," +
              "age int," +
              "school text," +
              "primary key(rowKey, userid)" +
              ")  WITH CLUSTERING ORDER BY (userid DESC);"

          cassModel.execute(command, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('create counter table', function (done) {
          var command = "create table if not exists counters ( " +
              "userid text," +
              "count counter," +
              "primary key(userid));"

          cassModel.execute(command, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('update counter', function (done) {
          var columns = ['userid'];
          var values = ['A01'];
          cassModel.updateCountN("counters", true, 5, columns, values, function (res) {
              console.log(res);
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('create index', function (done) {
          var command = "create index on users (age);";
          cassModel.execute(command, function(res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('insert', function (done) {
          var columns = ['rowkey', 'userid', 'username', 'age', 'school'];
          var values = [1, 'A01', 'a01', 20, 'NTU'];

          cassModel.insert("users", columns, values, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('insertJ', function (done) {
          var json = {rowkey:1, userid:'A14', username:'a14', age:14, school:'NTHU'};
          cassModel.insertJ("users", json, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('update', function (done) {
          var whereColumns = ['rowkey', 'userid'];
          var whereValues = [1, 'A01'];
          var setColumns = ['age'];
          var setValues = [18];

          cassModel.update("users", setColumns, setValues, whereColumns, whereValues, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('updateJ', function (done) {
          var whereJ = { rowkey:1, userid:'A01'};
          var setJ = { age:36, school:'NCCU'};

          cassModel.updateJ("users", setJ, whereJ, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('batch', function (done) {
          var columns = ['rowkey', 'userid', 'username', 'age', 'school'];
          var values = [1, 'A15', 'a15', 35, 'NCKU'];
          var query1 = cassModel.batchInsert("users", columns, values);

          var whereColumns = ['rowkey', 'userid'];
          var whereValues = [1, 'A15'];
          var setColumns = ['age'];
          var setValues = [99];
          var query2 = cassModel.batchUpdate("users", setColumns, setValues, whereColumns, whereValues);

          var query = [query1, query2];

          cassModel.batch(query, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

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

      it('select', function (done) {
          var fields = ['userid', 'age', 'school'];
          var columns = ['rowkey', 'userid'];
          var valules = [1, 'A01'];
          cassModel.select("users", fields, columns, valules, function(res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });


      it('page select', function (done) {
          var rowCount = 2;
          var pageState;
          var columns = ['rowkey', 'userid'];
          var values = [1, 'A02'];
          var cons = [cassModel.Condition.EQ, cassModel.Condition.GE];

          cassModel.pageSelectA(rowCount, null, "users", [], columns, cons, values, function (res) {
              if (res.err.success) {
                  if (res.result.next) {
                      cassModel.pageSelectA(rowCount, res.result.pageState, "users", [], columns, cons, values, function (res) {
                          expect(res.err.success).to.equal(true);
                          done();
                      });
                  }
                  else {
                      expect(res.err.success).to.equal(true);
                      done();
                  }
              }
              else {
                  expect(res.err.success).to.equal(true);
                  done();
              }
          });
      });

      it('delete', function (done) {
          var columns = ['rowkey', 'userid'];
          var values = [1, 'A01'];
          cassModel.delete("users", columns, values, function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });

      it('truncate', function (done) {
          cassModel.truncate("users", function (res) {
              expect(res.err.success).to.equal(true);
              done();
          });
      });
*/
});

