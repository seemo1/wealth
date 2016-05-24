'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('IM modules', function() {
  describe('IM API 測試', function() {
    before(function(done) {
      this.server = require('../../../server');
      done();
    });

    it('查詢IM 帳號', function(done) {
      let headers = {'x-token': 'tw', 'x-language': 'tw', 'x-country': 'tw'};
      let query = {user_id: 'seemo'};
      this.server.inject({
        method: 'get',
        url: '/api/im/v0/imAccount?user_id=seemo',
        headers: headers,
      }, function(res) {
        let response = JSON.parse(res.payload);
        expect(response).to.have.property('statusCode', 200);
        expect(response.result).to.have.all.keys(['yun_uid', 'token']);
        done();
      });
    });
  });

  describe('驗証雲信有帳號，DB沒有的情境 ',function() {
    before(function(done) {
      let ImModel = require('../../../models/im-model');
      let MySqlCommon = require('../../../commonlib/mysql-common');
      let Config = require('config');
      let mysqlOption = Config.get('MySQL');

      this.MySqlConn = new MySqlCommon(mysqlOption);
      this.imModel = new ImModel();
      this.MySqlConn.initial()
          .then(function() {
            done();
          }
      );
    });

    it('刪資資料庫的IM記錄.',function(done) {
      let sql = "delete from social_im_user where user_id='seemo'";
      this.MySqlConn.query('BDD',sql)
          .then(function() {
            done();
          })
          .catch(function(err) {
            done(err);
          });
    })

    it('重新註冊驗証',function(done) {
      let that = this;
      this.imModel.reflashImToken('seemo','seemo')
          .then(function() {
            return that.imModel.getUserImInfo('seemo');
          })
          .then(function(res) {
            console.log('result===',res);
            expect(res[0]).to.have.property('user_id','seemo');
            done();
          });
    });
  });
});