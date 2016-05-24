'use strict';

const Config = require('config');
const Test = require('mocha').Test;
const SettingsCommon = require('../../commonlib/settings-common');
const MySqlCommon = require('../../commonlib/mysql-common');
const expect = require('chai').expect;

global.MySqlConn = {};
global.SystemSettings = {};

describe('Settings CommonLib.',function() {
  before(function() {
    let mysqlOption = Config.get('MySQL');
    global.MySqlConn = new MySqlCommon(mysqlOption);
    global.SystemSettings = new SettingsCommon();
    global.MySqlConn.initial();
  });


  it('初始化測試',function() {
      return global.SystemSettings.initial();
    });

  it('取全部設定值', function() {
      return global.SystemSettings.getAll();
    });

  it('取單筆設定值', function() {
      expect(global.SystemSettings.get('admin','email')).not.null;
      expect(global.SystemSettings.get('admin','password')).not.null;
    });


});