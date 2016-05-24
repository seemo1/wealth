'use strict';

const chai = require('chai');
const expect = chai.expect;
const Fs = require('fs');
const FormData = require('form-data');
const streamToPromise = require('stream-to-promise');

describe('Canned Image API 測試', function() {
  let _seqno = '';
  before(function(done) {
    this._server = require('../../../server');
    done()
  });

  describe('圖片素才清單查詢測試',function() {
    it('取得圖片素才清單', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      let params = {};
      this._server.inject({
        method: 'get',
        url: '/api/canned/v0/cannedImage',
        headers: headers,
        payload: params,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode');
        if (response.statusCode === 200) {
          expect(response.result.data).is.a('array');

          expect(response).to.have.deep.property('result.data[0].seqno').is.a('number');
          expect(response).to.have.deep.property('result.data[0].serving_url').is.a('string');
          expect(response).to.have.deep.property('result.data[0].comment').is.a('string');
          expect(response).to.have.deep.property('result.data[0].publish_time').is.a('number');
          expect(response).to.have.deep.property('result.data[0].update_time').is.a('number');
        }else {
          expect(response).to.have.property('statusCode',204);
        }
        done();
      });
    });
  })

  describe('新增圖片素材測試', function() {
    it('增加新圖片素材', function(done) {
      let that = this;
      let form = new FormData();

      form.append('comment', 'textmsg');
      form.append('image', Fs.createReadStream(__dirname + '/canned.png'));
      let headers = form.getHeaders({'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'});

      streamToPromise(form)
        .then(function(payload) {
          that._server.inject({
            url: '/api/canned/v0/cannedImage',
            method: 'post',
            payload: payload,
            headers: headers,
          }, function(res) {
            let response = JSON.parse(res.payload);
            _seqno = response.result.seqno;
            expect(response).to.have.property('statusCode', 200);
            if (response.result.length > 0) {
              expect(response).to.have.deep.property('result.seqno').is.a('number');
              expect(response).to.have.deep.property('result.serving_url').is.a('string');
              expect(response).to.have.deep.property('result.comment').is.a('string');
              expect(response).to.have.deep.property('result.publish_time').is.a('number');
              expect(response).to.have.deep.property('result.update_time').is.a('number');
            }
            done();
          });
        });
    });

    it('驗証圖片素材是否建立', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};

      this._server.inject({
        method: 'get',
        url: '/api/canned/v0/cannedImage/' + _seqno,
        headers: headers,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 200);

        if (response.result.length > 0) {
          expect(response).to.have.deep.property('result[0].seqno').is.a('number');
          expect(response).to.have.deep.property('result[0].serving_url','this is test serving_url.').is.a('string');
          expect(response).to.have.deep.property('result[0].comment','this is comment.').is.a('string');
          expect(response).to.have.deep.property('result[0].publish_time').is.a('number');
          expect(response).to.have.deep.property('result[0].update_time').is.a('number');
        }
        done();
      });
    });
  })

  describe('更新圖片素材測試', function() {
    describe('更新圖片與備註測試', function() {
      let _newComments = '';
      let _newServingUrl = '';
      it('更新圖片與備註', function(done) {
        let that = this;
        let form = new FormData();

        form.append('comment', 'update with image file');
        form.append('image', Fs.createReadStream(__dirname + '/canned.png'));
        let headers = form.getHeaders({'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'});


        streamToPromise(form)
          .then(function(payload) {
            that._server.inject({
              url: '/api/canned/v0/cannedImage/' + _seqno,
              method: 'put',
              payload: payload,
              headers: headers,
            }, function(res) {
              let response = JSON.parse(res.payload);
              _seqno = response.result.seqno;
              expect(response).to.have.property('statusCode', 200);
              if (response.result) {
                expect(response).to.have.deep.property('result.seqno').is.a('number');
                expect(response).to.have.deep.property('result.serving_url').is.a('string');
                expect(response).to.have.deep.property('result.comment', 'update with image file').is.a('string');
                expect(response).to.have.deep.property('result.publish_time').is.a('number');
                expect(response).to.have.deep.property('result.update_time').is.a('number');
                _newServingUrl = response.result.serving_url;
                _newComments = response.result.comment;
              }
              done();
            });
          });
      });

      it('驗証更新作業是否成功', function(done) {
        let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
        this._server.inject({
          method: 'get',
          url: '/api/canned/v0/cannedImage/' + _seqno,
          headers: headers,
        }, function(res) {
          let response = JSON.parse(res.payload);
          expect(response).to.have.property('statusCode', 200);

          if (response.result) {
            expect(response).to.have.deep.property('result.seqno').is.a('number');
            expect(response).to.have.deep.property('result.serving_url', _newServingUrl).is.a('string');
            expect(response).to.have.deep.property('result.comment', _newComments).is.a('string');
            expect(response).to.have.deep.property('result.publish_time').is.a('number');
            expect(response).to.have.deep.property('result.update_time').is.a('number');
          }
          done();
        });
      });
    });

    describe('僅更新備註測試', function() {
      let _newComments = '';
      it('僅更新備註', function(done) {
        let that = this;
        let form = new FormData();

        form.append('comment', 'update without image file');
        let headers = form.getHeaders({'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'});

        streamToPromise(form)
          .then(function(payload) {
            that._server.inject({
              url: '/api/canned/v0/cannedImage/' + _seqno,
              method: 'put',
              payload: payload,
              headers: headers,
            }, function(res) {
              let response = JSON.parse(res.payload);
              _seqno = response.result.seqno;
              expect(response).to.have.property('statusCode', 200);
              if (response.result) {
                expect(response).to.have.deep.property('result.seqno').is.a('number');
                expect(response).to.have.deep.property('result.serving_url').is.a('string');
                expect(response).to.have.deep.property('result.comment', 'update without image file').is.a('string');
                expect(response).to.have.deep.property('result.publish_time').is.a('number');
                expect(response).to.have.deep.property('result.update_time').is.a('number');
                _newComments = response.result.comment;
              }
              done();
            });
          });
      });

      it('驗証更新作業是否成功', function(done) {
        let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
        this._server.inject({
          method: 'get',
          url: '/api/canned/v0/cannedImage/' + _seqno,
          headers: headers,
        }, function(res) {
          let response = JSON.parse(res.payload);
          expect(response).to.have.property('statusCode', 200);

          if (response.result) {
            expect(response).to.have.deep.property('result.seqno').is.a('number');
            expect(response).to.have.deep.property('result.serving_url').is.a('string');
            expect(response).to.have.deep.property('result.comment', _newComments).is.a('string');
            expect(response).to.have.deep.property('result.publish_time').is.a('number');
            expect(response).to.have.deep.property('result.update_time').is.a('number');
          }
          done();
        });
      });
    });

    describe('更新圖片及備註空值測試', function() {
      let _newComments = '';
      let _newServingUrl = '';
      it('更新圖片及備註空值', function(done) {
        _newComments = '';
        let that = this;
        let form = new FormData();
        form.append('image', Fs.createReadStream(__dirname + '/canned.png'));
        let headers = form.getHeaders({'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'});
        streamToPromise(form)
          .then(function(payload) {
            that._server.inject({
              url: '/api/canned/v0/cannedImage/' + _seqno,
              method: 'put',
              payload: payload,
              headers: headers,
            }, function(res) {
              let response = JSON.parse(res.payload);
              _seqno = response.result.seqno;
              expect(response).to.have.property('statusCode', 200);
              if (response.result) {
                expect(response).to.have.deep.property('result.seqno').is.a('number');
                expect(response).to.have.deep.property('result.serving_url').is.a('string');
                expect(response).to.have.deep.property('result.comment', '').is.a('string');
                expect(response).to.have.deep.property('result.publish_time').is.a('number');
                expect(response).to.have.deep.property('result.update_time').is.a('number');
                _newComments = response.result.comment;
                _newServingUrl = response.result.serving_url;
              }
              done();
            });
          });
      });

      it('驗証更新作業是否成功', function(done) {
        let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
        this._server.inject({
          method: 'get',
          url: '/api/canned/v0/cannedImage/' + _seqno,
          headers: headers,
        }, function(res) {
          let response = JSON.parse(res.payload);
          expect(response).to.have.property('statusCode', 200);

          if (response.result) {
            expect(response).to.have.deep.property('result.seqno').is.a('number');
            expect(response).to.have.deep.property('result.serving_url', _newServingUrl).is.a('string');
            expect(response).to.have.deep.property('result.comment', _newComments).is.a('string');
            expect(response).to.have.deep.property('result.publish_time').is.a('number');
            expect(response).to.have.deep.property('result.update_time').is.a('number');
          }
          done();
        });
      });
    });
  })

  describe('刪除圖片素材測試', function() {
    it('刪除圖片素材', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      let params = {seqno: _seqno};
      this._server.inject({
        method: 'delete',
        url: '/api/canned/v0/cannedImage/' + _seqno,
        headers: headers,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 200);
        expect(response).to.have.deep.property('result.seqno',_seqno);
        done();
      });
    });

    it('驗証圖片素材是否刪除', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      this._server.inject({
        method: 'get',
        url: '/api/canned/v0/cannedImage/' + _seqno,
        headers: headers,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 204);
        done();
      });
    });
  })
});