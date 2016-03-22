(function() {

  'use strict';

  angular.module('fdt.mobile.contest.list.directive', [])
      .directive('listDir', ListDir);

  ListDir.$inject = ['$state'];
  function ListDir($state) {
    return {
      restrict: 'EA',
      scope: {contests: '=', title: '@'},
      templateUrl: '/mobile/contest/list/list-directive.html',
      link: function(scope, elem, attrs) {
        if(scope.title) {
           scope.titleClass = "list-title";
        }
      },
    };
  }

})();
