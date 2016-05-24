'use strict';

const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
const CommonUtil = require('../../commonlib/common-util');
const SettingsCommon = require('../../commonlib/settings-common');
const MySqlCommon = require('../../commonlib/mysql-common');
const Config = require('config');

describe('CommonUtil CommonLib', function() {
  before(()=> {
    global.SystemSettings = new SettingsCommon();
    let mysqlOption = Config.get('MySQL');

    global.MySqlConn = new MySqlCommon(mysqlOption);
    return global.MySqlConn.initial()
    .then(global.SystemSettings.initial.bind(SystemSettings));
  });

  it('mail 寄送測試', function(done) {
    this.timeout(50000)
    let SendErrorMailFlag = SystemSettings.get('Debug','SendErrMail');
    let MailSubject = SystemSettings.get('Mail', 'Subject')
    expect(SendErrorMailFlag).to.not.empty;
    expect(MailSubject).to.not.empty;
    return CommonUtil.sendMail('this is deploy unit test mail. ')
      .then(()=> {
        done()
      });
  });
});