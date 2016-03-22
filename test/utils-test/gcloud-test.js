'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var gcloudUtil = require('../../utils/gcloud-util');

describe('Gcloud Lib Test', function() {

  var dataset = gcloudUtil.datastore.dataset();

  it('Get data from FXMasterSystemSetting using query', {timeout: 3000}, function(done) {
    var query = dataset.createQuery('FXMasterSystemSetting');
    dataset.runQuery(query, function(err, entities, endCursor) {
      expect(entities.length).to.be.at.least(1);
      done();
    });
  });

  it('Get user from FXMasterUser using get method', {timeout: 3000}, function(done) {
    var userId = 'yaurii';
    var key = dataset.key(['FXMasterUser', userId]);
    dataset.get(key, function(err, entity) {
      //in this case user id = username
      expect(entity.data.username).to.equal(userId);
      done();
    });
  });

});
