(function() {
  angular.module('fdt.group', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'fdt.directive.uploadFile',
        'fdt.group.edit',])
      .controller('GroupController', GroupController);

  function GroupController($http, $scope, $modal, $timeout) {

    var vm = this;
    vm.versionPath = '/backend/group/getAllGroupProfile';
    vm.showAddGroup = false;
    vm.formAddNewGroup = $scope.formAddNewGroup;
    vm.newGroup = {
      type: 'public',
      auth_token: 'faFV9AWLZnKvcC23mBwxDX0H/JzT992CQA1fCUk8uM3SFadeqASirZv4nGm3wuzohot//XIgoul/CG9AGb/XRcTItq7wW9csslSMDyrsDOZ3hq+2dY0IC2BsOte0jQ0feKaPl5n5ceDQgwtvQE6WuPcs1V636MZEzf42PznBX8vOzyEG8o1BmmDTqKeTHySf82GC5RGhz5w7e0I8o2CyFr+P9TjRCCeZwMgqAQ1Qv+T30N6CkJv4Hap7gJiJVZ+O+BfU1GbrvM1YSCSnxE1bYQFbwjh0seWaqgyGdMvefzdBxLI2kC8xWwoPN6dFg38aFX+AZQccAd6ZFKx5TfU7ow==',
    };
    vm.groupList = [];
    vm.addSucceed = false;

    vm.getGroup = function() {
      $http.post(vm.versionPath, {})
                .success(function(data, headers) {
                  vm.groupList = data.groups;
                  console.log('[Get group]', data.groups);
                })
                .error(function(data, headers) {
                  console.log('[Get group error]', data);
                });
    };

    vm.showAddGroupForm = function() {
      vm.showAddGroup = !vm.showAddGroup;
    };

    vm.saveNewGroup = function() {
      console.log('[Save new group]', vm.newGroup);
      if ($scope.imgFile) {
        vm.newGroup.img = $scope.imgFile;
        vm.newGroup.fileType = $scope.imgFile.type;
      }

      var formData = new FormData();
      for (var prop in vm.newGroup) {
        formData.append(prop, vm.newGroup[prop]);
      }

      $http.post('/backend/group/createGroup', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
                .success(function(data, headers) {
                  console.log('[Save new group succeed]', data);
                })
                .error(function(data, headers) {
                  console.log('[Save new group error]', data);
                });
    };

    vm.edit = function(groupId) {
      vm.selectedGroup = _.where(vm.groupList, {group_id: groupId})[0];
      console.log(vm.selectedGroup);
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'edit-group.html',
        controller: 'EditGroupController',
        controllerAs: 'editGroup',
        resolve: {
          group: function() {
            return vm.selectedGroup;
          },
        },
      });

      modalInstance.result.then(function(result) {
        console.log('reload group list');
        $timeout(vm.getGroup(), 2000);
        vm.getGroup(); //reload group list
      }, function() {

        console.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.delete = function(groupId) {
      var confirmed = confirm('Are you sure to delete this group?');

      if (confirmed) {
        $http.post('/backend/group/deleteGroup', {group_id: groupId})
                    .success(function(data, headers) {
                      console.log('[Delete group succeed]', data);
                    })
                    .error(function(data, headers) {
                      console.log('[Delete group error]', data);
                    });
      }
    };

    vm.convertTime = function(timeStr) {
      return moment.utc(timeStr).format('YYYY-MM-DD HH:mm:ss').toString();
    };

    vm.nameChange = function() {
      $http.post('/backend/group/checkGroupName', {group_id: vm.newGroup.name})
                .success(function(data, headers) {
                  if (data) {

                  }
                })
                .error(function(data, headers) {
                  console.log('[Delete group error]', data);
                });

      if (_.where(vm.groupList, {name: vm.newGroup.name}).length > 0) {
        $timeout(function() {
          vm.formAddNewGroup.name.$invalid = true;
          vm.formAddNewGroup.$invalid = true;
        });
      }
    };

    vm.searchGroup = function() {
      var formData = new FormData();
      for (var prop in vm.searchGroupFrom) {
        formData.append(prop, vm.searchGroupFrom[prop]);
      }

      $http.post(vm.versionPath, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
                .success(function(data, headers) {
                  if (data == 'NoConnCass') {
                    vm.error = true;
                    vm.message = 'Cassandra not connection';
                  }

                  vm.groupList = data.groups;
                  console.log('[Get group]', data.groups);
                })
                .error(function(data, headers) {
                  console.log('[Get group error]', data);
                });
    };

    vm.addGroupMember = function(groupId) {
      //REF: https://angular-ui.github.io/bootstrap/ (modal)
      vm.selectedGroup = _.where(vm.groupList, {group_id: groupId})[0];
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'add-member.html',
        controller: 'AddGroupController',
        controllerAs: 'addGroupMember',
        resolve: {
          group: function() {
            return vm.selectedGroup;
          },
        },
      });
      modalInstance.result.then(function(result) {
        console.log('reload group list');
        $timeout(vm.getGroup(), 2000);
        vm.getGroup(); //reload group list
      }, function() {

        console.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.subGroupMember = function(groupId) {
      //REF: https://angular-ui.github.io/bootstrap/ (modal)
      vm.selectedGroup = _.where(vm.groupList, {group_id: groupId})[0];
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'sub-member.html',
        controller: 'SubGroupController',
        controllerAs: 'subGroupMember',
        resolve: {
          group: function() {
            return vm.selectedGroup;
          },
        },
      });
      modalInstance.result.then(function(result) {
        console.log('reload group list');
        $timeout(vm.getGroup(), 2000);
        vm.getGroup(); //reload group list
      }, function() {

        console.info('Modal dismissed at: ' + new Date());
      });
    };
  }

})();

