(function() {

  angular.module('fdt.concentration', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'fdt.concentration.edit', ])
      .controller('ConcentrationController', ConcentrationController);

  function ConcentrationController($http, $scope, $modal, $timeout) {
    var path = '/backend/concentration';
    var vm = this;
    vm.showAddMajor = false;
    vm.formAddNewMajor = $scope.formAddNewMajor;
    vm.newMajor = {
      concentration_key: '',
      en_name: '',
      en_short: '',
      sc_name: '',
      sc_pinyin: '',
      tc_name: '',
      region: '',
      is_del: '0',
    };
    vm.newEmptyMajor = angular.copy(vm.newMajor);
    vm.uploading = false;

    $scope.depts = [
      { id:'A', category:'Agriculture'},
      { id:'B', category:'Architecture and Planning'},
      { id:'C', category:'Arts'},
      { id:'D', category:'Biological Sciences'},
      { id:'E', category:'Business'},
      { id:'F', category:'Communications'},
      { id:'G', category:'Computer and Information Sciences'},
      { id:'H', category:'Education'},
      { id:'I', category:'Engineering'},
      { id:'J', category:'Environmental Sciences'},
      { id:'K', category:'Health Care'},
      { id:'L', category:'Languages and Literature'},
      { id:'M', category:'Law'},
      { id:'N', category:'Mathematics & Statistics'},
      { id:'O', category:'Mechanics and Repair'},
      { id:'P', category:'Military Science'},
      { id:'Q', category:'Philosophy and Religion'},
      { id:'R', category:'Physical Sciences'},
      { id:'S', category:'Protective Services'},
      { id:'T', category:'Psychology & Counseling'},
      { id:'U', category:'Recreation & Fitness'},
      { id:'V', category:'Services'},
      { id:'W', category:'Skilled Trades and Construction'},
      { id:'X', category:'Social Sciences & Liberal Arts'},
      { id:'Y', category:'Social Services'},
      { id:'Z', category:'Transportation'},
      { id:'0', category:'User Define'},
    ];

    $scope.selectDept = null;
    $scope.conList = [];

    $scope.query = function() {
      if ($scope.selectDept != null) {
        var url = path.concat('?category=' + $scope.selectDept.id);
        $http.get(url)
            .success(function(data, headers) {
              $scope.conList = data;
            })
            .error(function(data, headers) {
            });
      }
    };

    $scope.delete = function(key) {
      var confirmed = confirm('Are you sure to delete this link?');

      if (confirmed) {
        var url = path.concat('/' + key);

        $http.delete(url)
            .success(function(data, headers) {
              $scope.query();
            })
            .error(function(data, headers) {
            });
      }
    };

    $scope.edit = function(con) {
      //REF: https://angular-ui.github.io/bootstrap/ (modal)
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'edit-concentration.html',
        controller: 'EditConcentrationController',
        controllerAs: 'editConcentration',
        resolve: {
          con: function() {
            return con;
          },
        },
      });

      modalInstance.result.then(function(result) {
        $timeout($scope.query(), 2000);
        $scope.query(); //reload list
      }, function() {

        console.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.showAddMajorForm = function() {
      vm.showAddMajor = !vm.showAddMajor;
      vm.error = '';
      vm.formAddNewMajor.$setPristine();
      vm.newMajor = angular.copy(vm.newEmptyMajor);
      vm.addSucceed = false;
      //vm.getSchool();
    };

    vm.saveNewMajor = function() {
      var formData = new FormData();
      vm.uploading = true;
      for(var prop in vm.newMajor) {
        formData.append(prop, vm.newMajor[prop]);
      }
      $http.post(path.concat('/'), formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
          })
          .success(function(data) {
            console.log("success")
            vm.uploading = false;
            vm.formAddNewMajor.$setPristine();
            vm.newMajor = angular.copy(vm.newEmptyMajor);
            vm.addSucceed = true;
          })
          .error(function(err) {
            console.log("err")
            vm.uploading = false;
            vm.error = err.message;
            console.log('[Save new school error]', err);
          });
    };
  }

})();
