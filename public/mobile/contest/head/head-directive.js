(function () {

  'use strict';

  angular.module('fdt.mobile.contest.head.directive', [
        'fdt.mobile.contest.subhead.info.directive',
        'fdt.mobile.contest.subhead.kicked.directive',
        'fdt.mobile.contest.subhead.stats.directive',
        'fdt.mobile.contest.subhead.verify.directive',
      ])
      .directive('contestHeadDir', ContestHeadDir);

  ContestHeadDir.$inject = ['$state', '$cookies', '$window', 'lang', '$filter'];
  function ContestHeadDir($state, $cookies, $window, lang, $filter) {
    return {
      restrict: 'EA',
      scope: {contest: '=', status: '@'},
      templateUrl: '/mobile/contest/head/head.html',
      link: function (scope, elem, attrs) {
        scope.lang = lang;
        if($window.language == "cn") {
          scope.formattedStartTime = $filter('date')(scope.contest.start_date_time * 1000, 'MM月dd日');
          scope.formattedEndTime = $filter('date')(scope.contest.end_date_time * 1000, 'MM月dd日');
        } 
        else {
          scope.formattedStartTime = $filter('date')(scope.contest.start_date_time * 1000, 'MM-dd HH:mm');
          scope.formattedEndTime = $filter('date')(scope.contest.end_date_time * 1000, 'MM-dd HH:mm');
        }
        elem.bind('click', function (e) {
          $cookies.putObject('selectedContest', scope.contest);
          if (!scope.contest.is_new_contest) {
            var user = $cookies.getObject('user');
            $window.location.href = user.protocol + '://fdt/discover/contests/contestmain?contestid=' + scope.contest.contest_id;
            return;
          }
          localStorage.setItem('market', scope.contest.market_code);
          $state.go(scope.contest.progress_status, {id: scope.contest.contest_id});
        });
      },
    };
  }

})();
