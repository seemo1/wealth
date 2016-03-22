(function() {

  angular.module('fdt.school.edit', ['fdt.directive.uploadFile'])
      .controller('EditSchoolController', EditSchoolController);

  EditSchoolController.$inject = ['$scope', '$modalInstance', 'school', '$http', 'schoolService'];
  function EditSchoolController($scope, $modalInstance, school, $http, schoolService) {
    var logTag = '[Edit School]';
    var vm = this;
    var baseUrl = '/backend/school';
    vm.versionPath = '/backend/school';
    vm.school = school;
    vm.editSucceed = false;
    vm.error = false;
    vm.updating = false;

    vm.save = function(schoolKey) {
      vm.updating = true;
      vm.editSucceed = false;
      vm.error = false;
      if (vm.formEditSchool.$valid) {
        var formData = new FormData();
        if ($scope.editFlagFile) {
          formData.append('file', $scope.editFlagFile);
        }
        for(var prop in vm.school) {
          formData.append(prop, vm.school[prop]);
        }

        $http.put(baseUrl.concat('/' + schoolKey), formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
        })
            .success(function() {
              vm.editSucceed = true;
              vm.updating = false;
            })
            .error(function(err) {
              console.error(logTag, 'getCertified', err);
            });
      }
    };

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }

})();
