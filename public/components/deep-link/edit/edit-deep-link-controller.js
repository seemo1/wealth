(function() {

  angular.module('fdt.deepLink.edit', [])
      .controller('EditDeepLinkController', EditDeepLinkController);

  function EditDeepLinkController($scope, $modalInstance, deepLink, $http) {

    var vm = this;
    vm.versionPath = '/deep-link/v1';

    vm.deepLink = deepLink;
    vm.formEditDeepLink = $scope.formEditDeepLink;

    vm.editSucceed = false;
    vm.error = false;
    vm.updating = false;

    vm.save = function() {
      vm.updating = true;
      vm.editSucceed = false;
      vm.error = false;

      if (!vm.formEditDeepLink.$valid) {
        return;
      }

      var formData = new FormData();
      for (var prop in vm.deepLink) {
        formData.append(prop, vm.deepLink[prop]);
      }

      console.log('[Edit deep link]', 'save', vm.deepLink);
      $http.put(vm.versionPath, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
                .success(function(res) {
                  console.log('[Edit deep link]', 'succeed');
                  vm.editSucceed = true;
                  vm.updating = false;
                })
                .error(function(err) {
                  console.log('[Edit deep link]', 'error', err);
                  vm.error = true;
                  vm.updating = false;
                });
    };

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }

})();
