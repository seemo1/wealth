(function() {

  angular.module('fdt.dashboard',
      [
          'fdt.header',
          'fdt.directive.leftMenu',
          'fdt.announce',
          'fdt.systemSettings',
          'fdt.school',
          'fdt.group',
          'fdt.contest',
          'fdt.contestV2.query',
          'fdt.contestV2.edit',
          'fdt.deepLink',
          'fdt.concentration',
          'fdt.banner',
          'fdt.contest.banner',
          'fdt.fuel',
          'fdt.coin',
          'fdt.user',
          'fdt.splashScreen',
          'fdt.adBulletin',
          'fdt.adBulletin.service',
          'fdt.adBulletin.directive.listDir',
          'fdt.student',
          'fdt.directive.imageSlider',
          'fdt.contestV2.service'
      ])
      .controller('DashboardController', DashboardController);

  function DashboardController($scope, $http, $location) {
    var vm = this;
    vm.currentView = localStorage.getItem('currentView') || 'default';

    $scope.$on('switchView', function(event, value) {
      vm.currentView = value;
      localStorage.setItem('currentView', value);
      $scope.$apply();
    });

    vm.logout = function() {
      $http.get('/fdt/logout')
                .finally(function() {
                  localStorage.removeItem('currentView');
                  $location.path('/fdt/login');
                });
    };
  }
})();
// 後台項目新增設定 [Joe Notice]