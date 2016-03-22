(function() {

  'use strict';

  angular.module('fdt.mobile.contest.subhead.nav.directive', [])
      .directive('navDir', navDir);

  navDir.$inject = ['$cookies', '$state'];
  function navDir($cookies, $state) {
    return {
      restrict: 'EA',
      scope: { title: '=', deeplink: '=' },
      templateUrl: '/mobile/contest/nav/nav.html',
      link: function(scope, elements, attr) {
        //for handling go to previous page from nested view
        document.title = scope.title;
        scope.goBack = function() {
          var fromState = $cookies.getObject('fromState');
          var fromParams = $cookies.getObject('fromParams');
          if (fromState.name !== 'contest' && fromState.name) {
            $state.go(fromState.name, fromParams);
            return;
          }

          $state.go('contest');
        };
      },
    };
  }

})();
