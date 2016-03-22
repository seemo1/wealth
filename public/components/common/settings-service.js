(function() {

  angular.module('fdt.service.settings', [])
      .factory('settingsService', SettingsService);

  function SettingsService($http) {
    var rootPath = '/settings/v0';
    var settingsService = {};

    settingsService.get = function(type, key) {
      return $http.get(rootPath.concat('/' + type + '/' + key));
    };

    return settingsService;
  }

}());
