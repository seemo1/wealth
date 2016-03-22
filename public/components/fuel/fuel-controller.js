(function() {

  angular.module('fdt.fuel', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'fdt.service.fuel'])
      .controller('FuelController', FuelController);

  function FuelController(fuelService) {
    var logTag = '[Fuel Controller]';
    var vm = this;
    vm.settings = [];
    vm.settingsDelete = [];
    vm.logs = [];
    vm.logUserId = '';
    vm.logNotFound = false;
    vm.fuelRankings = [];
    vm.fuelConditionMin = 0;
    vm.fuelConditionMax = 50;
    vm.tempFuelConditionMin = 0;
    vm.tempFuelConditionMax = 50;
    vm.totalUserRankings = 0;
    vm.totalRankingCurPage = 1;
    vm.rankingOrder = 'fuel';
    vm.rankingOrderReverse = false;
    vm.fuelUserId = '';
    vm.userFuelInfo = {};

    vm.getSettings = function() {
      fuelService.getSettings()
                .success(function(settings) {
                  vm.settings = _.reject(settings, function(s) {
                    return s.action_name === 'commentDeleted' || s.action_name === 'postDeleted';
                  });

                  vm.settingsDelete = _.filter(settings, function(s) {
                    return s.action_name === 'commentDeleted' || s.action_name === 'postDeleted';
                  });
                })
                .error(function(err) {
                  console.error(logTag, 'getSettings', err);
                });
    };

    vm.updateSettings = function(settingIndex) {
      var selectedSetting = angular.copy(vm.settings[settingIndex]);
      fuelService.updateSettings(selectedSetting)
                .success(function(res) {
                  alert('Settings updated!');
                })
                .error(function(err) {
                  alert('Cannot update settings! ' + err.message);
                });
    };

    vm.getLogs = function() {
      vm.logs = [];
      vm.logNotFound = false;
      fuelService.getLogs(vm.logUserId)
                .success(function(res) {
                  vm.logs = res;
                  if (vm.logs.length < 1) {
                    vm.logNotFound = true;
                  }
                })
                .error(function(err) {
                  console.error(logTag, 'getLogs', err);
                });
    };

    vm.getRankings = function() {
      vm.rankings = [];
      var offset = (vm.totalRankingCurPage * 50) - 50;
      var minFuel = vm.fuelConditionMin;
      var maxFuel = vm.fuelConditionMax;

      //for resetting pagination page
      if (vm.tempFuelConditionMin != vm.fuelConditionMin || vm.tempFuelConditionMax != vm.fuelConditionMax) {
        vm.totalRankingCurPage = 1;
        vm.tempFuelConditionMin = vm.fuelConditionMin;
        vm.tempFuelConditionMax = vm.fuelConditionMax;
      }

      fuelService.getRankings(offset, minFuel, maxFuel)
                .success(function(res) {
                  vm.fuelRankings = res.users;
                  vm.totalUserRankings = res.totalUser;
                  console.log(vm.totalUserRankings);
                })
                .error(function(err) {
                  console.error(logTag, 'getRankings', err);
                });
    };

    vm.getUserFuelInfo = function() {
      console.log('fuel get user info');
      fuel.userFuelInfo = {};
      fuelService.getUserFuelInfo(vm.fuelUserId)
                .success(function(userInfo) {
                  vm.userFuelInfo = userInfo[0];
                })
                .error(function(err) {
                  console.log(logTag, 'getUserFuelInfo', err);
                });
    };

    vm.changeFuelRankingOrder = function(orderType) {
      vm.rankingOrderReverse = (vm.rankingOrder === orderType) ? !vm.rankingOrderReverse : false;
      $scope.rankingOrder = orderType;
    };
  }
})();
