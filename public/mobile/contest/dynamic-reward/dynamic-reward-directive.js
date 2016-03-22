(function() {

  'use strict';

  angular.module('fdt.mobile.contest.dynamic.reward.directive', [])
      .directive('dynamicRewardDir', DynamicRewardDir);

  DynamicRewardDir.$inject = ['lang', 'utilService']
  function DynamicRewardDir(lang, utilService) {
    return {
      restrict: 'EA',
      scope: {
        currentMoney: '=', riseMoney: '=', maxMoney: '=', coinMark: '='
      },
      templateUrl: '/mobile/contest/dynamic-reward/dynamic-reward.html',
      link: function(scope, elements, attr) {
        scope.lang = lang;
        scope.description = utilService.injectDataToString(lang.CASH_POOL_DESCRIPTION, [scope.riseMoney, scope.maxMoney]);
        var progressBar = elements[0].querySelector('.progress-bar');
        progressBar.style.width = (scope.currentMoney / scope.maxMoney * 100) + '' + '%';
      }
    };
  }

})();
