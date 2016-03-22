(function() {

  angular.module('fdt.systemSettings', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',])
      .controller('SystemSettingsController', SystemSettingsController);
  SystemSettingsController.$inject = ['$http', '$scope', '$route'];

  function SystemSettingsController($http, $scope, $route) {
    var vm = this;
    vm.versionPath = '/backend/systemSettings';
    vm.settings = [];
    vm.query = '';
    vm.showAddSetting = false;
    vm.newEmptySetting = {key_code: '', type: '', value: '', memo: ''};
    vm.newSetting = {
      key_code: '',
      type: '',
      value: '',
      memo: '',
    };
    vm.formAddNewSetting = $scope.formAddNewSetting;
    vm.addSucceed = false;

    vm.getSettings = function() {
      $http.get(vm.versionPath)
                .success(function(data, headers) {
                  vm.settings = data;
                })
                .error(function(data, headers) {
                  console.log('error');
                });
    };

    //TODO: should be a service
    vm.convertTime = function(timeStr) {
      return moment.utc(timeStr).format('YYYY-MM-DD HH:mm:ss').toString();
    };

    vm.showAddSettingForm = function() {
      vm.showAddSetting = !vm.showAddSetting;
      if (vm.addSucceed) {
        vm.addSucceed = false;
      }

      //reload system setting list when addd setting form closedgit
      if (!vm.showAddSetting) {
        vm.getSettings();
      }
    };

    vm.saveNewSetting = function() {
      if (vm.formAddNewSetting.$valid) {

        //check if the new setting already in the list
        if (_.where(vm.settings, {key_code: vm.newSetting.key_code, type: vm.newSetting.type}).length > 0) {
          alert('Key and type already exist!');
          return;
        }

        $http.post(vm.versionPath, vm.newSetting)
                    .success(function(data, headers) {
                      vm.newSetting = angular.copy(vm.newEmptySetting);
                      vm.formAddNewSetting.$setPristine();
                      vm.addSucceed = true;
                    })
                    .error(function(data, headers) {
                      console.log('error');
                    });
      }
    };

    vm.update = function(selectedSettingsIndex) {
      var selectedSetting = vm.settings[selectedSettingsIndex];
      $http.put(vm.versionPath, selectedSetting)
                .success(function(data) {
                  alert('Setting updated!');
                  $route.reload(); /* 把整個頁面刷新重新抓資料 */
                })
                .error(function(err) {
                  alert(err);
                  console.error(err);
                });
    };
  }

})();
