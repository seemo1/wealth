(function() {

  angular.module('fdt.school', [
      'ngRoute',
      'ui.bootstrap',
      'ui.bootstrap.tabs',
      'fdt.directive.uploadFile',
      'fdt.school.edit',
      'fdt.service.school',
    ])
      .controller('SchoolController', SchoolController);

  function SchoolController($http, $scope, $modal, $timeout) {

    var baseUrl = '/backend/school';
    var logTag = '[Student Controller]';
    var vm = this;

    vm.versionPath = '/backend/school';
    vm.showAddSchool = false;
    vm.formAddNewSchool = $scope.formAddNewSchool;
    vm.newSchool = {
      en_name: '',
      sc_name: '',
      tc_name: '',
      domains: '',
      region: '',
      display: 'N',
      school_key: '',
      sc_pinyin: '',
      flag: null,
    };
    vm.newEmptySchool = angular.copy(vm.newSchool);
    vm.schoolList = [];
    vm.addSucceed = false;
    vm.query = {
      name: '',
      region: '',
      display: '',
    };
    vm.uploading = false;
    vm.error = '';
    vm.selectedSchool = {};

    vm.showAddSchoolForm = function() {
      vm.showAddSchool = !vm.showAddSchool;
      vm.error = '';
      vm.formAddNewSchool.$setPristine();
      vm.newSchool = angular.copy(vm.newEmptySchool);
      vm.addSucceed = false;
      //vm.getSchool();
    };

    vm.saveNewSchool = function() {
      var formData = new FormData();
      vm.uploading = true;
      if ($scope.flagFile) {
        formData.append('file', $scope.flagFile);
      }
      //formData.school_key = vm.newSchool.school_key;
      //formData.en_name = vm.newSchool.en_name;
      //formData.sc_name = vm.newSchool.sc_name;
      //formData.sc_pinyin = vm.newSchool.sc_pinyin;
      //formData.tc_name = vm.newSchool.tc_name;
      //formData.region = vm.newSchool.region;
      //formData.domains = vm.newSchool.domains;
      //formData.is_del = vm.newSchool.is_del;
      for(var prop in vm.newSchool) {
        formData.append(prop, vm.newSchool[prop]);
      }

      $http.post(baseUrl.concat('/'), formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
          })
        .success(function(data) {
          console.log("success")
          vm.uploading = false;
          vm.formAddNewSchool.$setPristine();
          vm.newSchool = angular.copy(vm.newEmptySchool);
          vm.addSucceed = true;
        })
        .error(function(err) {
          console.log("err")
          vm.uploading = false;
          vm.error = err.message;
          console.log('[Save new school error]', err);
        });
    };

    vm.edit = function(schoolKey) {
      //vm.selectedSchool = _.where(vm.schoolList, {school_key: schoolKey})[0];

      $http.get(baseUrl.concat('/' + schoolKey))
        .success(function(data) {
          var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'edit-school.html',
            controller: 'EditSchoolController',
            controllerAs: 'editSchool',
            resolve: {
              school: function() {
                return data[0];
              },
            },
          });

          modalInstance.result.then(function(result) {
          }, function() {

            //$timeout(vm.getSchool(), 1000);
            console.info('Modal dismissed at: ' + new Date());
          });
        })
        .error(function(err) {
          console.error(logTag, 'getCertified', err);
        });
    };


    vm.search = function() {
      var formData = {
        name: vm.searchFrom.searchName,
        select_type: vm.searchFrom.select,
      };
      console.log(formData);
      $http.get(baseUrl.concat('/'), {params: formData})
        .success(function(data) {
          vm.data = data;
        })
        .error(function(err) {
          console.error(logTag, 'getCertified', err);
        });
    };

    vm.radioChange = function(value) {
      vm.placeholder = value;
    };

    vm.createGroup = function(schoolData){
      var formData = new FormData();
      for(var prop in schoolData) {
        formData.append(prop, schoolData[prop]);
      }
      $http.post('/backend/group/school', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
          })
          .success(function(data) {
            vm.search();
          })
          .error(function(err) {
            console.error(logTag, 'getCertified', err);
          });
    }
  }

})();
