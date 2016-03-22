(function() {

  angular.module('fdt.group.edit', ['fdt.directive.uploadFile'])
      .controller('EditGroupController', EditGroupController)
      .controller('AddGroupController', AddGroupController)
      .controller('SubGroupController', SubGroupController);

  function EditGroupController($scope, $modalInstance, group, $http) {
    var logTag = '[Edit Group]';
    var vm = this;
    vm.apiPath = '/backend/group/setGroupProfile';
    vm.group = group;
    vm.formEditGroup = $scope.formEditGroup;
    vm.editSucceed = false;
    vm.error = false;
    vm.updating = false;

    vm.save = function() {
      vm.updating = true;
      vm.editSucceed = false;
      vm.error = false;

      if ($scope.editImgFile) {
        vm.group.img = $scope.editImgFile;
      }

      if ($scope.editBGImgFile) {
        vm.group.background_img = $scope.editBGImgFile;
      }

      if (vm.formEditGroup.$valid) {

        var data = new FormData();
        for (var prop in vm.group) {
          data.append(prop, vm.group[prop]);
        }

        $http.post(vm.apiPath, data, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
        })
                    .success(function(res) {
                      console.log(logTag, res, 'succeeddsadas');
                      vm.editSucceed = true;
                      vm.updating = false;
                    })
                    .error(function(err) {
                      console.log(logTag, 'error', err);
                      vm.error = true;
                      vm.updating = false;
                    });
      }
    };

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };

  function AddGroupController($scope, $modalInstance, group, $http) {
    var logTag = '[Add Group Member]';
    var vm = this;
    vm.apiPath = '/backend/group/addGroupMember';
    vm.group = group;
    vm.formAddGroupMember = $scope.formAddGroupMember;
    vm.addSucceed = false;
    vm.error = false;
    vm.updating = false;

    vm.save = function() {
      vm.updating = true;
      vm.addSucceed = false;
      vm.error = false;
      if (vm.formAddGroupMember.$valid) {
        console.log(logTag, 'save', vm.group);
        $http.post(vm.apiPath, vm.group)
                    .success(function(res) {
                      if (res.code != 200) {
                        console.log(logTag, 'error', res.message);
                        vm.message = res.message;
                        vm.error = true;
                        vm.updating = false;
                      } else {
                        console.log(logTag, 'succeed');
                        vm.message = res.message;
                        vm.editSucceed = true;
                        vm.updating = false;
                      }

                      console.log(logTag, 'succeed');

                      //vm.addSucceed = true;
                      //vm.updating = false;
                    })
                    .error(function(err) {
                      console.log(logTag, 'error', err);
                      vm.error = true;
                      vm.updating = false;
                    });
      }
    };

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };

  function SubGroupController($scope, $modalInstance, group, $http) {
    var logTag = '[Sub Group Member]';
    var vm = this;
    vm.apiPath = '/backend/group/subGroupMember';
    vm.group = group;
    vm.formSubGroupMember = $scope.formSubGroupMember;
    vm.addSucceed = false;
    vm.error = false;
    vm.updating = false;

    vm.save = function() {
      vm.updating = true;
      vm.addSucceed = false;
      vm.error = false;
      if (vm.formSubGroupMember.$valid) {
        console.log(logTag, 'save', vm.group);
        $http.post(vm.apiPath, vm.group)
                    .success(function(res) {
                      if (res.code != 200) {
                        console.log(logTag, 'error', res.message);
                        vm.message = res.message;
                        vm.error = true;
                        vm.updating = false;
                      } else {
                        console.log(logTag, 'succeed');
                        vm.message = res.message;
                        vm.editSucceed = true;
                        vm.updating = false;
                      }

                      console.log(logTag, 'succeed');
                    })
                    .error(function(err) {
                      console.log(logTag, 'error', err);
                      vm.error = true;
                      vm.updating = false;
                    });
      }
    };

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };

})();
