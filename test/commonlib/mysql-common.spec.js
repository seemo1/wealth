  'use strict';
const Config = require('config');
const mocha = require('mocha');
const Context = mocha.Context
const Suite = mocha.Suite
const Test = mocha.Test;
const MySqlCommon = require('../../commonlib/mysql-common');
const expect = require('chai').expect;

let MySqlConn = {};

describe('MySQL CommonLib.',function() {

  before(function() {
      let mysqlOption = Config.get('MySQL');

      MySqlConn = new MySqlCommon(mysqlOption);
    });

  describe('功能測試',function() {
      it('初始化',function() {
        return MySqlConn.initial();
      });

      it('連線', function() {
        return MySqlConn.shutdown();
      });

      it('斷開重連', function() {
        return MySqlConn.restart();
      });
    });

  describe('查詢測試',function() {
      it('query 單筆查詢',function() {
        return MySqlConn.query('test case', 'select :id,:name,:qq',{id: 'id',name: 'name',qq: 'qq'})
            .then(function(res) {
              return new Promise(function(resolve,reject) {
                if (res) {
                  expect(res).is.length(1);
                  expect(res[0]).have.property('id');
                  expect(res[0]).have.property('name');
                  expect(res[0]).have.property('qq');
                  resolve();
                }else {
                  reject();
                }
              });
            })
      });

      it('Mulitple 多筆查詢',function() {
        let scripts = [];
        scripts.push({sql: "SELECT :name as name ", params:{name: 'AAAAAA'}});
        scripts.push({sql: "SELECT :name as name ", params:{name: 'bbbbbb'}});
        scripts.push({sql: "SELECT :name as name ", params:{name: 'CCCCCC'}});
        scripts.push({sql: "SELECT :name as name ", params:{name: 'dddddd'}});

        return MySqlConn.multipleQuery('BDD', scripts)
          .then(function(res) {
            console.log(res[0]);
            expect(res).to.have.lengthOf(4);
            expect(res[0][0]).to.have.property('name','AAAAAA');
            expect(res[1][0]).to.have.property('name','bbbbbb');
            expect(res[2][0]).to.have.property('name','CCCCCC');
            expect(res[3][0]).to.have.property('name','dddddd');
          })
      });
    })
});