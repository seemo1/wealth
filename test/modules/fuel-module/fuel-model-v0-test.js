/**
 * version 2015-08-21T16:00+8
 * cd FDTSocialC
 * node_modules/lab/bin/lab test/modules/fuel-module/fuel-model-v0-test.js -m 0 -e node_env_dev -g itName
 * -m 0: timeout
 * -e : NODE_ENV 環境變數設定 check the config/node_env_dev.json for require('config')
 * -g 測試名稱
 * $NODE_ENV=node_env_dev
 * check the process.env["NODE_ENV"] in modules or the -e won't work
 */
'use strict';

//process.env["NODE_ENV"] = "localcass";
var Config = require('config');
var querystring = require('querystring');
var http = require('http');
var httpParameter = {
  host: Config.get('Server.host'),
  port: Config.get('Server.port'),
  method: 'POST',
};
var Lodash = require('lodash');

var Code = require('code');
var expect = Code.expect;

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var it = lab.it;
var before = lab.before;
var describe = lab.describe;

var outfitUtil = require('../../../utils/outfit-util');
var fuelController = require('../../../modules/fuel-module/v0/fuel-controller-v0');
var fuelModel = require('../../../modules/fuel-module/v0/fuel-model-v0');

var loginControllerV0 = require('../../../modules/user-module/v0/login-controller-v0');
var loginControllerV1 = require('../../../modules/user-module/v1/login-controller-v1');

var Promise = require('bluebird');

describe('fuel-model-v0', function() {
  /*
  it('prepareFuelTx8Limit8Acount_postBeenLiked', function (done) {
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              var joParam = {
                  fuel: {
                      action_name: 'postBeenLiked',
                      user_id: 'micahpeng',
                      action_date: (new Date()).toISOString().substr(0,10),
                      area: 'Global',
                      product: 'Forex',
                      //不能加進去fuel如果不是 timesPerPostDay
                      post_id: 'a3f5b3df-dd8e-11e4-9df9-9b89cd41f97a'
                  },
                  joKey2Data : {
                      joFuelAction: fuelModel.fuelAction['postBeenLiked'],
                      action_sum: null,
                      user_fuel: 120
                  },
                  details : {
                  }
              };
              return fuelModel.prepareFuelTx8Limit8Acount(joParam);
          })
          .then(function (result) {
              console.log('prepareFuelTx8Limit8Acount=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('prepareFuelTx8Limit8Acount_post', function (done) {
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              var joParam = {
                  fuel: {
                      action_name: 'post',
                      user_id: 'micahpeng',
                      action_date: (new Date()).toISOString().substr(0,10),
                      area: 'Global',
                      product: 'Forex'
                  },
                  joKey2Data : {
                      joFuelAction: fuelModel.fuelAction['post'],
                      action_sum: null,
                      user_fuel: 120
                  },
                  details : {
                      //不能加進去fuel如果不是 timesPerPostDay
                      post_id: 'a3f5b3df-dd8e-11e4-9df9-9b89cd41f97a'
                  }
              };
              return fuelModel.prepareFuelTx8Limit8Acount(joParam);
          })
          .then(function (result) {
              console.log('prepareFuelTx8Limit8Acount=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('updateFuelLimit_postBeenLiked', function (done) {
      var joParam = {
          fuel: {
              action_name: 'postBeenLiked',
              user_id: 'micahpeng',
              action_date: (new Date()).toISOString().substr(0,10),
              post_id: 'a3f5b3df-dd8e-11e4-9df9-9b89cd41f97a',
              action_sum: 2
          },
      };
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              return fuelModel.updateFuelLimit(joParam);
          })
          .then(function (result) {
              console.log('updateFuelLimit=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('insertFuelLimit_postBeenLiked', function (done) {
      var joParam = {
          fuel: {
              action_name: 'postBeenLiked',
              user_id: 'micahpeng',
              action_date: (new Date()).toISOString().substr(0,10),
              post_id: 'a3f5b3df-dd8e-11e4-9df9-9b89cd41f97a',
              action_sum: 1
          },
      };
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              return fuelModel.insertFuelLimit(joParam);
          })
          .then(function (result) {
              console.log('insertFuelLimit=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('getFuelLimit_postBeenLiked', function (done) {
      var joParam = {
          fuel: {
              action_name: 'postBeenLiked',
              user_id: 'micahpeng',
              action_date: (new Date()).toISOString().substr(0,10),
              post_id: 'a3f5b3df-dd8e-11e4-9df9-9b89cd41f97a'
          },
      };
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              return fuelModel.getFuelLimit(joParam);
          })
          .then(function (result) {
              console.log('getFuelAction=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('updateFuelLimit_post', function (done) {
      var joParam = {
          fuel: {
              action_name: 'post',
              user_id: 'micahpeng',
              action_date: (new Date()).toISOString().substr(0,10),
              action_sum: 1
          },
          details : {
              post_id: 'a3f5b3df-dd8e-11e4-9df9-9b89cd41f97a'
          }
      };
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              return fuelModel.updateFuelLimit(joParam);
          })
          .then(function (result) {
              console.log('updateFuelLimit=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('insertFuelLimit_post', function (done) {
      var joParam = {
          fuel: {
              action_name: 'post',
              user_id: 'micahpeng',
              action_date: (new Date()).toISOString().substr(0,10)
          },
          details : {
              post_id: 'a3f5b3df-dd8e-11e4-9df9-9b89cd41f97a'
          }
      };
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              return fuelModel.insertFuelLimit(joParam);
          })
          .then(function (result) {
              console.log('insertFuelLimit=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('getFuelLimit_post', function (done) {
      var joParam = {
          fuel: {
              action_name: 'post',
              user_id: 'micahpeng',
              action_date: (new Date()).toISOString().substr(0,10),

          },
          details : {
              post_id: 'a3f5b3df-dd8e-11e4-9df9-9b89cd41f97a'
          }
      };
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              return fuelModel.getFuelLimit(joParam);
          })
          .then(function (result) {
              console.log('getFuelAction=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('getFuelAction', function (done) {
      fuelModel.getFuelAction({fuel: {action_name: 'post'}})
          .then(function (result) {
              console.log('getFuelAction=', result);
              return done();
          })
          .catch(function (err) {
              console.log('my catched error in ' + module.id);
              //outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('updateUserFuel', function (done) {
      fuelModel.updateUserFuel({user_id: 'joelo', fuel: 133})
          .then(function(resUpdateUserFuel){
              console.log('updateUserFuel=', resUpdateUserFuel);
              return done();
          })
          .catch(function (err) {
              console.log('catch error in ' + module.id);
              //outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('getUserFuel', function (done) {
       fuelModel.getUserFuel({user_id: 'joelo'})
          .then(function(resGetUserFuel){
              console.log('getUserFuel=', resGetUserFuel);
              return done();
          })
          .catch(function (err) {
              console.log('catch error in ' + module.id);
              //outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('initUserFuel', function (done) {
      fuelModel.loadFuelAction()
          .then(function (result) {
              console.log('loadFuelAction=', result);
              return fuelModel.initUserFuel({user_id: 'seemo'});
          })
          .then(function(resInitUserFuel){
              console.log('initUserFuel=', resInitUserFuel);
              return done();
          })
          .catch(function (err) {
              console.log('catch error in ' + module.id);
              //outfitUtil.dumpError(err);
              return done(err);
          });
  });

  it('loadFuelAction', function (done) {
      fuelModel.loadFuelAction()
          .then(function (result) {
              //expect(result.results.affectedRows).to.be.equal(1);
              dumpResult(result);
              return done();
          })
          .catch(function (err) {
              console.log('catch error in ' + module.id);
              //outfitUtil.dumpError(err);
              return done(err);
          });
  });
  it('insertFuelTx', function (done) {
      userModel.insertFuelTx()
          .then(function (result) {
              expect(result.results.affectedRows).to.be.equal(1);
              dumpResult(result);
              return done();
          })
          .catch(function (err) {
              console.log('catch error in ' + module.id);
              //outfitUtil.dumpError(err);
              return done(err);
          });
  });
  */

  // 單元測試v0
  it('checkFuelTable', function(done) {
    fuelController.behavior.userRegister.getInit(function(fuel, status) {
      expect(fuel.action_point).to.be.a.number(); // 如果設定值沒有設定，就會回應0,總之至少會是回應數字
      return done();
    });
  });

  it('checkFuelTable', function(done) {
    fuelModel.check.fuelTable(function(error, result) {
      expect(error).to.be.equal(null);
      expect(result.length).to.be.equal(1);
      return done();
    });
  });

  it('getFuelInitGift', function(done) {
    fuelModel.get.fuelInitGift(function(error, result) {
      expect(error).to.be.equal(null);
      expect(result.length).to.be.equal(1); // 只能為一個值
      if (result.length == 1) {
        expect(result[0].action_point).to.be.a.number();
      }

      return done();
    });
  });

  // 事件測試
  // --> 用戶註冊
  it('login_v0', function(done) {
    var postData = {
      pre: {
        body: {
          user: { Id: 'joeyofhhh43r3r3rh10v0' },
        },
      },
    };
    loginControllerV0.login(postData, function(res) {
      expect(res.meta.code).to.be.equal(200);
      return done();
    });
  });

  it('login_v1', function(done) {
    var postData = {
      pre: {
        body: {
          user: { Id: 'joeyofhwfwgrtff4rr10v1' },
        },
      },
    };
    loginControllerV1.login(postData, function(res) {
      expect(res.meta.code).to.be.equal(200);
      return done();
    });
  });

  // --> 給一個存在的用戶，隨便寫個log
  it('HasUserTestFuelLog', function(done) {
    var userId = 'bbbbbbbbbjoe';
    var actionName = 'FreeFuel';
    var actionPoint = '100';
    var memo = '免費送';
    fuelController.behavior.writeFuelLog(userId, actionName, actionPoint, memo, function(status, feebackMessage) {
      console.log(status);
      console.log(feebackMessage);
      done();
    });
  });

  it('NoUserTestFuelLog', function(done) {
    var userId = 'wfopjgopkokf3fko';
    var actionName = 'FreeFuel';
    var actionPoint = '100';
    var memo = '免費送';
    fuelController.behavior.writeFuelLog(userId, actionName, actionPoint, memo, function(status, feebackMessage) {
      console.log(status);
      console.log(feebackMessage);
      done();
    });
  });

});

function dumpResult(result) {
  if (Lodash.has(result, 'rows') && (result.rows.length > 0)) {
    result.rows.forEach(function(row) {
      console.log(row);
    });
  } else if (Array.isArray(result)) {
    //might be Promise.inspect
    result.forEach(function(item) {
      if (Lodash.has(item, 'value')) {
        console.log(item.value()); //promise.value()
      } else {
        console.log(item);
      };
    });
  } else {
    console.log(result);
  }
}

function httpPostToDo(path, postData) {
  // 建立一個http 事件，用來測試 API 會不會壞掉
  var options = {
    host: httpParameter.host,
    path: path,
    port: httpParameter.port,
    method: 'POST'

    //headers: {
    //    'Content-Type': 'application/x-www-form-urlencoded',
    //    'Content-Length': postData.length
    //}
  };

  var req = http.request(options, function(response) {
    response.setEncoding('utf8');

    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      console.log(str);
    });
  });

  req.write(postData.toString());
  req.end();
}
