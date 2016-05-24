'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('Canned Message API測試', function() {
  let _seqno = '';
  before(function(done) {
    this._server = require('../../../server');
    done()
  });

  describe('文字素材清單查詢測試',function() {
    it('文字素材清單查詢', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      let params = {};
      this._server.inject({
        method: 'get',
        url: '/api/canned/v0/cannedMessage',
        headers: headers,
        payload: params,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode');
        if (response.statusCode === 200) {
          expect(response.result.data).is.a('array');

          expect(response).to.have.deep.property('result.data[0].seqno').is.a('number');
          expect(response).to.have.deep.property('result.data[0].message').is.a('string');
          expect(response).to.have.deep.property('result.data[0].publish_time').is.a('number');
          expect(response).to.have.deep.property('result.data[0].update_time').is.a('number');
        }else {
          expect(response).to.have.property('statusCode',204);
        }
        done();
      });
    });
  })

  describe('新增文字素材測試', function() {
    it('新增文字素材', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      let params = {message: 'this is test message.'};
      this._server.inject({
        method: 'post',
        url: '/api/canned/v0/cannedMessage',
        headers: headers,
        payload: params,
      }, function(res) {
        let response = JSON.parse(res.payload);
        _seqno = response.result.seqno;
        expect(response).to.have.property('statusCode', 200);
        if (response.result.length > 0) {
          expect(response).to.have.deep.property('result[0].seqno').is.a('number');
          expect(response).to.have.deep.property('result[0].message').is.a('string');
          expect(response).to.have.deep.property('result[0].publish_time').is.a('number');
          expect(response).to.have.deep.property('result[0].update_time').is.a('number');
        }
        done();
      });
    });

    it('驗証文字素材新增', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};

      this._server.inject({
        method: 'get',
        url: '/api/canned/v0/cannedMessage/' + _seqno,
        headers: headers,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 200);

        if (response.result.length > 0) {
          expect(response).to.have.deep.property('result[0].seqno').is.a('number');
          expect(response).to.have.deep.property('result[0].message','this is test message.').is.a('string');
          expect(response).to.have.deep.property('result[0].publish_time').is.a('number');
          expect(response).to.have.deep.property('result[0].update_time').is.a('number');
        }
        done();
      });
    });
  })

  describe('更新文字素材測試', function() {
    it('更新文字素材', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      let params = {message: 'update Message.'};
      this._server.inject({
        method: 'put',
        url: '/api/canned/v0/cannedMessage/' + _seqno,
        headers: headers,
        payload: params,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 200);
        done();
      });
    });

    it('驗証更新文字素材', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      this._server.inject({
        method: 'get',
        url: '/api/canned/v0/cannedMessage/' + _seqno,
        headers: headers,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 200);

        if (response.result.length > 0) {
          expect(response).to.have.deep.property('result[0].seqno').is.a('number');
          expect(response).to.have.deep.property('result[0].message','update Message.').is.a('string');
          expect(response).to.have.deep.property('result[0].publish_time').is.a('number');
          expect(response).to.have.deep.property('result[0].update_time').is.a('number');
        }
        done();
      });
    });
  })

  describe('刪除文字素材測試', function() {
    it('刪除文字素材', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      let params = {seqno: _seqno};
      this._server.inject({
        method: 'delete',
        url: '/api/canned/v0/cannedMessage/' + _seqno,
        headers: headers,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 200);
        expect(response).to.have.deep.property('result.seqno', _seqno);
        done();
      });
    });

    it('驗証文字素材刪除', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      this._server.inject({
        method: 'get',
        url: '/api/canned/v0/cannedMessage/' + _seqno,
        headers: headers,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 204);
        done();
      });
    });
  })
});