(function() {

  angular.module('fdt.service.fuel', [])
      .factory('fuelService', FuelService);

  FuelService.$inject = ['$http'];

  function FuelService($http) {
    var baseUrl = '/backend/fuel';
    var fuelService = {};

    fuelService.getSettings = function() {
      return $http.get(baseUrl.concat('/settings'));
    };

    fuelService.updateSettings = function(setting) {
      return $http.put(baseUrl.concat('/settings'), setting);
    };

    fuelService.getLogs = function(userId) {
      return $http.get(baseUrl.concat('/logs/' + userId));
    };

    fuelService.getRankings = function(offset, minFuel, maxFuel) {
      return $http.get(baseUrl.concat('/rankings?minFuel=' + minFuel + '&maxFuel=' + maxFuel + '&offset=' + offset));
    };

    fuelService.getUserFuelInfo = function(userId) {
      return $http.get(baseUrl.concat('/user/' + userId));
    };

    return fuelService;
  }

})();
