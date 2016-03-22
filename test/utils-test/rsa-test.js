'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var Config = require('config');
var rsaUtil = require('../../utils/rsa-util');

describe('RSA Util test', function() {

  it('decrypt using development private key', function(done) {
    var pkey = Config.get('PrivateKey');
    var encryptedString = 'nDSab/0MFq2eZ97tbdaXE7MsH5fY8yB2q3a8GMlvWEmAWDK/pCG7v+NpY+PjEADDcYJ5tLpd48fwKG8UwR3TgWEUMkevWmAT7042tnvGiy6hpDeuWkt4gzUUnTt16Zs7iwMVc2hqaJE4PON7kXNPk4Wa8uyt7/V3pt5jph133GDq1qvBEz1SCZkXdRscc0l9ZqBOMyp3enXuECj6c5t62QPfdGPv8/hcREdzWTVbtNnZIsmyJd4RdLaAA7a37ZHYdnu66NNRI9Me8ZAEIJbOk+crBU/Tn9fUU6oCilCnMRIqb9k23hZlCHBG/xATZktfRixSb/NDI1gsPNamVVpMow==';
    var plainString = '{"language": "EN", "country": "TW", "Id": "jamesbond", "parse": "-", "phone": "-", "exp": 1434422884000, "email": "-"}';
    var decryptedString = rsaUtil.decrypt(pkey, encryptedString);
    expect(decryptedString).to.equal(plainString);
    done();
  });

  //TODO: need to test using production, testing, and uat private key

});
