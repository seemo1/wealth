(function() {

  angular.module('fdt.contest', [
      'ngRoute',
      'ui.bootstrap',
      'ui.bootstrap.tabs',
      'fdt.contest.add',
      'fdt.contest.edit',
      'fdt.service.settings',])
      .controller('ContestController', ContestController);

  function ContestController($http, $scope, $timeout, settingsService) {
    var vm = this;
    var logTag = '[Contest Controller]';
    vm.versionPath = '/contest/v0';
    vm.contestList = []; // 查詢結果
    vm.filteredContest = [];
    vm.showAddContest = false;
    vm.showEditContest = false;
    vm.strFilter = '';
    vm.loadingInfo = 'Please wait... Loading contest information';
    vm.clickView = 'plan'; // 記錄用戶現在是點擊哪一個分頁
    vm.memberShowOnly = 'N'; // 現在是不是只顯查看參賽者清單的部分

    vm.memberList = []; // 參賽者名單
    vm.memberShowTitle = '';

    //TODO: RENAME!!!!!
    vm.ClientStartTime = '-'; /* 如果設定值沒設定好,前端就會報錯 */
    vm.ClientEndTime = '-';

    settingsService.get('Contest', 'ClientStartTime')
            .success(function(data) {
              $timeout(function() {
                if (!isNaN(parseInt(data))) {
                  vm.ClientStartTime = data;

                  //console.log('vm.ClientStartTime' , vm.ClientStartTime );
                  $scope.$apply();
                }
              }, 0);
            })
            .error(function(err) {
              console.log(err);
            });

    settingsService.get('Contest', 'ClientEndTime')
            .success(function(data) {
              $timeout(function() {
                if (!isNaN(parseInt(data))) {
                  vm.ClientEndTime = data;

                  //console.log('vm.ClientEndTime' , vm.ClientEndTime );
                  $scope.$apply();
                }
              }, 0);
            })
            .error(function(err) {
              console.log(err);
            });

    $scope.$on('closeAddContest', function() {
      console.log(logTag, 'closeAddContest');

      //vm.getContest();
      vm.getPlannedContest();
      vm.showAddContestForm();
    });

    $scope.$on('closeEditContest', function() {
      console.log(logTag, 'closeEditContest');
      vm.showEditContestForm();
    });

    //vm.getContest = function () {
    //    console.log(logTag, 'getContest');
    //    $http.get(vm.versionPath)
    //        .success(function (data) {
    //            console.log(logTag, 'getContest', 'done', data);
    //            _.forEach(data, function (d) {
    //                d.selectedImage = contest.icon_image;
    //                d.selectedImageRegion = 'en';
    //                d.start_date_time = vm.convertTime(d.start_date_time);
    //                d.end_date_time = vm.convertTime(d.end_date_time);
    //            });
    //            vm.contestList = queryOutputFilter(data , vm.strFilter );
    //            //vm.contestList = data;
    //            //vm.filter('draft');
    //        })
    //        .error(function (err) {
    //            console.log(logTag, 'getContest', 'error', err);
    //        });
    //};

    vm.switchImage = function(id, imgRegion) {
      console.log(logTag, 'switch image', id, imgRegion);
      var selectedSchool = _.where(vm.contestList, {contest_id: id})[0];
      console.log(selectedSchool);
      if (imgRegion == 'en') {
        selectedSchool.selectedImage = selectedSchool.icon_image;
        selectedSchool.selectedImageRegion = 'en';
        return;
      }

      var imgCode = imgRegion + '_icon_image';
      selectedSchool.selectedImage = selectedSchool[imgCode];
      selectedSchool.selectedImageRegion = imgRegion;
    };

    vm.showAddContestForm = function() {
      vm.showEditContest = false;
      vm.showAddContest = !vm.showAddContest;
    };

    vm.showEditContestForm = function() {
      vm.showAddContest = false;
      vm.showEditContest = !vm.showEditContest;
    };

    vm.edit = function(contestId) {
      var selectedContest = _.where(vm.contestList, {contest_id: contestId})[0];
      console.log('edit');
      $scope.$broadcast('editContest', selectedContest);
      vm.showEditContestForm();
    };

    vm.delete = function(contestId) {
      var selectedContest = _.where(vm.contestList, {contest_id: contestId})[0];
      console.log(selectedContest);
      if (confirm('Are you sure you want to delete contest ' + selectedContest.name)) {
        $http.delete(vm.versionPath + '/' + contestId)
                    .success(function() {
                      vm.getPlannedContest();

                      //vm.getContest();
                    })
                    .error(function(err) {
                      console.log(logTag, 'delete', 'error', err);
                    });
      }
    };

    vm.publish = function(contestId) {
      if (confirm('Are you sure you want to publish this contest?')) {
        $http.put(vm.versionPath + '/publish', {contestId: contestId})
                    .success(function() {
                      vm.getPlannedContest();
                    })
                    .error(function(err) {
                      console.log(logTag, 'publish', 'error', err);
                    });
      }
    };

    //TODO: should be a service
    vm.convertTime = function(timeStr, timeRange) {
      var changeDateTime = moment(timeStr).add(timeRange, 'minute').format('YYYY-MM-DD HH:mm:ss'); /* 現有的時間 */
      if (!moment(changeDateTime).isValid()) {
        changeDateTime = ''; /* 檢查出來的時間如果有錯,就返回空值 */
      }

      return changeDateTime;
    };

    //TODO: duplicate codes!!
    vm.getReadyContest = function() {
      resetContestInfoDiv();
      $http.get('/backend/contest/readyContest')
                .success(function(data) {
                  console.log(logTag, 'getReadyContest', 'done', data);
                  _.forEach(data, function(d) {
                    d.selectedImage = d.icon_image;
                    d.selectedImageRegion = 'en';
                    d.tradeStartDatetime = vm.convertTime(d.start_date_time, 0);
                    d.tradeEndDatetime = vm.convertTime(d.end_date_time, 0);
                    d.clientStartDatetime = vm.convertTime(d.start_date_time, vm.ClientStartTime);
                    d.clientEndDatetime = vm.convertTime(d.end_date_time, vm.ClientEndTime);
                  });

                  vm.contestList = queryOutputFilter(data, vm.strFilter);
                })
                .error(function(err) {
                  console.log(logTag, 'getReadyContest', err);
                });
    };

    vm.getPlannedContest = function() {
      resetContestInfoDiv();
      $http.get('/backend/contest/plannedContest')
                .success(function(data) {
                  console.log(logTag, 'getPlannedContest', 'done', data);
                  _.forEach(data, function(d) {
                    d.selectedImage = d.icon_image;
                    d.selectedImageRegion = 'en';
                    d.tradeStartDatetime = vm.convertTime(d.start_date_time, 0);
                    d.tradeEndDatetime = vm.convertTime(d.end_date_time, 0);
                    d.clientStartDatetime = vm.convertTime(d.start_date_time, vm.ClientStartTime);
                    d.clientEndDatetime = vm.convertTime(d.end_date_time, vm.ClientEndTime);
                  });

                  vm.contestList = queryOutputFilter(data, vm.strFilter);
                })
                .error(function(err) {
                  console.log(logTag, 'getPlannedContest', err);
                });
    };

    vm.getCancelledContest = function() {
      resetContestInfoDiv();
      $http.get('/backend/contest/cancelledContest')
                .success(function(data) {
                  console.log(logTag, 'getCancelledContest', 'done', data);
                  _.forEach(data, function(d) {
                    d.selectedImage = d.icon_image;
                    d.selectedImageRegion = 'en';
                    d.tradeStartDatetime = vm.convertTime(d.start_date_time, 0);
                    d.tradeEndDatetime = vm.convertTime(d.end_date_time, 0);
                    d.clientStartDatetime = vm.convertTime(d.start_date_time, vm.ClientStartTime);
                    d.clientEndDatetime = vm.convertTime(d.end_date_time, vm.ClientEndTime);
                  });

                  vm.contestList = queryOutputFilter(data, vm.strFilter);
                })
                .error(function(err) {
                  console.log(logTag, 'getCancelledContest', err);
                });
    };

    vm.getOnGoingContest = function() {
      resetContestInfoDiv();
      $http.get('/backend/contest/onGoingContest')
                .success(function(data) {
                  console.log(logTag, 'getOnGoingContest', 'done', data);
                  _.forEach(data, function(d) {
                    d.selectedImage = d.icon_image;
                    d.selectedImageRegion = 'en';
                    d.tradeStartDatetime = vm.convertTime(d.start_date_time, 0);
                    d.tradeEndDatetime = vm.convertTime(d.end_date_time, 0);
                    d.clientStartDatetime = vm.convertTime(d.start_date_time, vm.ClientStartTime);
                    d.clientEndDatetime = vm.convertTime(d.end_date_time, vm.ClientEndTime);
                  });

                  vm.contestList = queryOutputFilter(data, vm.strFilter);
                })
                .error(function(err) {
                  console.log(logTag, 'getOnGoingContest', err);
                });
    };

    vm.getFinishedContest = function() {
      resetContestInfoDiv();
      $http.get('/backend/contest/finishedContest')
                .success(function(data) {
                  console.log(logTag, 'getFinishedContest', 'done', data);
                  _.forEach(data, function(d) {
                    d.selectedImage = d.icon_image;
                    d.selectedImageRegion = 'en';
                    d.tradeStartDatetime = vm.convertTime(d.start_date_time, 0);
                    d.tradeEndDatetime = vm.convertTime(d.end_date_time, 0);
                    d.clientStartDatetime = vm.convertTime(d.start_date_time, vm.ClientStartTime);
                    d.clientEndDatetime = vm.convertTime(d.end_date_time, vm.ClientEndTime);
                  });

                  vm.contestList = queryOutputFilter(data, vm.strFilter);
                })
                .error(function(err) {
                  console.log(logTag, 'getFinishedContest', err);
                });
    };

    vm.behavior = {
      tagViewClick: function(viewName) {
        // --> 記錄現在的View 是在哪一個
        vm.clickView = viewName;
      },

      memberClick: function(contestId, contestName) {
        // --> 點擊查看比賽的參賽用戶
        vm.memberShowOnly = 'Y';
        vm.getData.ContestJoinList(contestId, contestName);
      },

      leaveViewMember: function() {
        // --> 不想看比賽了，所以轉身離開
        vm.memberShowOnly = 'N';
        vm.memberList = []; // 養成好習慣，要記得清空
        vm.memberShowTitle = '';
      },

    };

    vm.getData = {
      ContestJoinList: function(contestId, contestName) {
        // --> 得到參賽者的的名單(傳送ContestID 跟 現在用戶點擊的tag名稱)
        nowTagView = vm.clickView;
        console.log(contestId);
        console.log(contestName);
        vm.memberShowTitle = contestName;
        $http.get('/backend/contest/getContestJoinUserList?contest_id=' + contestId + '&tag=' + nowTagView)
                .success(function(data) {
                  console.log(logTag, 'getContestJoinedUser', 'done', data);

                  if (data.code == 200) {
                    vm.memberList = queryOutputFilter(data.content, vm.strFilter);
                    var index_number = 1;
                    _.forEach(vm.memberList, function(d) {
                      console.log(d);
                      d.NUMBER = index_number;
                      d.JOIN_DATE = vm.convertTime(d.JOIN_DATE, 0);
                      index_number = index_number + 1;
                    });
                  }else {
                    vm.memberList = [];
                  }
                })
                .error(function(err) {
                  console.log(logTag, 'getOnGoingContest', err);
                });
      },

      getRedisData: function() {

      },
    };

    function queryOutputFilter(queryContent, strFilter) {
      // --> 輸出前如果有設定查詢條件的話要過濾一下
      var newQeruy = [];
      if (queryContent.length > 0) {
        var querySum = queryContent.length;
        for (var i = 0; i < querySum; i++) {
          if (strFilter) {
            if (queryContent[i].name) {
              if (queryContent[i].name.indexOf(strFilter) > -1) {
                newQeruy.push(queryContent[i]);
              }
            }else if (queryContent[i].cn_name) {
              if (queryContent[i].cn_name.indexOf(strFilter) > -1) {
                newQeruy.push(queryContent[i]);
              }
            }else if (queryContent[i].tw_name) {
              if (queryContent[i].tw_name.indexOf(strFilter) > -1) {
                newQeruy.push(queryContent[i]);
              }
            }
          }else {
            newQeruy.push(queryContent[i]);
          }
        }
      }

      updateContestInfoDiv(newQeruy); // 更新查詢狀態
      return newQeruy;
    }

    function updateContestInfoDiv(newQeruy) {
      // --> 輸出後的提示字元
      if (newQeruy.length == 0) {
        vm.loadingInfo = 'No Contest Found';
      }
    }

    function resetContestInfoDiv() {
      // --> 輸出前的提示字元
      vm.loadingInfo = 'Please wait... Loading contest information';
    }
  }

})();
