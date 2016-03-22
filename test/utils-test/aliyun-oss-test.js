'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var aliyunOss = require('../../commonlib/storage/aliyun-oss');
var storageAgent = require('../../commonlib/storage-agent-common');
var key = '';
var key2 = 'mm5';
var format = require('string-format');

this.injectData = function(message, data) {
  logger.info(message, 'injectData', message, data);
  return message.replace(/({\d})/g, function(j) {
    return data[j.replace(/{/, '').replace(/}/, '')];
  });
};

describe('Aliyun Oss Test', function() {
  it('storageAgent test', function(done) {
    /*
            storageAgent.put(new Buffer('aaa'), function (err, url) {
                storageAgent.delete(url, function (ok) {
                    done();
                });

            });
     */

    //        var str = '<b>{0}</b>在<b>{1}</b>發佈了一則文章: <b>{2}</b> !';
    var str = '{0}在{1}發佈了一則文章: {2} !';
    var data = ['11', '22', '33'];

    var aa = format(str, '11', '22', '33');
    var bb = str.replace(/({\d})/g, function(j) {
      return data[j.replace(/{/, '').replace(/}/, '')];
    });

    console.log('aa:' + aa + '//');
    console.log('bb:' + bb + '//');
  });

  /*
      before(function (done) {
          key = new Cassandra.types.Uuid.random();
          done();
      });

      it('Put string file', {timeout: 5000}, function (done) {
          aliyunOss.put(key, new Buffer('ForexMasterTestAliyun', 'utf8'), 'string', function (err, result) {
              key = result.key;
              expect(result.key).to.exist();
              done();
          });
      });

      it('Delete', function (done) {
          aliyunOss.delete(key, function (err, result) {
              expect(err).to.be.null();
              done();
          });
      });
*/
});
