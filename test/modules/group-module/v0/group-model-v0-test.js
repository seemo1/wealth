'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var Wreck = require('wreck');

var rfr = require('rfr');
var groupModel = rfr('/modules/group-module/v0/group-model-v0');
var cassModel = rfr('/commonlib/cassandra-common');

var sqlGetGroup = 'SELECT group_id from group WHERE group_id = ?';

describe('Group model test', function() {
  // this time test groupID
  var testGroupID = '';
  var testCreateUserID = 'testID';

  it('createGroup', function(done) {
    //do something
    var createRequest =
        {
          data: {
            name: 'testGName',
            description: 'testDescrip',
            userid: testCreateUserID,
            type: 'school',
          },
        };
    groupModel.createGroup(createRequest, function(groupid, lastUpdateTime, result) {
      //  search for update groupID
      testGroupID = groupid;
      expect(result.err.success).to.equal(true);
      cassModel.executeWithParam(sqlGetGroup, [groupid], function(res) {
        expect(res.err.success).to.equal(true);
        testGroupID = groupid;
        var groupArray = [groupid];
        var iptArray = [res.result.rows[0].group_id.toString()];
        expect(JSON.stringify(groupArray)).to.equal(JSON.stringify(iptArray));
        done();
      });
    });
  });

  it('deleteGroup', function(done) {
    var deleteRequest =
        {
          data: {
            group_id: testGroupID,
          },
        };

    groupModel.deleteGroup(deleteRequest, function(result) {
      expect(result.err.success).to.equal(true);
      cassModel.executeWithParam(sqlGetGroup, [testGroupID], function(res) {
        expect(res.err.success).to.equal(true);
        expect(res.result.rows.length).to.equal(0);
        done();
      });

    });

  });

  //    it('getUserGroups', function (done) {
  //      //do something
  //      var getUserGroupsRequest  =
  //      {
  //        'data':
  //        {
  //            'target_userid' : 'testID'
  //        }
  //      };
  //      groupModel.getUserGroups(getUserGroupsRequest, function (result) {
  //        //  search for update groupID
  //        cassModel.executeWithParam(sqlGetGroup, [groupid], function (res) {
  //            expect(result.err.success).to.equal(true);
  //            var groupArray = [groupid];
  //            var iptArray = [res.result.rows[0].group_id.toString()];
  //            expect(JSON.stringify(groupArray)).to.equal(JSON.stringify(iptArray));
  //            done();
  //        });
  //      });
  //    });
});
