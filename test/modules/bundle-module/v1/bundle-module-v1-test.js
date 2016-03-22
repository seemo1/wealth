'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

//INFO: lib for http call
//REF: https://github.com/hapijs/wreck
var Wreck = require('wreck');
var bundleModel = require('../../../../modules/bundle-module/v1/bundle-model-v1');
var Base64 = require('js-base64').Base64;

describe('Bundle Model v1', function() {

  var req = {product:'ForexMaster', platform:'Android', appid:'CN'};

  it('appid add', function(done) {
    bundleModel.appid.add(req, function(err) {
      if (err == null) {
        done();
      }
    });
  });

  it('appid get', function(done) {
    bundleModel.appid.get(req, function(err, res) {
      if (err == null) {
        Code.expect(res[0]).to.equal('CN');
        done();
      }
    });
  });

  it('appid del', function(done) {
    bundleModel.appid.del(req, function(err) {
      if (err == null) {
        done();
      }
    });
  });

  // ----------------------------------------
  //

  it('version add', function(done) {
    var req = {product:'ForexMaster', platform:'Android', appid:'CN', version:'4.0', is_version_check:'Y'};
    bundleModel.version.add(req, function(err) {
      console.log(err);
      done();
    });
  });

  it('version get', function(done) {
    var req = {product:'ForexMaster', platform:'Android', language:'EN', environment:'DEV', appid:'CN', version:'4.0'};
    bundleModel.version.get(req, function(res) {
      if (res != null) {
        Code.expect(res.version).to.equal('4.0');
        done();
      }
    });
  });

  it('version getList', function(done) {
    var req = {product:'ForexMaster', platform:'Android', language:'EN'};
    bundleModel.version.getList(req, function(err, res) {
      console.log(res);
      if (err == null) {
        Code.expect(res[0].version).to.equal('4.0');
        done();
      }
    });
  });

  it('version updateCheck', function(done) {
    var req = {product:'ForexMaster', platform:'Android', appid:'MI', is_version_check:'Y', version:'4.0'};
    bundleModel.version.updateCheck(req, function(err, res) {
      if (err == null) {
        //Code.expect(res[0].version).to.equal('4.0');
        console.log('updateCheck');
        console.log(res);
        done();
      }
    });
  });

  it('version getAll', function(done) {
    var req = {product:'ForexMaster', platform:'Android', version:'4.0'};
    bundleModel.version.getAll(req, function(err, res) {
      if (err == null) {
        //Code.expect(res[0].version).to.equal('4.0');
        console.log('getAll');
        console.log(res);
        done();
      }
    });
  });

  it('file updateProduct', function(done) {
    var req = {product:'ForexMaster', environment:'DEV', file_name: 'fileName', file_content: 'productFileContent'};

    bundleModel.file.updateProduct(req, function(err) {
      if (err == null) {
        done();
      }
    });
  });

  it('file getProduct', function(done) {
    var req = {product:'ForexMaster', environment:'DEV'};

    bundleModel.file.getProduct(req, function(res) {
      if (res != null) {
        Code.expect(res.file.toString()).to.equal(Base64.encode('productFileContent'));
        done();
      }
    });
  });

  it('file updateLanguage', function(done) {
    var req = {language:'EN', environment:'DEV', file_name: 'fileName', file_content: 'languageFileContent'};

    bundleModel.file.updateLanguage(req, function(err) {
      if (err == null) {
        done();
      }
    });
  });

  it('file getLanguage', function(done) {
    var req = {language:'EN', environment:'DEV'};

    bundleModel.file.getLanguage(req, function(res) {
      if (res != null) {
        Code.expect(res.file.toString()).to.equal(Base64.encode('languageFileContent'));
        done();
      }
    });
  });

  it('file updateDevice', function(done) {
    var req = {product:'ForexMaster', platform:'Android', language:'EN', environment:'DEV', file_name: 'fileName', file_content: 'deviceFileContent'};

    bundleModel.file.updateDevice(req, function(err) {
      if (err == null) {
        done();
      }
    });
  });

  it('file getDevice', function(done) {
    var req = {product:'ForexMaster', platform:'Android', language:'EN', environment:'DEV'};

    bundleModel.file.getDevice(req, function(res) {
      if (res != null) {
        Code.expect(res.file.toString()).to.equal(Base64.encode('deviceFileContent'));
        done();
      }
    });
  });

  it('file updateVersion', function(done) {
    var req = {product:'ForexMaster', platform:'Android', language:'EN', appid:'CN', version:'4.0', environment:'DEV', file_name: 'fileName', file_content: 'versionFileContent'};

    bundleModel.file.updateVersion(req, function(err) {
      if (err == null) {
        done();
      }
    });
  });

  it('file getVersion', function(done) {
    var req = {product:'ForexMaster', platform:'Android', language:'EN', appid:'CN', version:'4.0'};

    bundleModel.file.getVersion(req, function(res) {
      if (res != null) {
        Code.expect(res.file.toString()).to.equal(Base64.encode('versionFileContent'));
        done();
      }
    });

  });

  // ----------------------------------------
  //

  it('file getBundle', function(done) {

    var request = {headers:[], payload:{}};
    request.headers['x-forwarded-for'] = '74.125.204.94';
    request.payload = {product:'ForexMaster', platform:'Android', language:'EN', environment:'DEV', appid:'CN', version:'4.0', productKey:'2015-08-17 14:27:12'};

    // console.log(request);

    bundleModel.getBundle(request, function(res) {
      if (res != null) {
        // console.log('getBundle: ');
        // console.log(res);

        if (res.SettingFile.productFile != null) {
          Code.expect(res.SettingFile.productFile).to.equal(Base64.encode('productFileContent'));
        }

        if (res.SettingFile.languageFile != null) {
          Code.expect(res.SettingFile.languageFile).to.equal(Base64.encode('languageFileContent'));
        }

        if (res.SettingFile.deviceFile != null) {
          Code.expect(res.SettingFile.deviceFile).to.equal(Base64.encode('deviceFileContent'));
        }

        Code.expect(res.SettingFile.versionFile).to.equal(Base64.encode('versionFileContent'));

        done();
      }
    });
  });

});
