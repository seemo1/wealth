(function() {

  angular.module('fdt.user.edit', [])
      .controller('EditUserController', EditUserController);

  function EditUserController($scope, $modalInstance, user, $http) {
    var logTag = '[Edit User]';
    var vm = this;
    vm.apiPath = '/backend/user/setUserProfile';
    vm.user = user;
    vm.types = user.types;    // array of type_id
    vm.typeList = user.typeList;  // array of userType
    vm.formEditUser = $scope.formEditUser;
    vm.editSucceed = false;
    vm.error = false;
    vm.updating = false;
    vm.selectTypes = [];  // userid's types from DB
    vm.curSelects = [];   // userid's selected types
    vm.typeChanged = false;  // if user type changed

    vm.selectChanged = function(index) {
      var idx = vm.curSelects.indexOf(index);
      if (idx > -1) {
        vm.curSelects.splice(idx, 1);
      }else {
        vm.curSelects.push(index);
      }
      vm.typeChanged = true;
    };

    vm.save = function() {
      if (vm.typeChanged) {
        vm.setUserType();
      }

      vm.updating = true;
      vm.editSucceed = false;
      vm.error = false;
      if (vm.formEditUser.$valid) {
        $http.post(vm.apiPath, vm.user)
          .success(function(res) {
            if (res.code != 200) {
              vm.message = res.message;
              vm.error = true;
              vm.updating = false;
            }else {
              vm.editSucceed = true;
              vm.updating = false;
            }
          })
          .error(function(err) {
            vm.error = true;
            vm.updating = false;
          });
      }
    };

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    vm.getUserType = function() {
      var params = {user_id: vm.user.user_id};

      $http.get('/backend/user/getUserType', {params:params}, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
        .then(function(response) {
          vm.selectTypes = response.data.list;
          vm.curSelects = vm.selectTypes.slice(0);
        });
    };

    vm.setUserType = function() {
      var formData = new FormData();
      formData.append('user_id', vm.user.user_id);
      formData.append('types', vm.curSelects);

      $http.post('/backend/user/setUserType', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
        .success(function(data, headers) {
        })
        .error(function(data, headers) {
        });
    };

  }
})();
