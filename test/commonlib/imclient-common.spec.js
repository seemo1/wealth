'use strict';
const Config = require('config');
const IMClientCommon = require('../../commonlib/imclient-common');
const expect = require('chai').expect;

describe('IMClient CommonLib.',function() {
  it('建立IM帳號',function(done) {
      IMClientCommon.createAccount('seemo','peter',null,null,function(res) {
          if (res.success) {
            expect(res.success).to.be.true;
          } else {
            expect(res.result.code).to.equal(414);
          }
          done();
        });
    });
  it('刷新 token',function(done) {
      IMClientCommon.refreshToken('seemo',function(res) {
        expect(res.success).to.be.true;
        done();
      })
    });
});