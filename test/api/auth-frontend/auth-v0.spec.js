'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('auth-frontend API測試', function() {
  before(function(done) {
     this.server = require('../../../server');
     done()
   });
  let _imAccountData = {};
  it('API 登入檢查', function(done) {
    let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
    let params = {user_id: 'seemo'};
    this.server.inject({
      method: 'post',
      url: '/api/auth/v0/login',
      headers: headers,
      payload: params,
    }, function(res) {
      let response = JSON.parse(res.payload);
      expect(response).to.have.property('statusCode', 200);
      expect(response.result).to.have.all.keys(['yun_uid', 'token']);
      _imAccountData = response.result;
      done();
    });
  });

  it('檢查 Token 是否成功刷新',function(done){
    let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
    let params = {user_id: 'seemo'};
    this.server.inject({
      method: 'get',
      url: '/api/im/v0/imAccount?user_id=' + _imAccountData.yun_uid,
      headers: headers,
      payload: params,
    }, function(res) {
      let response = JSON.parse(res.payload);
      expect(response).to.have.property('statusCode', 200);
      expect(response.result).to.have.property('yun_uid', _imAccountData.yun_uid);
      expect(response.result).to.have.property('token', _imAccountData.token);
      done();
    });
  });




});