(function() {
  angular.module('fdt.user', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'fdt.user.edit'])
      .controller('UserController', UserController);

  function UserController($http, $scope, $modal, $timeout) {

    var vm = this;
    vm.versionPath = '/backend/user/getUserProfile';

    vm.getUserTypeList = function() {
      return new Promise(function(resolve, reject) {
        $http.get('/backend/user/getUserTypeList', {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        })
            .then(function(response) {
              resolve(response.data);
            });

      });
    };

    vm.edit = function(userId) {
      vm.getUserTypeList()
          .then(function(typeData) {
            var formData = new FormData();
            formData.append('user_id', userId);

            //REF: https://angular-ui.github.io/bootstrap/ (modal)
            $http.post('/backend/user/getUserProfile', formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined},
            })
                .success(function(data, headers) {
                  vm.user = data.user;
                  vm.user.typeList = typeData.list;
                  vm.user.types = typeData.types;
                  var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'edit-user.html',
                    controller: 'EditUserController',
                    controllerAs: 'editUser',
                    resolve: {
                      user: vm.user
                    }
                  });

                  modalInstance.result.then(function(result) {
                  }, function() {
                  });
                })
                .error(function(data, headers) {
                });
          })
    };

    vm.searchUser = function() {
      var formData = new FormData();
      for (var prop in vm.searchUserFrom) {
        formData.append(prop, vm.searchUserFrom[prop]);
      }

      $http.post('/backend/user/searchUser', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
                .success(function(data, headers) {
                  vm.userList = data.users;
                })
                .error(function(data, headers) {
                });
    };
    
  }

})();

