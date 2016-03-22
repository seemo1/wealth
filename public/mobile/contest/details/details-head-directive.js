(function() {

  'use strict';

  angular.module('fdt.mobile.contest.details.head.directive', [])
      .directive('detailsHeadDir', DetailsHeadDir);

  DetailsHeadDir.$inject = ['$cookies', 'CONFIG', 'lang', '$filter', '$state'];
  function DetailsHeadDir($cookies, CONFIG, lang, $filter, $state) {
    return {
      restrict: 'EA',
      scope: {contest: '=', shared: '@'},
      templateUrl: '/mobile/contest/details/details-head.html',
      link: function(scope, elem, attrs) {
        scope.lang = lang;
        document.title = lang.CONTEST_DETAILS;
        var amDifference = $filter('amDifference');
        scope.formattedStartTime = amDifference(scope.contest.start_date_time * 1000, null, 'days');
        scope.formattedEndTime = amDifference(scope.contest.end_date_time * 1000, null, 'days');
        switch(scope.contest.market_code) {
          case "FT":
          case "FC":
            scope.headClass = "header-futures";
            break;
          case "SC":
            scope.headClass = "header-stock";
            break;
          default:
            scope.headClass = "header-forex";
        }
        scope.headClass
        var user = $cookies.getObject('user');
        if (!scope.contest) {
          scope.contest = $cookies.getObject('selectedContest');
        }

        scope.shareLink = '';
        if (scope.shared !== 'true') {
          var contestUrl = CONFIG.shareLink + '?contest_id=' + scope.contest.contest_id +
              '&language=' + user.language +
              '&platform=' + user.platform +
              '&type=' + user.protocol + '&market=' + scope.contest.market_code;
          scope.shareLink = user.protocol + '://fdt/request/socialshare?title=' + scope.contest.title +
              '&msg=' + scope.contest.content_description + '&url=' + encodeURIComponent(contestUrl) + '&img=' + encodeURIComponent(scope.contest.icon_image);
        }
        scope.goApplied = function() {
          $state.go('participantList', {id: scope.contest.contest_id});
        }
      },
    };
  }

})();
