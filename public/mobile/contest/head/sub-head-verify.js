(function () {

  'use strict';

  angular.module('fdt.mobile.contest.subhead.verify.directive', [])
      .directive('subHeadVerifyDir', SubHeadVerifyDir);

  function SubHeadVerifyDir(){
    return {
      restrict: 'EA',
      templateUrl: '/mobile/contest/head/sub-head-verify.html'
    };
  }


})();