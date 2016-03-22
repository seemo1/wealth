(function() {

  'use strict';

  angular.module('fdt.mobile.contest.contestRule.directive', [])
      .directive('contestRuleDir', ContestRuleDir);

  ContestRuleDir.$inject = ['lang', '$filter', '$sce'];
  function ContestRuleDir(lang, $filter, $sce) {
    return {
      restrict: 'EA',
      scope: {contest: '='},
      templateUrl: '/mobile/contest/contest-rule/contest-rule.html',
      link: function(scope, elements, attr) {
        scope.participant = scope.contest.min_user_settings + lang.PEOPLE +", " + lang.PARTICIPANT + " " + scope.contest.user_join_sum + " " + lang.HAVE_APPLIED;
        scope.lang = lang;
        var formattedStartTime = $filter('date')(scope.contest.start_date_time * 1000, 'yyyy-MM-dd HH:mm');
        var formattedEndTime = $filter('date')(scope.contest.end_date_time * 1000, 'yyyy-MM-dd HH:mm');
        scope.duraction = formattedStartTime + " " + lang.TO + " " + formattedEndTime;
        scope.description = (scope.contest.content_description) ? scope.contest.content_description : "";
        scope.description = $sce.trustAsHtml(scope.description);
      }
    };
  }

})();
