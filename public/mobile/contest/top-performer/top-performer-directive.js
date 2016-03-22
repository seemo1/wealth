(function() {

  'use strict';

  angular.module('fdt.mobile.contest.topPerformer.directive', [])
      .directive('topPerformerDir', TopPerformerDir);

  TopPerformerDir.$inject = ['lang', '$state']
  function TopPerformerDir(lang, $state) {
    return {
      restrict: 'EA',
      scope: {
        contestId: '=', title: '@', participants: '=',
        defaultCollapse: '@', state:'=', totalUsers:'@', mode: '@'
      },
      templateUrl: '/mobile/contest/top-performer/top-performer.html',
      link: function(scope, elements, attr) {
        scope.lang = lang;
        if(scope.participants.length > 0) { 
          elements.bind('click', function (e) {
            if (e.srcElement.className.indexOf('view-all') > -1) {
              $state.go(scope.state, {id: scope.contestId});
            }
          });
        }

        // 開一個接口讓 children 丟 function 給 parent
        var childs = [];
        scope.addChild = function(child) {
          childs.push(child);
        };

        scope.closeAllChart = function() {
          childs.forEach(function(element){
            element();
          })
        };
      }
    };
  }

})();
