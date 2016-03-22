(function () {

  'use strict';

  angular.module('fdt.mobile.contest.subhead.kicked.directive', [])
      .directive('subHeadKickedDir', SubHeadKickedDir);

  function SubHeadKickedDir(){
    return {
      restrict: 'EA',
      scope: {stopLoss: '='},
      templateUrl: '/mobile/contest/head/sub-head-kicked.html'
    };
  }


})();