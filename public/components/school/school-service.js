(function() {

  angular.module('fdt.service.school', [])
      .factory('schoolService', SchoolService);

  SchoolService.$inject = ['$http'];

  function SchoolService($http) {
    var apiPath = '/backend/schools/';
    var schoolService = {};

    schoolService.get = function() {
      return $http.get(apiPath);
    };

    schoolService.add = function(newSchool) {
      return $http.post(apiPath, newSchool, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      });
    };

    schoolService.update = function(newSchoolData) {
      return $http.put(apiPath, newSchoolData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      });
    };

    return schoolService;
  }

})();
