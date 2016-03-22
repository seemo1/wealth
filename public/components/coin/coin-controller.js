(function() {

  angular.module('fdt.coin', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs', ])
      .controller('CoinController', CoinController)
      .factory('coinService', CoinService);

  function CoinController($scope, coinService) {

    $scope.distributions = [];
    $scope.logs = {};
    $scope.settings = [];

    var logTag = '[Coin Controller]';
    var vm = this;
    vm.market = '';
    vm.error = false;

    vm.getDistributions = function() {

      coinService.getDistributions()
                .success(function(distributions) {
                  $scope.distributions = distributions;
                })
                .error(function(err) {
                  console.error(logTag, 'getDistributions', err);
                });
    };

    vm.getRanges = function() {

      coinService.getRanges(vm.rangeGt, vm.rangeLt)
                .success(function(ranges) {
                  $scope.ranges = ranges;
                })
                .error(function(err) {
                  console.error(logTag, 'getRanges', err);
                });
    };

    vm.getLogs = function() {

      coinService.getLogs(vm.logUserId)
                .success(function(res) {
                  $scope.logs = res;
                })
                .error(function(err) {
                  console.error(logTag, 'getLogs', err);
                });
    };

    vm.adjust = function() {

      coinService.adjust(vm.adjustUserIds, vm.adjustCoins)
                .success(function(res) {
                  $scope.adjustLogs = res;
                  vm.adjustUserIds = '';
                })
                .error(function(err) {
                  console.error(logTag, 'adjust', err);
                });
    };

    vm.getSettings = function() {

      coinService.getSettings(vm.market)
                .success(function(settings) {
                  if (typeof (settings) == 'string') {
                    vm.error = true;
                    return;
                  }

                  vm.error = false;
                  $scope.settings = settings;
                })
                .error(function(err) {
                  vm.error = true;
                  console.error(logTag, 'getSettings', err);
                });
    };

    vm.updateSetting = function(setting) {

      console.log(setting);

      coinService.updateSetting(setting, vm.market)
                .success(function() {
                  vm.getSettings();
                  alert('Setting updated!');
                })
                .error(function(err) {
                  console.error(logTag, 'updateSetting', err);
                  alert('Cannot update setting! ' + err.message);
                });
    };

    // transactionModel.Feature enum
    vm.getFeatureText = function(feature) {

      switch (feature) {
        case 0:
          return 'Position Stop Loss';
        case 1:
          return 'Trailing Stop';
        case 2:
          return 'Daily Stop Loss';
        case 3:
          return 'Day Trade Mode';
        case 4:
          return 'Add Cash';
        case 5:
          return 'Account Reset';
        case 99:
          return 'Convert From Fuel';
        case 100:
          return 'Manual Adjustment';
        default:
          return '?';
      }
    };

    vm.convertTime = function(timeStr) {
      return moment.utc(timeStr).format('YYYY-MM-DD HH:mm:ss').toString();
    };
  }

  CoinService.$inject = ['$http'];

  function CoinService($http) {

    var baseUrl = '/backend/coin';
    var coinService = {};

    coinService.getDistributions = function() {
      return $http.get(baseUrl.concat('/distributions'));
    };

    coinService.getRanges = function(gt, lt) {

      var formData = new FormData();
      formData.append('gt', gt);
      formData.append('lt', lt);

      return $http.post(baseUrl.concat('/ranges'), formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      });
    };

    coinService.getLogs = function(userId) {
      return $http.get(baseUrl.concat('/logs/' + userId));
    };

    coinService.adjust = function(userIds, adjustCoins) {

      var formData = new FormData();
      formData.append('userIds', userIds);
      formData.append('adjustCoins', adjustCoins);

      return $http.post(baseUrl.concat('/adjust'), formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      });
    };

    coinService.getSettings = function(market) {
      var formData = {market: market};
      return $http.get(baseUrl.concat('/settings'), {params:formData});
    };

    coinService.updateSetting = function(setting, market) {

      var formData = new FormData();
      formData.append('feature', setting.feature);
      formData.append('coins', setting.coins);
      formData.append('days', setting.days);
      formData.append('market', market);

      return $http.post(baseUrl.concat('/setting'), formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      });
    };

    return coinService;
  }

})();
