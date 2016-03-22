(function() {

  'use strict';

  angular.module('fdt.mobile.contest.prize.directive', [])
      .directive('prizeDir', PrizeDir);

  PrizeDir.$inject = ['lang', '$sce'];
  function PrizeDir(lang, $sce) {
    return {
      restrict: 'EA',
      scope: {content: '='},
      templateUrl: '/mobile/contest/prize/prize.html',
      link: function(scope, elements, attr) {
        scope.content = $sce.trustAsHtml(scope.content);
        scope.lang = lang;
      }
    };
  }

})();
