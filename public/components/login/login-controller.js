(function() {
  'use strict';

  angular.module('fdt.login', [])
      .controller('LoginController', LoginController);

  function LoginController($http, $location) {
    var vm = this;
    vm.loading = false;
    vm.email = '';
    vm.password = '';
    vm.mesasge = '';

    vm.login = function() {
      vm.loading = true;
      vm.message = '';
      var loginData = {
        email: encryptData(vm.email),
        password: encryptData(vm.password),
      };

      $http.post('/dashboard/v0/login', loginData)
                .success(function(data, headers) {
                  $location.path('/fdt/dashboard');
                })
                .error(function(err, headers) {
                  if (headers === 501) {
                    vm.message = 'Cannot login, please contact developer';
                    return;
                  }

                  vm.message = 'Invalid email/password';
                })
                .finally(function() {
                  vm.loading = false;
                  vm.password = '';
                  vm.email = '';
                });
    };

    function encryptData(str) {
      var md = forge.sha1.create();
      md.update(str);
      return md.digest().toHex();
    }
  }

})();
