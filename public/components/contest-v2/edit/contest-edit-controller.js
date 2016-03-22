(function() {

  angular.module('fdt.contestV2.edit', [])
      .controller('contestHtmlEdit', ContestController);

  function ContestController($http, $scope, $timeout, settingsService , contestService) {
    var httpPath = '/backend/contests/';
    $scope.range = function(n) {
      var list = [];
      for(var i = 0 ; i < n ; i++ ){
        list.push(i);
      }
      return list;
    };
    $scope.edit = {}; /* 宣告一個新的容器,避免跟其他 controller混淆影響 */
    $scope.viewController = {} ; /* 畫面變數資訊 */
    $scope.editContestId  = angular.copy( localStorage.getItem('contestId') ); /* 等等編輯送出去的id要用這個送出*/
    $scope.editMarketCode = angular.copy( localStorage.getItem('marketCode') );
    $scope.loadingStatus = 'loading';  // loading , fail , done
    /*
      [查詢]
      1. http 抓取資料
      2. 資料抓回來後, $scope 的參數一律用 loop迴圈 設定一遍
      3. 等後頁面編輯行為

      [送出]
      1. 頁面觸發 送出事件
      2. 將整包資料驗證過一次
      3. 送出請求
     */
    $scope.init = function(contestId,marketCode){
      /*
          頁面初始化
          loading-page/edit-init
          -> 成功

          -> 失敗defaultLanguage
            loading-edit-fail
            顯示失敗頁面
       */
      $scope.templateEdit = '/components/contest-v2/loading-page/contest-edit-init.html';
      contestService.justHttp($http,'editInit','GET', httpPath + 'contestSocialCenterQuery/'+marketCode+'/?contest_id='+contestId, '', function (response) {
        console.log(response);
        var httpStatus = response.status;
        var data       = response.data ;
        if (httpStatus !== 200 || data.length == 0 ) {
          $scope.loadingStatus = 'fail';
        } else {
          $scope.loadingStatus = 'done';
          var contest = data[0];
          for( var key in contest){ /* 把查詢回來的資料塞到 $scope 裡面 */
            console.log(key);
            $scope.edit[key] = contest[key];
          }
          $scope.viewController['languageSelect']  = $scope.edit['default_language'] ; /* 預設語系呈現相對應的編輯畫面 */

          $scope.viewController['edit_max_account'] = (  $scope.edit['join_cond_max_money'] != '' ) ? 'Y' : 'N' ;
          $scope.viewController['edit_min_account'] = (  $scope.edit['join_cond_least_money'] != '' ) ? 'Y' : 'N' ;

          $scope.viewController['edit_school_key'] = (  $scope.edit['join_cond_school_key'] != '' ) ? 'Y' : 'N' ;
          $scope.viewController['edit_school_region'] = (  $scope.edit['join_cond_school_region'] != '' ) ? 'Y' : 'N' ;

          $scope.viewController['edit_stop_loss_point'] = (  $scope.edit['ongoing_setting_stop_loss_point'] != '' ) ? 'Y' : 'N' ;
          $scope.viewController['edit_join_user_limit'] = (  $scope.edit['upcoming_setting_activation_user_total'] != '' ) ? 'Y' : 'N' ;
        }
      });
    }

    $scope.goToSubmit = function(file) {
      /* 修改比賽 */
      var editData = angular.copy($scope.edit);
      var viewData = angular.copy($scope.viewController);
      var contestId  = $scope.editContestId ;
      var marketCode = $scope.editMarketCode ;
      var postPath = '/backend/contests/contestSocialCenterUpdate/' + marketCode + '/' + contestId + '/';
      //var uploadPath = '/backend/contests/imageUpload/';
      if ( typeof(contestService.contestCondCheck(editData) ) == 'undefined' ){
        return '';
      }

      var formData = new FormData();
      if (confirm("資料都填寫完畢了？")) {
        /* 根據 UI 的邏輯設置,處理對應的欄位 */
        if ( viewData['edit_max_account'] == 'N' ){
          editData['join_cond_max_money'] = '';
        }
        if ( viewData['edit_min_account'] == 'N' ){
          editData['join_cond_least_money'] = '';
        }
        if ( viewData['edit_school_key'] == 'N' ){
          editData['join_cond_school_key'] = '';
        }
        if ( viewData['edit_school_region'] == 'N' ){
          editData['join_cond_school_region'] = '';
        }
        if ( viewData['edit_stop_loss_point'] == 'N' ){
          editData['ongoing_setting_stop_loss_point'] = '';
        }
        if ( viewData['edit_join_user_limit'] == 'N' ){
          editData['upcoming_setting_activation_user_total'] = '';
        }
        console.log(editData);

        contestService.contestCoreDataMerge(contestId,formData,editData,'edit'); // 比賽核心資訊 資料組合
        contestService.contestNoticeDataMerge(contestId,formData,editData,'edit'); // 比賽多語系 資料組合
        contestService.getFile('en_file',formData,en_image); // EN 圖片 資料擷取
        contestService.getFile('cn_file',formData,cn_image); // CN 圖片 資料擷取
        contestService.getFile('tw_file',formData,tw_image); // TW 圖片 資料擷取

        //$scope.viewTag.isUpload = 'yes';
        contestService.justHttp($http,'updateContest','PUT',postPath,formData,function(response){
          var httpStatus = response.status;
          var data       = response.data ;
          if (httpStatus === 200 && data == 'done' ){
            alert(' 編輯成功！ ');
            //$scope.viewTag.isUpload = 'warning'; // 關閉上傳資料頁面，把剛剛新增的畫面喚醒,然後跳出警告訊息
          } else {
            alert(' 編輯失敗... ');
            //$scope.viewTag.isUpload = 'done'; // 關閉上傳資料頁面,別讓用戶在編輯資料了
          }
        });
      }
    };
  }

})();
