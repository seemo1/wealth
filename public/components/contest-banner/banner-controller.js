(function() {

  angular.module('fdt.contest.banner', [
      'ngRoute',
      'ui.bootstrap',
      'ngFileUpload',
      'fdt.contest.banner.edit',])
      .controller('ContestBannerController', ContestBannerController);

  function ContestBannerController($http, $scope, $modal, $timeout) {

    var logTag = '[Contest Banner Controller]';

    $scope.minDate = new Date();

    $scope.status = {
      opened: false
    };

    $scope.open = function($event) {
      $scope.status.opened = true;
    };

    $scope.$on('closeEditBanner', function() {
      console.log(logTag, 'closeEditBanner');
    });

    $scope.$on('bannerUpdated', function() {
      vm.getBanners();
    });

    var vm = this;
    vm.versionPath = '/backend/contests/adBanner/';
    vm.bannerList = [];

    vm.getBanners = function() {
      vm.bannerList = [];

      $http.get(vm.versionPath, {params: {}})
                .success(function(data, headers) {
                  vm.bannerList = data;
                })
                .error(function(data, headers) {
                });
    };

    vm.edit = function(banner) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'banner-edit2.html',
        controller: 'ContestEditBannerController',
        controllerAs: 'edit',
        resolve: {
          banner: function() {
            return banner;
          }
        }
      });

      modalInstance.result.then(function(result) {
      }, function() {
        vm.getBanners();
      });
    };

    vm.convertTime = function(timeStr) {
      return moment.utc(timeStr).format('YYYY-MM-DD HH:mm:ss').toString();
    };
  }

})();
