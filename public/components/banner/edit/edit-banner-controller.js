(function() {

  angular.module('fdt.banner.edit', ['ngFileUpload'])
      .controller('EditBannerController', EditBannerController);

  function EditBannerController($scope, $http, $route) {

    var logTag = '[EditBannerController]';
    var vm = this;
    vm.versionPath = '/banner/v1';

    $scope.$on('editBanner', function(e, selectedBanner) {
      console.log(logTag, 'edit banner received');
      vm.banner = angular.copy(selectedBanner);
      console.log(selectedBanner);
    });

    vm.updating = false;
    vm.formEditBanner = $scope.formEditBanner;

    vm.cancel = function() {
      $scope.$emit('closeEditBanner');
    };

    vm.save = function(file) {
      vm.updating = true;
      console.log(logTag, 'edit', vm.banner);

      if (file) {
        vm.banner.img = file;
        vm.banner.fileType = file.type;
      }

      var formData = new FormData();
      for (var prop in vm.banner) {
        formData.append(prop, vm.banner[prop]);
      }

      $http.put(vm.versionPath, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
                .success(function(data) {
                  console.log(logTag, 'edit', 'done', data);

                  $scope.file = null;
                  angular.forEach(
                      angular.element('input[type=\'file\']'),
                        function(inputElem) {
                          angular.element(inputElem).val(null);
                        });

                  $scope.$emit('bannerUpdated');
                  vm.updating = false;
                })
                .error(function(err) {
                  console.error(err);
                  alert(err);
                  vm.updating = false;
                });
    };

  }

})();
