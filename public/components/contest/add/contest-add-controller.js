(function() {

  angular.module('fdt.contest.add', ['mgo-angular-wizard', 'fdt.directive.uploadFile'])
      .controller('ContestAddController', ContestAddController)
      .directive('numberOnly', NumberOnlyDirective)
      .directive('customOnChange', CustomOnChangeDirective); //INFO: shouldn't be here but this is special case

  function ContestAddController($scope, WizardHandler, $http, settingsService, $timeout, $scope) {
    var vm = this;
    var logTag = '[ContestAddController]';
    vm.versionPath = '/contest/v0';
    vm.title = 'add contest here';
    vm.startHour = '22';
    vm.endHour = '22';
    vm.startDate = moment().format('YYYY-MM-DD');
    vm.endDate = moment().format('YYYY-MM-DD');
    vm.minDate = new Date();
    vm.formPrize = $scope.formPrize;
    vm.formGeneral = $scope.formGeneral;
    vm.formGeneralTw = $scope.formGeneralTw;
    vm.formGeneralCn = $scope.formGeneralCn;
    vm.formAdditional = $scope.formAdditional;
    vm.creating = false;
    vm.succeed = false;

    //this naming following database field name
    vm.newContest = {
      start_date_time: 'CCC',
      end_date_time: '',
      name: '',
      title: '',
      icon_image: null,
      description: '',
      cn_name: '',
      cn_title: '',
      cn_icon_image: null,
      cn_description: '',
      tw_name: '',
      tw_title: '',
      tw_icon_image: null,
      tw_description: '',
      status: '',
      join_cond_free: '',
      join_cond_school_key: '',
      join_cond_user_country: '',
      join_cond_school_region: '',
      join_cond_mail: '',
      region: '',
      reward_base_money: '',
      reward_max_money: '',
      reward_coin_mark: '',
      reward_coin_name: '',
      reward_bonus_ratio: '',
      reward_base_join_total: 0,
    };
    vm.emptyNewContest = angular.copy(vm.newContest);

    vm.contestIconChanged = function(event) {
      var files = event.target.files[0];
      var iconId = event.target.id;
      console.log(logTag, 'contestIconChanged', iconId);
      if (iconId == 'icon_image') {
        vm.formGeneral.$setValidity('icon_image', true);
      }

      vm.newContest[iconId] = files;
      $scope.$apply();
    };

    /* 觸發時間點 : contest-add-form.html  */
    /* 使用情境 : 讀取 contest 的設定值 */
    vm.getSettings = function() {
      settingsService.get('Contest', 'StartTime')
                .success(function(data) {
                  $timeout(function() {
                    vm.newContest.start_date_time = data;
                    $scope.$apply();
                  }, 0);
                })
                .error(function(err) {

                });

      settingsService.get('Contest', 'EndTime')
                .success(function(data) {
                  $timeout(function() {
                    vm.newContest.end_date_time = data;
                    $scope.$apply();
                  }, 0);
                })
                .error(function(err) {

                });
    };

    /* 觸發時間點 :  contest-add-form.html  */
    /* 使用情境 : 選完contest 的開始以及結束時間後,點擊"Next step" 的按鈕 , 把時間格式整理一下 */
    vm.setTime = function() {
      //vm.newContest.start_date_time = moment(vm.startDate).format('YYYY-MM-DD') + ' ' + vm.newContest.start_date_time;
      vm.newContest.start_date_time = moment(vm.startDate).format('YYYY-MM-DD') + ' 00:00:00';
      vm.newContest.start_date_time = moment(vm.newContest.start_date_time).format('YYYY-MM-DD HH:mm:ss');

      //vm.newContest.end_date_time = moment(vm.endDate).format('YYYY-MM-DD') + ' ' + vm.newContest.end_date_time;
      vm.newContest.end_date_time = moment(vm.endDate).format('YYYY-MM-DD') + ' 00:00:00';
      vm.newContest.end_date_time = moment(vm.newContest.end_date_time).format('YYYY-MM-DD HH:mm:ss');

      localStorage.setItem('start_date_time', vm.newContest.start_date_time);
      localStorage.setItem('end_date_time', vm.newContest.end_date_time);

      if (vm.newContest.end_date_time < vm.newContest.start_date_time) {
        return alert('開始時間不能大於結束時間');
      }

      console.log(logTag, 'setTime', vm.newContest);
      WizardHandler.wizard().next(); /* 時間檢查沒問題前端會換頁 */
    };

    /* 觸發時間點 :  contest-general-form.html  */
    /* 使用情境 : 編輯完 比賽內容 以及 門檻限制後  */
    vm.previousStep = function() {
      var startDateTime = localStorage.getItem('start_date_time');
      var endDateTime = localStorage.getItem('end_date_time');
      vm.newContest.startDate = moment(startDateTime).format('YYYY-MM-DD').toString();
      vm.newContest.endDate = moment(endDateTime).format('YYYY-MM-DD').toString();
      vm.newContest.start_date_time = moment(startDateTime).format('HH:mm:ss').toString();
      vm.newContest.end_date_time = moment(endDateTime).format('HH:mm:ss').toString();

      WizardHandler.wizard().previous();
    };

    /* 觸發時間點 :  contest-prize-form.html  */
    /* 使用情境 : 設定完 比賽獎金項目之後 */
    vm.setPrize = function() {
      var tempQuota = angular.copy(vm.newContest.reward_bonus_ratio);
      tempQuota = tempQuota.split(',').reduce(function(a, b) {
        return parseInt(a) + parseInt(b);
      });

      if (tempQuota != 100) {
        return alert('Bonus quota sum must be equal 100!!!');
      }

      console.log(logTag, 'setPrize', vm.newContest);
      WizardHandler.wizard().next();
    };

    /* 觸發時間點 :  contest-add-form.html  */
    /* 使用情境 : 比賽資訊都填寫完成了,準備確認新增 */
    vm.save = function() {
      if (confirm('Are you sure you want to create this contest?')) {

        console.log(logTag, 'save', vm.newContest);
        vm.creating = true;
        var formData = new FormData();

        for (var prop in vm.newContest) {
          if ( ['startDate','endDate'].indexOf(prop) == -1 ) {
            formData.append(prop, vm.newContest[prop]);
          }
        }

        $http.post(vm.versionPath, formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
        })
                    .success(function(data, headers) {
                      console.log(logTag, 'save', 'done', data);
                      vm.creating = false;
                      vm.succeed = true;
                    })
                    .error(function(data, headers) {
                      vm.uploading = false;
                      vm.error = data.message;
                      console.log(logTag, 'save', 'err', data);
                      vm.creating = false;
                    });
      }
    };

    vm.closeAddContestForm = function() {
      console.log(logTag, 'closeAddContestForm');
      vm.newContest = angular.copy(vm.emptyNewContest);
      vm.succeed = false;
      WizardHandler.wizard().finish();
      $scope.$emit('closeAddContest', '');
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
