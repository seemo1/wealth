(function() {
  angular.module('fdt.student', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'fdt.directive.imageSlider', ])
      .config(fdtRouter)
      .controller('StudentController', StudentController);
  fdtRouter.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
  function fdtRouter($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.defaults.timeout = 60000;
    $locationProvider.html5Mode({enabled: true, requireBase: false});
  }

  function StudentController($http, $scope, $modal, $timeout, $route) {

    var baseUrl = '/backend/user';
    var logTag = '[Student Controller]';
    var vm = this;
    var nowYear = new Date().getFullYear();
    vm.selectTab = '';
    vm.yearArray = [nowYear, nowYear + 1, nowYear + 2, nowYear + 3, nowYear + 4];
    vm.monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    vm.selectYear = nowYear;
    vm.selectDefaultYear = (nowYear + 2).toString();
    vm.selectDefaultMonth = "6";
    vm.selectYearArray = [];
    vm.selectMonthArray = [];

    //vm.ExpireDate = [];
    vm.ExpireDateYear = [];
    vm.ExpireDateMonth = [];
    vm.divHide = [];
    vm.placeholder = 'userId/userName';
    vm.SchoolTab = [];
    vm.selectedSchool = {};
    vm.schoolTatolCount = 0;
    vm.selectData = [];
    vm.oriData = '';

    vm.select = function(value) {
      vm.selectTab = value;
      var formData = {
        is_verified: value,
      };
      $http.get(baseUrl.concat('/student'), {params: formData})
        .success(function(data) {
          vm.data = data;
          vm.oriData = data;
          vm.divHide = [];
        })
        .error(function(err) {
          console.error(logTag, 'getCertified', err);
        });
    };

    vm.selectSchoolTab = function(value) {
      var formData = {
        is_verified: value,
      };
      $http.get(baseUrl.concat('/selectSchoolTab'), {params: formData})
        .success(function(data) {
          vm.schoolTatolCount = 0;
          _.forEach(data, function(row) {
            vm.schoolTatolCount = vm.schoolTatolCount + row.school_count;
          });

          vm.SchoolTab = data;
          vm.selectedSchool = data[0];
        })
        .error(function(err) {
          console.error(logTag, 'getCertified', err);
        });
    };

    vm.verify = function(key) {
      var formData = {
        user_id: key.toString(),
        is_verified: '2',
        verify_date: vm.ExpireDateYear[key] + '-' + vm.ExpireDateMonth[key],
      };
      $http.put(baseUrl.concat('/schoolProfile'), formData)
        .success(function() {
          vm.divHide[key] = true;
        })
        .error(function(err) {
          console.error(logTag, 'getCertified', err);
        });
    };

    vm.reject = function(key, data) {
      var formData = {
        user_id: key.toString(),
        is_verified: '3',
        reject_reason: data.toString(),
      };
      $http.put(baseUrl.concat('/schoolProfile'), formData)
        .success(function(data) {
          vm.divHide[key] = true;
        })
        .error(function(err) {
          console.log(err.message);
          console.error(logTag, 'getCertified', err);
        });
    };

    vm.search = function() {
      var formData = {
        name: vm.searchUserFrom.searchName,
        is_verified: vm.selectTab,
        select_type: vm.searchUserFrom.radio,
      };
      $http.get(baseUrl.concat('/student'), {params: formData})
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

    vm.schoolSelected = function() {
      vm.selectData = [];
      if (vm.schoolSelectFrom != '') {
        _.forEach(vm.oriData, function(row) {
          if (row.school_key == vm.schoolSelectFrom) {
            vm.selectData.push(row);
          }
        });

        vm.data = vm.selectData;
      }else {
        vm.data = vm.oriData;
      }
    };

    vm.ExpireDate = function(userId, verifyDate) {
      var dateTmp = verifyDate.split('-');
      console.log('dateTmp[0]=', dateTmp[0]);
      console.log('dateTmp[1]=', dateTmp[1]);
      vm.ExpireDateYear[userId] = dateTmp[0] ? dateTmp[0] : vm.selectDefaultYear;
      vm.ExpireDateMonth[userId] = dateTmp[1] ? dateTmp[1] : vm.selectDefaultMonth;
      console.log('vm.ExpireDateYear[userId]=', vm.ExpireDateYear[userId]);
      console.log('vm.ExpireDateMonth[userId]=', vm.ExpireDateMonth[userId]);
    };

  }
})();
