(function() {

  angular.module('fdt.contest.banner.edit', ['ngFileUpload'])
      .controller('ContestEditBannerController', ContestEditBannerController);

  function ContestEditBannerController($scope, $modalInstance, $http, $route, banner) {

    var logTag = '[EditBannerController]';
    var vm = this;

    vm.banner = banner;
    vm.updating = false;
    vm.formEditBanner = $scope.formEditBanner;

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    vm.save = function(file) {
      vm.updating = true;
      var versionPath = '/backend/contests/contestBannerUpdate/' + banner.language + '/' + banner.place_type + '/';

      if (file) {
        vm.banner.newImg = file;
      }

      var formData = new FormData();
      for (var prop in vm.banner) {
        formData.append(prop, vm.banner[prop]);
      }

      $http.put(versionPath, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
        .success(function(data) {

          //$scope.$emit('bannerUpdated');
          $modalInstance.dismiss('close');
          vm.updating = false;
        })
        .error(function(err) {
          alert(err);
          vm.updating = false;
        });
    };

  }

})();
