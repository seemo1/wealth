'use strict';

var Code = require('code');
var Joi = require('joi');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var systemSettings = require('../../../commonlib/settings-common');
var storageAgent = require('../../../commonlib/storage-agent-common');

var testServer  = require('../../test-server');

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var UserModel = require('../../../modules/user-module/v0/user-model-v0');
var UserControllerV1 = require('../../../modules/user-module/v1/user-controller-v1');

//INFO: lib for http call
//REF: https://github.com/hapijs/wreck
var Wreck = require('wreck');

//TODO: for Rayson

//INFO: commented because this test always fail if ran using
// other IP outside FDT taipei office

var CASE_MSG = {
  GET_USER_PROFILE: 'Get User Profile',
  SET_USER_PROFILE: 'Set User Profile',
  REGISTER_USER: 'Register New User',
  SET_USER_SCHOOL: 'Set User School',
  CHECK_ACCOUNT: 'Check Account',
  SEARCH_USER: 'Search User',
  GET_USER_PERFORMANCE: 'Get User Performance',
  GET_USER_PERFORMANCE_CHART: 'Get Performance Chart Info',
  SELECT_USER_COUNT: 'Select User Count',
  IS_FOLLOWING: 'Is Following',
  CASE_WITH_ERROR_PARMS: '(Case with incorrect parameters)',
};

describe('User model test', function() {

  testServer.start()
        .then(function() {
          systemSettings.load();
        });

  var requestPacket = getRequestPacket('p001', 'p001', false);

  //runCaseWithCorrectParameters(requestPacket);

  requestPacket = getRequestPacket('p001', 'p001', true);
  runCaseWithCorrectParameters(requestPacket);
});

function runCaseWithCorrectParameters(requestPacket) {
  //case_getUserProfile(requestPacket);
  //case_setUserProfile(requestPacket);
  //case_checkAccuont(requestPacket);
  //case_searchUser(requestPacket);
  //case_getPerformance(requestPacket);
  //case_getPerformanceChartInfo(requestPacket);
  //case_selectUserCount(requestPacket);
  //case_isFollowing(requestPacket);
  //
  //case_registerUser(requestPacket);
  //case_setUserSchool(requestPacket);
  //case_searchUserByPhone();
  //case_searchUserByEmail();
  //case_getTopTrader();
  //case_getPopularTrader();
  //case_getWishFollow();
  //case_uploadPhoneList();
  //case_uploadSocialList();
  //case_getFriendList();
  case_getTopTraderRandom();
  case_getPopularTraderRandom();
}

// Test Cases ------------------------------------------------------
function case_getUserProfile(reqPacket) {
  it(getCaseMsg(reqPacket, CASE_MSG.GET_USER_PROFILE), function(done) {
    UserModel.getUserProfile(reqPacket, function(result) {

      expect(result.meta.code).to.equal(200);
      expect(result.user.userid).to.equal('p001');

      done();

    });
  });
}

function case_setUserProfile(reqPacket) {
  it(getCaseMsg(reqPacket, CASE_MSG.SET_USER_PROFILE), function(done) {

    UserModel.getUserProfile(reqPacket, function(userProfile) {

      showUserProfile(userProfile);

      var profileReqPacket = convertProfileToRequestPacket(userProfile);
      var newNickName = 'NickNameP001';

      profileReqPacket.pre.body.data.username = newNickName;

      UserModel.setUserProfile(profileReqPacket, function(setProfileResult) {

        expect(setProfileResult.meta.code).to.equal(200);

        done();
      });
    });
  });
}

function case_registerUser(reqPacket) {
  it(getCaseMsg(reqPacket, CASE_MSG.REGISTER_USER), function(done) {

    UserModel.registerUser(reqPacket, function(registerResult) {

      expect(registerResult.meta.code).to.equal(400);

      //expect(registerResult.meta.code).to.equal(200);
      done();
    });
  });
}

function case_setUserSchool(reqPacket) {
  it(getCaseMsg(reqPacket, CASE_MSG.SET_USER_SCHOOL), function(done) {

    UserModel.setUserSchool(reqPacket, function(setResult) {

      console.log(setResult);
      done();
    });
  });
}

function case_checkAccuont(reqPacket) {
  it(getCaseMsg(reqPacket, CASE_MSG.CHECK_ACCOUNT), function(done) {

    UserModel.checkAccount(reqPacket, function(checkResult) {

      expect(checkResult.meta.code).to.equal(400);
      done();
    });
  });
}

function case_searchUser(reqPacket) {
  it(getCaseMsg(reqPacket, CASE_MSG.SEARCH_USER), function(done) {

    UserModel.searchUser(reqPacket, function(searchResult) {

      expect(searchResult.meta.code).to.equal(200);
      done();
    });
  });
}

function case_getPerformance(reqPacket) {
  it(getCaseMsg(reqPacket, CASE_MSG.GET_USER_PERFORMANCE), function(done) {

    UserModel.getPerformance(reqPacket, function(userPerformance) {

      console.log(userPerformance.performance);
      expect(userPerformance.meta.code).to.equal(200);

      done();
    });
  });
}

function case_getPerformanceChartInfo(reqPacket) {
  it(getCaseMsg(reqPacket, CASE_MSG.GET_USER_PERFORMANCE_CHART), function(done) {

    UserModel.getPerformanceChartInfo(reqPacket, function(performanceChartInfo) {

      console.log(performanceChartInfo.performance);
      expect(performanceChartInfo.meta.code).to.equal(200);

      done();

    });
  });
}

function case_selectUserCount(reqPacket) {
  var userId = (reqPacket != null) ? reqPacket.pre.body.user.Id : null;

  it(getCaseMsg(reqPacket, CASE_MSG.SELECT_USER_COUNT), function(done) {

    UserModel.selectUserCount(userId, function(selectResult) {

      showUserCount(selectResult);
      expect(selectResult.user_id).to.equal(userId);

      done();
    });
  });
}

function case_isFollowing(reqPacket) {
  var userId = (reqPacket != null) ? reqPacket.pre.body.user.Id : null;
  var followingUserId = 'p002';

  it(getCaseMsg(reqPacket, CASE_MSG.IS_FOLLOWING), function(done) {

    UserModel.IsFollowing(userId, followingUserId, function(result) {

      expect(result).to.equal('0');

      done();
    });
  });
}

//new Add
function case_searchUserByPhone() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {
          phone: '961008711,970033808',
        },
      },
    },
  };
  var schrma = Joi.object().keys({
    USERID:Joi.string(),
    USERNAME:Joi.string(),

  });
  it(getCaseMsg(request, 'Search User By PHONE'), {timeout:30000}, function(done) {

    UserControllerV1.searchUserByPhone(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_searchUserByEmail() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {
          email: 'rayson19@gmail.com,rayson22@gmail.com,rayson@mail.com',
        },
      },
    },
  };
  var schrma = Joi.object().keys({
    USERID:Joi.string(),
    USERNAME:Joi.string(),

  });
  it(getCaseMsg(request, 'Search User By EMAIL'), {timeout:30000}, function(done) {

    UserControllerV1.searchUserByEmail(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_getTopTrader() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {},
      },
    },
  };
  it(getCaseMsg(request, 'get Top Trader List'), {timeout:30000}, function(done) {

    UserControllerV1.getTopTrader(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_getPopularTrader() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {},
      },
    },
  };
  it(getCaseMsg(request, 'get Popular Trader List'), {timeout:30000}, function(done) {

    UserControllerV1.getPopularTrader(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_getWishFollow() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {page:1},
      },
    },
  };
  it(getCaseMsg(request, 'get Wish Follow List'), {timeout:30000}, function(done) {

    UserControllerV1.getWishFollow(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_uploadPhoneList() {
  console.log('start');
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {
          phone: '+1(207) 241-4315,+1(347) 493-6917,+11 (206) 724-9636,+113154125187,+114086214954,+115057303379,+115099938710,+116462297619,+117605053884,+117608016909,+118128028357,+118157865280,+12012072915,+12012503849,+12012896709,+12013061065,+12013342263,+12013342558,+12013380154,+12015159701,+12015727033,+12016200075,+12016613632,+12016630123,+12016692895,+12017550202,+12017576528,+12017999330,+12018037741,+12018357473,+12018770248,+12019275149,+12022512961,+12022531823,+12022850425,+12023062411,+12023603306,+12024124299,+12024892635,+12025106773,+12025278594,+12025501696,+12025504686,+12027930883,+12028239959,+12029053408,+12032139164,+12032152792,+12032320117,+12032465810,+12032738150,+12033317172,+12034510787,+12035124610,+12035127226,+12035228258,+12035363498,+12035435048,+12035603239,+12036095273,+12036104354,+12037274664,+12037700975,+12038037117,+12038037431,+12038581655,+12038590721,+12038924054,+12039279274,+12039792269,+12055165126,+12056024338,+12056148050,+12056237061,+12056411837,+12057896742,+12057898273,+12059016677,+12059998870,+12062014086,+12062014794,+12062267819,+12062351662,+12063065963,+12063308440,+12063995165,+12064576036,+12064990806,+12065198258,+12066190433,+12066618137,+12066943413,+12066949357,+12067089369,+12068160258,+12068512043,+12068544828,+12068836260,+12069155464,+12069411437',
        },
      },
    },
  };
  var schrma = Joi.object().keys({
    USERID:Joi.string(),
    USERNAME:Joi.string(),

  });
  it(getCaseMsg(request, 'Upload User In MySQL By PHONE'), {timeout:30000}, function(done) {

    UserControllerV1.uploadPhoneList(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_uploadSocialList() {
  console.log('start');
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {
          social: 'fb-1014861885200257,\
                    fb-10152632491347260,\
                    fb-10153237803268968,\
                    fb-10153292870221979,\
                    fb-10153548768791979,\
                    fb-10200357947068819,\
                    fb-10206175157560497,\
                    fb-10206245048477681,\
                    fb-10206255901695796,\
                    fb-10206763077454873,\
                    fb-103713869962800,\
                    fb-103713869962800005,\
                    fb-103713869962800006,\
                    fb-103713869962800007,\
                    fb-103713869962800008,\
                    fb-103713869962800010,\
                    fb-103713869962800011',
        },
      },
    },
  };
  var schrma = Joi.object().keys({
    USERID:Joi.string(),
    USERNAME:Joi.string(),

  });
  it(getCaseMsg(request, 'Upload User In MySQL By SOCIAL'), {timeout:30000}, function(done) {

    UserControllerV1.uploadSocialList(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_getFriendList() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {},
      },
    },
  };
  it(getCaseMsg(request, 'get Friend List'), {timeout:30000}, function(done) {

    UserControllerV1.getFriendList(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_getTopTraderRandom() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {users:'rayleung920303:450.31;test19881023:148.27;qfjohnnylee:190.45'},
      },
    },
  };
  it(getCaseMsg(request, 'get Top Trader List'), {timeout:30000}, function(done) {

    UserControllerV1.getTopTraderRandom(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

function case_getPopularTraderRandom() {
  var request = {
    pre: {
      body: {
        user: {Id: 'rayson'},
        data: {users: 'devops2:0.8;rickdev:2.4;xiaonanzhi:1.2'},
      },
    },
  };
  it(getCaseMsg(request, 'get Popular Trader List'), {timeout:30000}, function(done) {

    UserControllerV1.getPopularTraderRandom(request, function(result) {

      expect(result).to.be.an.object();

      done();
    });
  });
}

// Utility Functions -----------------------------------------------
function getRequestPacket(userid, targetUserId, isFakeData) {
  var queryKeyWord = 'p001';

  if (isFakeData) {
    userid = 1234;
    queryKeyWord = 9999;
  }

  return {
    pre: {
      body: {
        user: {Id: userid},
        data: {
          target_userid: targetUserId,
          school_key: '502',
          school_name: 'TestSchool',
          school_region: 'TW',
        },
      },
    },
    payload: {
      userid: userid,
      email: 'testMail@hkfdt.com',
      query: queryKeyWord,
      offset: 0,
      hits: 10,
    },
    fake_data: isFakeData,
  };
}

function getCaseMsg(reqPacket, caseMsg) {
  if (reqPacket.fake_data == true)
      caseMsg = caseMsg + CASE_MSG.CASE_WITH_ERROR_PARMS;

  return caseMsg;
}

function convertProfileToRequestPacket(userProfile) {
  var userId = userProfile.user.userid;
  var userName = userProfile.user.username;
  var birthday = userProfile.user.birthday;
  var bio = userProfile.user.bio;
  var country = userProfile.user.country;
  var mail = userProfile.user.email;
  var firstName = userProfile.user.firstname;
  var lastName = userProfile.user.lastname;
  var org = userProfile.user.org;
  var sex = userProfile.user.sex;

  var packet = {
    pre: {
      body: {
        user: {Id: userId},
        data: {
          birthday: birthday,
          sex: sex,
          email: mail,
          username: userName,
          firstname: firstName,
          lastname: lastName,
          org: org,
          bio: bio,
          country: country,
          img: null,
          background_image: null,
        },
      },
    },
  };

  return packet;
}

function showUserProfile(userProfile) {
  var userId = userProfile.user.userid;
  var userName = userProfile.user.username;
  var birthday = userProfile.user.birthday;
  var background_url = storageAgent.getImageUrl(userProfile.user.background_url);
  var bio = userProfile.user.bio;
  var country = userProfile.user.country;
  var mail = userProfile.user.email;
  var firstName = userProfile.user.firstname;
  var lastName = userProfile.user.lastname;
  var org = userProfile.user.org;
  var phone = userProfile.user.phone;
  var servingUrl = storageAgent.getSmallImageUrl(userProfile.user.serving_url);
  var sex = userProfile.user.sex;
  var schoolKey = userProfile.user.school_key;
  var schoolName = userProfile.user.school_name;
  var isFollowing = userProfile.user.isfollowing;

  console.log('-------------- User Profile --------------');

  console.log('User Id      = ' + userId);
  console.log('User Name    = ' + userName);
  console.log('Birthday     = ' + birthday);
  console.log('Back Url     = ' + background_url);
  console.log('bio          = ' + bio);
  console.log('country      = ' + country);
  console.log('mail         = ' + mail);
  console.log('firstName    = ' + firstName);
  console.log('lastName     = ' + lastName);
  console.log('org          = ' + org);
  console.log('phone        = ' + phone);
  console.log('Serving Url  = ' + servingUrl);
  console.log('sex          = ' + sex);
  console.log('School Key   = ' + schoolKey);
  console.log('School Name  = ' + schoolName);
  console.log('Is Following = ' + isFollowing);

  console.log('------------------------------------------');
}

function showUserCount(userCount) {

  console.log('-------------- User Count --------------');

  console.log('User Id         : ' + userCount.user_id);
  console.log('Follower Count  : ' + userCount.follower_count);
  console.log('Following Count : ' + userCount.following_count);
  console.log('Referral Count  : ' + userCount.referral_count);
  console.log('Group Count     : ' + userCount.group_count);

  console.log('----------------------------------------');
}
