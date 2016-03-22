(function() {

  angular.module('fdt.mobile.contest.services.utility', [])
      .factory('utilService', utilService);

  utilService.$inject = [];

  function utilService() {
    var utilService = {};

    utilService.injectDataToString = function(string, data) {
      return string.replace(/({\d})/g, function(j) {
        return data[j.replace(/{/, '').replace(/}/, '')];
      });
    };

    return utilService;
  }

})();
