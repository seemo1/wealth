'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var contestModel = require('../../../modules/contest-module/v0/contest-model-v0');
var moment = require('moment');
var token = 'br9r3Hd0i3zQZf/cfrggaqwOIYJNFbSqjitajCU3MgTJDkr5WScqCYaKv3Cpm8dcWO1Ag1UU5NUfj7tMYnibsGqGdpnM1TQBnwlPNmcp0UhmhgvHQFgyOzES55RRydtr8YLEhoZU5g+m2wZn5vOUU28tTt+wfwU8JDLly8k64V6Wxxhw6qLmJOpWJnmCUCc7UdOUbEEqEN2XvgTJFbOk+VW/ltGA3SldY2MQQE/bZQDxuhZps/XNW/bkulIyRdbGZoYwsCpXIpDUus+CLod/Tb4vkh+OFQHhUx4FtoTLVyzCD6LDmN72f9LDxeXCfcP8gvmVRizOAjguxUbShOg44g==';
var newContest = {
  cn_description: '比薩及介紹',
  cn_icon_image: null,
  cn_name: '簡體比賽2',
  cn_title: '比賽',
  description: 'contest description',
  end_date_time: moment().add(10, 'days').format('YYYY-MM-DD') + ' 21:10',
  icon_image: null,
  join_cond_free: 'Y',
  join_cond_mail: 'hkfdt.com, gmail.com',
  join_cond_school_key: 'School key',
  join_cond_school_region: 'TW,EN',
  join_cond_user_country: 'TW, EN',
  current_money: 100000,
  name: 'test contest',
  region: '',
  reward_base_join_total: 0,
  reward_base_money: 10000,
  reward_bonus_ratio: '40,30,15,10,5',
  reward_coin_mark: '$',
  reward_coin_name: 'NTD',
  reward_max_money: 200000,
  reward_rise_money: 500,
  start_date_time: moment().format('YYYY-MM-DD') + ' 22:00',
  status: '',
  title: 'contest title',
  tw_description: '比賽介紹',
  tw_icon_image: null,
  tw_name: '繁體比賽2',
  tw_title: '比賽',
};

var dummyUser = {
  school_key: '',
  school_region: '',
  country: '',
  email: '',
};

var dummyContest = {
  join_cond_school_key: ['schoolkey1', 'schoolkey2', 'schoolkey3', 'schoolkey4', 'schoolkey5'],
  join_cond_school_region: ['EN', 'TW', 'IN', 'CN', 'GB', 'JP'],
  join_cond_user_country: ['EN', 'TW', 'IN', 'CN', 'GB', 'JP'],
  join_cond_mail: ['hkfdt.com', 'gmail.com', 'ntut.edu.tw', 'edu.tw'],
};

var systemSettings = require('../../../commonlib/settings-common');

describe('Contest Module Model V0 Test', function() {

  before({timeout:5000}, function(done) {
    systemSettings.load()
        .then(function(res) {
          done();
        });
  });

  it('isEligibleToJoin (check by contest condition free) should returns true', function(done) {
    dummyContest.join_cond_free = 'Y';
    dummyUser.school_key = 'invalid school key';
    dummyUser.school_region = 'invalid school region';
    dummyUser.email = 'invalid email address';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    dummyContest.join_cond_free = 'N'; //reset for next test
    done();
  });

  it('isEligibleToJoin (check by school key schoolkey3) should returns true', function(done) {
    dummyUser.school_key = 'schoolkey3';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isEligibleToJoin (check by school key schoolkey) should returns false', function(done) {
    dummyUser.school_key = 'schoolkey';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(false);
    done();
  });

  it('isEligibleToJoin (check by school region EN) should returns true', function(done) {
    dummyUser.school_region = 'EN';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isEligibleToJoin (check by school region TW) should returns true', function(done) {
    dummyUser.school_region = 'TW';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isEligibleToJoin (check by school region ENTW) should returns false', function(done) {
    dummyUser.school_region = 'ENTW';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(false);
    done();
  });

  it('isEligibleToJoin (check by school region undefined) should returns false', function(done) {
    dummyUser.school_region = undefined;
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(false);
    done();
  });

  it('isEligibleToJoin (check by country EN) should returns true', function(done) {
    dummyUser.country = 'EN';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isEligibleToJoin (check by country IN) should returns true', function(done) {
    dummyUser.country = 'EN';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isEligibleToJoin (check by country CN) should returns true', function(done) {
    dummyUser.country = 'CN';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isUserEligible (check by country KR) to join should returns false', function(done) {
    dummyUser.school_key = '';
    dummyUser.school_region = '';
    dummyUser.country = 'KR';
    dummyUser.email = '';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(false);
    done();
  });

  it('isUserEligible (check by country INTW) to join should returns false', function(done) {
    dummyUser.school_key = '';
    dummyUser.school_region = '';
    dummyUser.country = 'INTW';
    dummyUser.email = '';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(false);
    done();
  });

  it('isEligibleToJoin (check by email user@hkfdt.com) should returns true', function(done) {
    dummyUser.email = 'user@hkfdt.com';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isEligibleToJoin (check by email user@ntut.edu.tw) should returns true', function(done) {
    dummyUser.email = 'user@ntut.edu.tw';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isEligibleToJoin (check by email user@google.com) should returns false', function(done) {
    dummyUser.email = 'user@google.com';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(false);
    done();
  });

  it('isEligibleToJoin (check by email user@ntu.edu.tw) should returns true', function(done) {
    dummyUser.email = 'user@ntu.edu.tw';
    var isEligibleToJoin = contestModel.internals.isUserEligibleToJoin(dummyUser, dummyContest);
    expect(isEligibleToJoin).to.be.equal(true);
    done();
  });

  it('isContestEnabledAndNotFinished should returns true', {timeout: 60000}, function(done) {
    dummyContest.start_date_time = moment().format('YYYY-MM-DD');
    dummyContest.status = 'Y';
    dummyContest.end_date_time = moment().add(10, 'day').format('YYYY-MM-DD');
    var isContestEnabledAndNotFinished = contestModel.internals.isContestEnabledAndNotFinished(dummyContest);
    expect(isContestEnabledAndNotFinished).to.be.equal(true);
    done();
  });

  it('isContestEnabledAndNotFinished should returns false', {timeout: 60000}, function(done) {
    dummyContest.start_date_time = moment().format('YYYY-MM-DD');
    dummyContest.status = 'Y';
    dummyContest.end_date_time = moment().subtract(10, 'day').format('YYYY-MM-DD');
    var isContestEnabledAndNotFinished = contestModel.internals.isContestEnabledAndNotFinished(dummyContest);
    expect(isContestEnabledAndNotFinished).to.be.equal(false);
    done();
  });

  it('getUserUnitPrice should returns unit price', {timeout: 5000}, function(done) {
    contestModel.internals.getUserUnitPrice('a-sen')
            .then(function(result) {
              expect(result).to.be.a.number();
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('isRoiDuplicated should returns true', function(done) {
    var roiList = [
        {PL_PER: 60.5, RANKING: 1},
        {PL_PER: 60.5, RANKING: 2},
        {PL_PER: 40, RANKING: 3},
        {PL_PER: 30, RANKING: 4},
        {PL_PER: 20, RANKING: 5},
        {PL_PER: 20, RANKING: 6},
        {PL_PER: 15, RANKING: 7},
    ];
    var isRoiDuplicated = contestModel.internals.isRoiDuplicated(roiList);
    expect(isRoiDuplicated).to.be.equal(true);
    done();
  });

  it('isRoiDuplicated should returns false', function(done) {
    var roiList = [
        {PL_PER: 60.5, RANKING: 1},
        {PL_PER: 60, RANKING: 2},
        {PL_PER: 50, RANKING: 3},
        {PL_PER: 30, RANKING: 4},
        {PL_PER: 27, RANKING: 5},
        {PL_PER: 20, RANKING: 6},
        {PL_PER: 15, RANKING: 7},
    ];
    var isRoiDuplicated = contestModel.internals.isRoiDuplicated(roiList);
    expect(isRoiDuplicated).to.be.equal(false);
    done();
  });

  it('reSortingDuplicatedRoi should returns array with modified rankings based on duplicated ROI', function(done) {
    var roiList = [
        {PL_PER: 70, RANKING: 1},
        {PL_PER: 70, RANKING: 2},
        {PL_PER: 50, RANKING: 3},
        {PL_PER: 30, RANKING: 4},
        {PL_PER: 30, RANKING: 5},
    ];
    var expectedRoiList = [
        {PL_PER: 70, RANKING: 1},
        {PL_PER: 70, RANKING: 1},
        {PL_PER: 50, RANKING: 3},
        {PL_PER: 30, RANKING: 4},
        {PL_PER: 30, RANKING: 4},
    ];

    roiList = contestModel.internals.reSortingDuplicatedRoi(roiList);
    expect(expectedRoiList).to.deep.equal(roiList);
    done();
  });

  it('reSortingDuplicatedRoi should returns array of ROI that is not modified', function(done) {
    var roiList = [
        {PL_PER: 80, RANKING: 1},
        {PL_PER: 70, RANKING: 2},
        {PL_PER: 50, RANKING: 3},
        {PL_PER: 30, RANKING: 4},
        {PL_PER: 20, RANKING: 5},
    ];
    var expectedRoiList = [
        {PL_PER: 80, RANKING: 1},
        {PL_PER: 70, RANKING: 2},
        {PL_PER: 50, RANKING: 3},
        {PL_PER: 30, RANKING: 4},
        {PL_PER: 20, RANKING: 5},
    ];

    roiList = contestModel.internals.reSortingDuplicatedRoi(roiList);
    expect(expectedRoiList).to.deep.equal(roiList);
    done();
  });

  it('calculateRewardMoneyList should returns contest reward money list based on ranking', function(done) {
    var roiList = [
        {PL_PER: 60, RANKING: 1},
        {PL_PER: 50, RANKING: 2},
        {PL_PER: 40, RANKING: 3},
        {PL_PER: 30, RANKING: 4},
        {PL_PER: 20, RANKING: 5},
    ];
    var dummyContest = {
      reward_bonus_ratio: '40, 30, 15, 10, 5',
      current_money: 100000,
    };
    var rewardMoneyList = contestModel.internals.calculateRewardMoneyList(dummyContest, roiList);
    var expectedRewardMoneyList = [40000, 30000, 15000, 10000, 5000];
    expect(expectedRewardMoneyList).to.deep.equal(rewardMoneyList);
    done();
  });

  it('calculateRewardMoneyList should returns contest reward money list based on ranking (ranking duplicated)', function(done) {
    var roiList = [
        {PL_PER: 60, RANKING: 1},
        {PL_PER: 50, RANKING: 2},
        {PL_PER: 50, RANKING: 2},
        {PL_PER: 40, RANKING: 4},
        {PL_PER: 40, RANKING: 4},
    ];
    var dummyContest = {
      reward_bonus_ratio: '40, 30, 15, 10, 5',
      current_money: 100000,
    };
    var rewardMoneyList = contestModel.internals.calculateRewardMoneyList(dummyContest, roiList);
    var expectedRewardMoneyList = [40000, 22500, 22500, 7500, 7500];
    expect(expectedRewardMoneyList).to.deep.equal(rewardMoneyList);
    done();
  });

  it('should create a new contest', {timeout: 5000}, function(done) {
    contestModel.add(newContest, function(err, contestId) {
      newContest.contestId = contestId;
      expect(contestId).to.exist();
      done();
    });
  });

  it('should returns contest by contest id that just created', {timeout: 15000}, function(done) {
    contestModel.getById(newContest.contestId, function(err, contest) {
      expect(newContest.contestId).to.be.equal(contest.contest_id);
      done();
    });
  });

  it('should returns all contest', {timeout: 10000}, function(done) {
    contestModel.get(function(err, contests) {
      expect(contests.length).to.be.above(0);
      done();
    });
  });

  it('should returns all ready contest', {timeout: 10000}, function(done) {
    contestModel.getContest.readyList(function(err, contests) {
      expect(contests.length).to.be.exist();
      done();
    });
  });

  it('should returns all ongoing contest', {timeout: 10000}, function(done) {
    contestModel.getContest.goingList(function(err, contests) {
      expect(contests.length).to.be.above(0);
      done();
    });
  });

  it('should returns all past contest', {timeout: 10000}, function(done) {
    contestModel.getContest.pastList(function(err, contests) {
      expect(contests.length).to.be.above(0);
      done();
    });
  });

  it('should update contest count', function(done) {
    contestModel.internals.updateContestUserCount(newContest.contestId)
            .then(function(res) {
              expect(res).to.be.equal(true);
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('should get contest count', function(done) {
    contestModel.internals.getContestUserCount(newContest.contestId)
            .then(function(count) {
              expect(count).to.be.equal(1);
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('should get ROI list', function(done) {
    contestModel.internals.getRoiList(newContest.contestId)
            .then(function(roiList) {
              done();
            })
            .catch(function(err) {
              done();
            });
  });

  it('publish contest on LTS', {timeout: 5000}, function(done) {
    contestModel.publish(newContest.contest_id, function(err, result) {
      expect(err).to.be.equal(null);
      done();
    });
  });

  it('joinLTS', {timeout: 5000}, function(done) {
    contestModel.join('rayson', newContest.contest_id, function(err, result) {
      expect(err).to.be.equal(null);
      done();
    });
  });

  it('should delete contest by contest id', function(done) {
    contestModel.delete(newContest.contestId, function(err, result) {
      expect(err).to.be.null();
      done();
    });
  });

});
