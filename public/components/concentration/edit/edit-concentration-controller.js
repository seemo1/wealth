(function() {

  angular.module('fdt.concentration.edit', [])
      .controller('EditConcentrationController', EditConcentrationController);

  function EditConcentrationController($scope, $modalInstance, con, $http) {

    var versionPath = '/backend/concentration';

    $scope.record = con;
    $scope.editSucceed = false;
    $scope.error = false;
    $scope.updating = false;

    $scope.save = function() {
      $scope.updating = true;
      $scope.editSucceed = false;
      $scope.error = false;

      var formData = new FormData();
      for (var prop in $scope.record) {
        formData.append(prop, $scope.record[prop]);
      }

      $http.put(versionPath, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
                .success(function(res) {
                    $scope.editSucceed = true;
                    $scope.updating = false;
                })
                .error(function(err) {
                    $scope.error = true;
                    $scope.updating = false;
                });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }

})();
