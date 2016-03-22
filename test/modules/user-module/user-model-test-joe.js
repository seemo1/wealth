'use strict';

var Code = require('code');
var Joi = require('joi');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab
var Promise = require('bluebird');
var _ = require('lodash');
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

global.mysqlGlobalClient = {};
global.mysqlClient = {};
global.mysqlPool = {};

var userModel = require('../../../modules/user-module/v1/user-model-v1');
var mysqlGlobal = require('../../../utils/ltsglobalmysql-client');

//var UserControllerV1 = require('../../../modules/user-module/v1/user-controller-v1');

lab.test('testing to [mysqlGlobal connection ] ', {timeout: 10000000}, function(done) {
  mysqlGlobal.initial()
      .then(function (conn) {
        if (_.size(conn == 0)) {
          return new Promise.reject('MySQL connection fail');
        } else {
          global.mysqlGlobalClient = conn;
          return done();
        }
      })
      .catch(function (error) {
        return done(error);
      });
});

function toDoBuildTestCase(title, example, coreFunction) {
  lab.test(title, {timeout: 10000000}, function (done) {
    Promise.map(example, coreFunction)
        .then(function (feedback) {
          console.log('[',title,']');
          console.log(feedback);
          if (_.indexOf(feedback, 'Y') != -1) {
            done('Fail');
          } else {
            done();
          }
        })
        .catch(function (error) {
          return done(error);
        })
    ;
  });
}

toDoBuildTestCase(
	'testing to [userModel.phoneOwner.check]',
	['1234556', '+8861\\23kfokfr', '(&$()@Jjf\'f4fk4'],
	checkPhoneOwner
);
toDoBuildTestCase(
	'testing to [userModel.phoneOwner.phoneNumberInternationalExchange]',
	[
		{phone: '+8860970033808', phone_country: '+886'},
	],
	phoneNumberChange
);
toDoBuildTestCase(
	'testing to [userModel.phoneOwner.update]',
	[
		{userId: 'joeyo', phone: '12345567', phone_country: '+886'},
		{userId: 'bb2pkkf2ofopf', phone: '1lkfp23kfpk23pofopjgp2jgpo2p2', phone_country: 'fk2jgoi4'},
	],
	updateUserPhone
);
toDoBuildTestCase(
	'testing to [userModel.emailOwner.check]',
	[
		{email: 'joe20330@gmail.com'},
		{email: 'joe20330@hkfdt.com'},
	],
	checkEmailOwner
);
toDoBuildTestCase(
	'testing to [userModel.emailOwner.update]',
	[
		{userId: 'cc', email: 'cccccccccc@gmail.com'},
		{userId: 'bb', email: 'bbbbbbbbb@gmail.com'},
	],
	updateUserEmail
);

toDoBuildTestCase(
    'testing to [userModel.emailOwner.hiddenEmailCharacters]',
    [
      {email: 'a@gmail.com'},
      {email: 'ab@gmail.com'},
      {email: 'abc@gmail.com'},
      {email: 'abcd@gmail.com'},
      {email: 'abcde@gmail.com'},
      {email: 'abcdef@gmail.com'},
      {email: 'wkfwefkjewfwkjfjklwe@gmail'},
      {email: 'cccccccccc@gmail.com'},
      {email: 'fff4fkp4kf@gmail.com'},
      {email: 'ＧＫＪＩＪＦＰＪＩ@gmail.com'},
      {email: '---@gmail.com'},
      {email: '哈哈哈哈@gmail.com'},
    ],
    hiddenEmail
);

toDoBuildTestCase(
	'testing to [userModel.getUserThirdPart]',
	[
		{userId: 'joeyo' }, {userId: 'cc'}, {userId: 'seemo'},
	],
	getUserThirdPartAccount
);

function checkPhoneOwner(example) {
  var isFail = 'Y';
  return new Promise(function (resolve, reject) {
    userModel.phoneOwner.check(example)
        .then(function (feedback) {
          if (expect(feedback).to.be.an.array()) {
            isFail = 'N';
          }

          resolve(isFail);
        }, function (error) {

          console.log(error);
          resolve(isFail);
        });
  });
}

function updateUserPhone(example) {
  var isFail = 'Y';
  var userId = example.userId;
  var phone = example.phone;
  var userPhoneCountry = example.phone_country;
  return new Promise(function (resolve, reject) {
    userModel.phoneOwner.update(userId, phone, userPhoneCountry)
        .then(function (feedback) {
          if (expect(feedback).to.be.an.object()) {
            if (feedback.warningCount == 0) {
              isFail = 'N';
            }
          }

          resolve(isFail);
        }, function (error) {

          console.log(error);
          resolve(isFail);
        });
  });
}

function phoneNumberChange(example) {
  var isFail = 'Y';
  var phoneNumber = example.phone;
  var phoneCountry = example.phone_country;
  return new Promise(function (resolve, reject) {
    userModel.phoneOwner.phoneNumberInternationalExchange(phoneCountry, phoneNumber)
        .then(function (feedback) {
          if (expect(feedback).to.be.an.string()) {
            isFail = 'N';
          }
          resolve(isFail);
        }, function (error) {

          console.log(error);
          isFail = 'Y';
          resolve(isFail);
        });
  });
}

function checkEmailOwner(example) {
  var isFail = 'Y';
  var email = example.email;
  return new Promise(function (resolve, reject) {
    userModel.emailOwner.check(email)
        .then(function (feedback) {
          if (expect(feedback).to.be.an.array()) {
            isFail = 'N';
          }

          resolve(isFail);
        }, function (error) {

          console.log(error);
          resolve(isFail);
        });
  });
}

function updateUserEmail(example) {
  var isFail = 'Y';
  var userId = example.userId;
  var email = example.email;
  return new Promise(function (resolve, reject) {
    userModel.emailOwner.update(userId, email)
        .then(function (feedback) {
          if (expect(feedback).to.be.an.object()) {
            if (feedback.warningCount == 0) {
              isFail = 'N';
            }
          }
          resolve(isFail);
        }, function (error) {

          console.log(error);
          resolve(isFail);
        });
  });
}

function hiddenEmail(example){
  var isFail = 'Y';
  var email = example.email;
  return Promise.resolve(userModel.emailOwner.hiddenEmailCharacters(email))
      .then(function (feedback) {
        if (feedback != '') {
          isFail = 'N';
        }
        return Promise.resolve(isFail);
      }, function (error) {
        console.log(error);
        return Promise.resolve(isFail);
      });
}

function getUserThirdPartAccount(example) {
  var isFail = 'Y';
  var userId = example.userId;
  return new Promise(function (resolve, reject) {
    userModel.getUserThirdPart(userId)
        .then(function (feedback) {
          if (expect(feedback).to.be.an.array()) {
            isFail = 'N';
          }
          resolve(isFail);
        }, function (error) {
          console.log(error);
          resolve(isFail);
        });
  });
}
