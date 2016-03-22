(function() {

  'use strict';

  angular.module('fdt.mobile.contest.subhead.info.directive', [])
      .directive('subHeadInfoDir', SubHeadInfoDir);

  SubHeadInfoDir.$inject = ['lang', '$filter']
  function SubHeadInfoDir(lang, $filter) {
    return {
      restrict: 'EA',
      scope: {
        status:'=', totalParticipants:'=', joined:'=',
        startTime:'=', prize:'=', currency: '=', endTime:'='
      },
      templateUrl: '/mobile/contest/head/sub-head-info.html',
      link: function(scope, elements, attr) {
        var amDifference = $filter('amDifference');
        scope.formattedStartTime = amDifference(scope.startTime * 1000, null, 'days');
        scope.formattedEndTime = amDifference(scope.endTime * 1000, null, 'days');
        scope.lang = lang;
      }
    };
  }

})();
