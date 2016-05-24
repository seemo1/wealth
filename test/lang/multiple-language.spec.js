'use strict';

const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;

describe('Multi Language Key 值比對', function() {
  before(function() {
    this.cn = require('../../lang/cn.json');
    this.en = require('../../lang/en.json');
    this.tw = require('../../lang/tw.json');
    this.cnProperty = _.keys(this.cn);
    this.enProperty = _.keys(this.en);
    this.twProperty = _.keys(this.tw);
  });

  it('檢查EN Key是否比其它二個少',function() {
    let twWithEn = _.difference(this.twProperty,this.enProperty);
    let cnWithEn = _.difference(this.cnProperty,this.enProperty);
    expect(twWithEn).to.have.lengthOf(0);
    expect(cnWithEn).to.have.lengthOf(0);
  });

  it('檢查CN Key是否比其它二個少',function() {
    let twWithCn = _.difference(this.twProperty,this.cnProperty);
    let enWithCn = _.difference(this.enProperty,this.cnProperty);
    expect(twWithCn).to.have.lengthOf(0);
    expect(enWithCn).to.have.lengthOf(0);
  });

  it('檢查TN Key是否比其它二個少',function() {
    let enWithtw = _.difference(this.enProperty,this.twProperty);
    let cnWithtw = _.difference(this.cnProperty,this.twProperty);
    expect(enWithtw).to.have.lengthOf(0);
    expect(cnWithtw).to.have.lengthOf(0);
  });
});