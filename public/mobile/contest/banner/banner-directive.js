(function() {

  'use strict';

  angular.module('fdt.mobile.contest.banner.directive', [])
      .directive('bannerDir', BannerDir);

  function BannerDir() {
    return {
      restrict: 'EA',
      scope: { image: '@', link: '@' },
      templateUrl: '/mobile/contest/banner/banner.html'
    };
  }

})();
