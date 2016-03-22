(function() {

  angular.module('fdt.contest.edit', ['fdt.directive.uploadFile'])
      .controller('ContestEditController', ContestEditController)
      .directive('numberOnly', NumberOnlyDirective)
      .directive('customOnChange', CustomOnChangeDirective);//INFO: shouldn't be here but this is special case

  function ContestEditController($scope, $http, $route) {
    var vm = this;
    var logTag = '[ContestEditController]';
    vm.versionPath = '/contest/v0/edit';
    vm.contest = {};
    vm.startHour = '';
    vm.endHour = '';
    vm.startDate = '';
    vm.endDate = '';
    vm.startSecond = '';
    vm.endSecond = '';
    vm.minDate = new Date();
    vm.formPrize = $scope.formPrize;
    vm.formGeneral = $scope.formGeneral;
    vm.formGeneralTw = $scope.formGeneralTw;
    vm.formGeneralCn = $scope.formGeneralCn;
    vm.formAdditional = $scope.formAdditional;
    vm.updating = false;

    $scope.$on('editContest', function(e, selectedContest) {
      console.log(logTag, 'edit contest received');
      vm.contest = angular.copy(selectedContest);
      vm.contest.tradeStartDatetime = moment(vm.contest.tradeStartDatetime).format('YYYY-MM-DD');
      vm.contest.tradeEndDatetime = moment(vm.contest.tradeEndDatetime).format('YYYY-MM-DD');
    });

    vm.save = function() {
      console.log('save');
      if (confirm('Are you sure you want to update this contest?')) {
        vm.updating = true;

        var formData = new FormData();
        vm.contest.start_date_time = moment(vm.contest.tradeStartDatetime).format('YYYY-MM-DD').toString();
        vm.contest.end_date_time = moment(vm.contest.tradeEndDatetime).format('YYYY-MM-DD').toString();
        console.log(logTag, 'contest', vm.contest);
        for (var prop in vm.contest) {
          if (prop !== 'selectedImage' && prop !== 'selectedImageRegion' && prop !== 'publish_time' && prop !== 'clientEndDatetime'
              && prop !== 'clientStartDatetime' && prop !== 'tradeEndDatetime' && prop !== 'tradeStartDatetime'
              ) {
            formData.append(prop, vm.contest[prop]);
          }
        }

        //console.log('formData' , formData);
        $http.post(vm.versionPath, formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
        })
                    .success(function(data) {
                      console.log(logTag, 'edit', 'done', data);
                      alert('Contest updated!');
                      location.reload(); /* 把整個頁面刷新重新抓資料 */

                      //$route.reload();
                    })
                    .error(function(err) {
                      console.error(err);
                      alert(err);
                      vm.updating = false;
                    });
      }
    };

    vm.cancel = function() {
      $scope.$emit('closeEditContest');
    };

    vm.contestIconChanged = function(event) {
      var files = event.target.files[0];
      var iconId = event.target.id;
      console.log(logTag, 'contestIconChanged', iconId);
      if (iconId == 'icon_image') {
        vm.formGeneral.$setValidity('icon_image', true);
      }

      vm.contest[iconId] = files;
      $scope.$apply();
    };

  }

  function NumberOnlyDirective() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return '';
          var transformedInput = inputValue.replace(/[^0-9\,]/g, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      },
    };
  }

  //INFO: special directive to handle file
  //the upload file directive doesn't work properly
  //probably because of the wizard directive
  function CustomOnChangeDirective() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      },
    };
  }
})();
