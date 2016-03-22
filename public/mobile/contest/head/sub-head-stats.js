(function() {

  'use strict';

  angular.module('fdt.mobile.contest.subhead.stats.directive', [])
      .directive('subHeadStatsDir', SubHeadStatsDir);

  SubHeadStatsDir.$inject = ['lang'];
  function SubHeadStatsDir(lang) {
    return {
      restrict: 'EA',
      scope: {
        status: '=', joined: '=',
        score: '=', scoreStats: '=',
        globalRank:'=', globalRankStats:'=',
        ranking: '=', rankingStats: '=',
      },
      templateUrl: '/mobile/contest/head/sub-head-stats.html',
      link: function(scope, elements, attr) {
        scope.lang = lang;
        scope.globalRank = (scope.globalRank) ? scope.globalRank + "%" : "--";
      }
    };
  }

})();
