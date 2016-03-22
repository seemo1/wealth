(function() {

  angular.module('fdt.contestV2.add', [])
      .controller('contestHtmlAdd', ContestController);

  function ContestController($http, $scope, $timeout, settingsService , contestService) {
    $scope.range = function(n) {
      var list = [];
      for(var i = 0 ; i < n ; i++ ){
        list.push(i);
      }
      return list;
    };

    $scope.start_date_time = moment().format('YYYY-MM-DD') + ' 00:00:00';
    $scope.end_date_time = moment().add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00';

    $scope.en_name = '';
    $scope.en_title = '';
    $scope.en_content = '';
    $scope.en_reward = '';
    $scope.en_image = null;
    $scope.en_coin_mark = '';
    $scope.cn_name = '';
    $scope.cn_title = '';
    $scope.cn_content = '';
    $scope.cn_reward = '';
    $scope.cn_image = null;
    $scope.cn_coin_mark = '';
    $scope.tw_name = '';
    $scope.tw_title = '';
    $scope.tw_content = '';
    $scope.tw_reward = '';
    $scope.tw_image = null;
    $scope.tw_coin_mark = '';
    $scope.default_language = 'EN'; // 預設 EN 語系

    $scope.reward_model = '';
    $scope.award_item = 'A';  // 預設 A
    $scope.dynamic_reward_base_money = '';
    $scope.dynamic_reward_rise_money = '';
    $scope.dynamic_reward_max_money = '';
    $scope.fixed_reward_total_money = '';

    $scope.join_cond_enable = 'Y'; // 預設要填寫次要檢查條件
    $scope.join_cond_has_school = ''; // 這個根據 school_key 跟 school_region 做應對, 其中一個符合則為Y,反之為N
    $scope.join_cond_school_checking_before = 'Y';
    $scope.join_cond_has_phone = 'Y'; // 依照規格, 是必要檢查項目
    $scope.join_cond_school_key = '';
    $scope.join_cond_school_region = '';
    $scope.join_cond_before_the_end_day_can_not_join = '0';
    $scope.join_cond_least_money = '';

    $scope.ongoing_setting_stop_loss_point = '';
    $scope.upcoming_setting_activation_user_total = '';


    $scope.viewTag = {
      isUpload : 'no' // yes,no,warning,done
    };
    $scope.goToSubmit = function(file) {
      /* 新增比賽 */
      var marketCode = localStorage.getItem('marketCode');
      var postPath = '/backend/contests/contestSocialCenterCreate/' + marketCode + '/';
      //var uploadPath = '/backend/contests/imageUpload/';
      if ( typeof(contestService.contestCondCheck($scope) ) == 'undefined' ){
        return '';
      }

      var formData = new FormData();
      if (confirm("資料都填寫完畢了？")) {
        var contestId = contestService.getContestRandomId();
        contestService.contestCoreDataMerge(contestId,formData,$scope,'create'); // 比賽核心資訊 資料組合
        contestService.contestNoticeDataMerge(contestId,formData,$scope,'create'); // 比賽多語系 資料組合
        contestService.getFile('en_file',formData,en_image); // EN 圖片 資料擷取
        contestService.getFile('cn_file',formData,cn_image); // CN 圖片 資料擷取
        contestService.getFile('tw_file',formData,tw_image); // TW 圖片 資料擷取

        $scope.viewTag.isUpload = 'yes';
        contestService.justHttp($http,'createContest','POST',postPath,formData,function(response){
          var httpStatus = response.status;
          var data       = response.data ;
          if (httpStatus !== 200 || data != 'done' ){
            $scope.viewTag.isUpload = 'warning'; // 關閉上傳資料頁面，把剛剛新增的畫面喚醒,然後跳出警告訊息
          } else {
            $scope.viewTag.isUpload = 'done'; // 關閉上傳資料頁面,別讓用戶在編輯資料了
          }
        });
      }
    };
  }

})();
