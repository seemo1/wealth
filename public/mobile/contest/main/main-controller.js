(function() {

  'use strict';

  angular.module('fdt.mobile.contest.controller', [
      'fdt.mobile.contest.list.directive',
      'fdt.mobile.contest.language.api',
  ])
      .controller('ContestCtrl', ContestCtrl);

  ContestCtrl.$inject = ['bulletins', 'banner', 'lang', 'joinedContest', 'suggestedContest', '$cookies', '$window', '$state', 'contestDetail'];
  function ContestCtrl(bulletins, banner, lang, joinedContest, suggestedContest, $cookies, $window, $state, contestDetail) {
    var contest = (contestDetail) ? contestDetail.data.data[0] : undefined;
    if (contest) {
      $state.go(contest.progress_status, {id: contest.contest_id}, {location:"replace"});
    }
    var vm = this;
    vm.language = lang;
    vm.title = vm.language.NAV_TITLE;
    document.title = vm.title;
    vm.bulletins = bulletins.data;
    vm.bannerCookie = true;
    if ($cookies.getObject('BannerCookie') == false) {
      vm.bannerCookie = $cookies.getObject('BannerCookie');
    }

    vm.emptyContestBannerSrc = 'http://forexmaster.oss-cn-beijing.aliyuncs.com/contest/en_bg_contest_empty.jpg';
    if (window.language == 'cn') {
      vm.emptyContestBannerSrc = 'http://forexmaster.oss-cn-beijing.aliyuncs.com/contest/cn_bg_contest_empty.jpg';
    }else if (window.language == 'tw') {
      vm.emptyContestBannerSrc = 'http://forexmaster.oss-cn-beijing.aliyuncs.com/contest/tw_bg_contest_empty.jpg';
    }

    vm.banner = {
      top: _.where(banner.data.data, {place: 'TOP'})[0] || {content: ''},
      bottom: _.where(banner.data.data, {place: 'BOTTOM'})[0] || {content: ''},
    };

    vm.joinedContest = joinedContest.data.data;
    vm.suggestedContest = suggestedContest.data.data;
    vm.user = $cookies.getObject('user');
    vm.deeplink = vm.user.protocol.concat('://fdt/discover/index');
    vm.myContest = vm.user.protocol.concat('://fdt/discover/contests/mycontest?callback=onMyContest');

    vm.goContest = function() {
      $state.go('user');
    };

    vm.clickBanner = function() {
      $cookies.putObject('BannerCookie', false);
      vm.bannerCookie = $cookies.getObject('BannerCookie');
    };
  }

})();
