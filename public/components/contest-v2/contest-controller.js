// http://stackoverflow.com/questions/15458609/execute-function-on-page-load
(function() {

  angular.module('fdt.contestV2.query', [
      'ngRoute',
      'ui.bootstrap',
      'ui.bootstrap.tabs',
      'fdt.contestV2.add',
      'fdt.contestV2.edit'])
      .controller('contestHtml', ContestController);

  function ContestController($http, $scope, $timeout) {
    var httpPath = '/backend/contests/';
    var timeZone = new Date();
    var timeZoneNumber = timeZone.getTimezoneOffset();
    $scope.timeZone = ((timeZoneNumber / 60) < 0) ? 'GMT+' + (-(timeZoneNumber / 60)).toString() : 'GMT-' + (timeZoneNumber / 60).toString() ;
    $scope.isCollapsed = true;
    $scope.memberShowOnly = 'N';
    $scope.viewTag = {
      tabSwitch: 'plan',   //[查詢頁面切換使用] plan,upcoming,ongoing,past,cancel
      //isLoading: 'yes',    //[進行資料操作時的頁面切換使用] yes,done,fail
      watchModel: 'query', //[切換操作頁面使用] query,add,edit

      marketCode: '',      // 根據從 server.js 的環境設定檔決定
      marketFullName: '',

      //languageShow: 'default',
      //messageShow: 'open', // open,close,
      initStatus: 'loading' // loading,error,done,
    };
    $scope.tabName = showTabName($scope.viewTag.tabSwitch);
    $scope.tempViewTag = JSON.parse(JSON.stringify($scope.viewTag));
    /* 複製一段變數,等市場切換要重新載入*/
    $scope.marketList = {};
    /* 頁面切換使用 */
    $scope.templateMain  = '/components/contest-v2/loading-page/contest-reload.html';
    $scope.templateDetail = '/components/contest-v2/contest-list.html';
    $scope.contestList = [];

    $scope.behavior = {
      tagViewClick: function (tabName) { /* << 切換比賽狀態的tab >> */
        $scope.viewTag.tabSwitch = tabName;
        var marketCode = $scope.viewTag.marketCode ;
        localStorage.setItem('marketCode', marketCode );
        var contestStatus = statusTableFiled($scope.viewTag.tabSwitch);
        $scope.tabName = showTabName($scope.viewTag.tabSwitch);
        $scope.templateDetail = '/components/contest-v2/loading-page/contest-query.html'; /* 讀取時要切換頁面等待 */
        $scope.queryContestList(marketCode,contestStatus,function (response) {
          if (response.status == 200 ) {
            $scope.contestList = response.data;
            $timeout(function () {
              $scope.templateDetail = '/components/contest-v2/contest-list.html';
              console.log('查詢完畢['+statusTableFiled($scope.viewTag.tabSwitch)+']');
            }, 1500);
          }else{
            $scope.contestList = [];
            $scope.templateDetail = '/components/contest-v2/contest-list.html';
            alert('查詢失敗,請稍候再嘗試');
          }
        });
      },
      watchModelSelect: function (action) { /* << 進行比賽資料編輯操作 >> */
        $scope.viewTag.watchModel = action;
      },
      initChange: function (action) {
        $scope.viewTag.initStatus = action;
      },
      selectMarketReloadPage: function (marketCode) { /* << 切換資料庫查詢位置 >> */
        if ( $scope.viewTag.marketCode != marketCode ) {
          if (confirm("確定要切換市場？如果有正在編輯中的資料會消失喔！")) {
            //$scope.viewTag = JSON.parse(JSON.stringify($scope.tempViewTag));
            /* 因為是重新載入,所以把一開始的變數重新刷新一次 */
            $scope.viewTag.marketCode = marketCode;
            localStorage.setItem('marketCode', marketCode );
            $scope.viewTag.marketFullName = marketFullName(marketCode);
            $scope.viewTag.tabSwitch = 'plan';
            $scope.tabName = showTabName($scope.viewTag.tabSwitch);

            $scope.templateMain  = '/components/contest-v2/loading-page/contest-reload.html';
            $scope.templateDetail = '/components/contest-v2/loading-page/contest-query.html'; /* 讀取時要切換頁面等待 */

            $scope.queryContestList(marketCode,'W',function(response){
              $scope.templateMain = '/components/contest-v2/contest-tab.html';
              if (response.status == 200 ) {
                $scope.contestList = response.data;
                $timeout(function () {
                  $scope.templateDetail = '/components/contest-v2/contest-list.html';
                  console.log('查詢完畢['+statusTableFiled($scope.viewTag.tabSwitch)+']');
                }, 1500);
              }else{
                $scope.contestList = [];
                $scope.templateDetail = '/components/contest-v2/contest-list.html';
                alert('查詢失敗,請稍候再嘗試');
              }
            })

            //$scope.viewTag.initStatus = 'done';
            //
            //$timeout(function () {
            //  $scope.templateMain = '/components/contest-v2/contest-tab.html';
            //}, 1000);
          }else{
            /* 同樣的市場查詢就不用詢問切換了 */
          }
        }
      },
      memberClick: function(contestId, contestName, language) {

        $scope.memberShowOnly = 'Y';
        // --> 點擊查看比賽的參賽用戶
        $scope.memberShowTitle = contestName;
        language = language.trim();
        contestId = contestId.trim();
        $http.get('/backend/contests/contestants/'+contestId+'/'+language+'/'+$scope.viewTag.marketCode+'/', {params: {}})

            .success(function(data) {
                $scope.memberList = data.data;//queryOutputFilter(data.content, $scope.strFilter);

                var index_number = 1;
                _.forEach($scope.memberList, function(d) {
                  d.NUMBER = index_number;
                  d.JOIN_DATE = $scope.convertTime(d.JOIN_DATE, 0);
                  index_number = index_number + 1;
                });
            })
            .error(function(err) {
            });
      },
      leaveViewMember: function() {
        // --> 不想看比賽了，所以轉身離開
        $scope.memberShowOnly = 'N';
        $scope.viewTag.watchModel == 'query';
        $scope.memberList = []; // 養成好習慣，要記得清空
        $scope.memberShowTitle = '';
      }
    };
    $scope.convertTime = function(timeStr, timeRange) {
      var changeDateTime = moment(timeStr).add(timeRange, 'minute').format('YYYY-MM-DD HH:mm:ss'); /* 現有的時間 */
      if (!moment(changeDateTime).isValid()) {
        changeDateTime = ''; /* 檢查出來的時間如果有錯,就返回空值 */
      }

      return changeDateTime;
    };
    $scope.init = function () { /* 初始化的事情處理 */
      /* 得到產品市場 */
      justHttp($http, 'getMarket', 'GET', httpPath + 'contestSocialCenterMarket/', '', function (response) {
        var httpStatus = response.status;
        if (httpStatus !== 200) {
          $scope.behavior.initChange('error');
        } else if (Object.keys(response.data).length == 0) {
          $scope.behavior.initChange('error');
        } else {
          $scope.behavior.initChange('done');
          var obj = response.data;
          console.log(obj);
          for (var key in obj) {
            if ($scope.viewTag.marketCode == '') {
              /* 載入完成時，預先取第一個設定值 */
              $scope.viewTag.marketCode = key;
              $scope.viewTag.marketFullName = marketFullName(key);
            }
            obj[key] = marketSortName(key);
          }
          $scope.marketList = obj;
          /* 查詢指定的比賽狀態列表 */
          var marketCode = $scope.viewTag.marketCode ;
          localStorage.setItem('marketCode', marketCode );
          console.log(localStorage.getItem('marketCode'));
          $scope.queryContestList(marketCode,'W',function (response) {
            $scope.templateMain = '/components/contest-v2/contest-tab.html';
            if (response.status == 200 ) {
              $scope.contestList = response.data;
              $timeout(function () {
                console.log('查詢完畢[W]');
              }, 1500);
            }else{
              $scope.contestList = [];
              alert('查詢失敗,請稍候再嘗試');
            }
          });
          //
          //justHttp($http, 'getContestByStatus', 'GET', httpPath + 'contestSocialCenterQuery/'+marketCode+'/?status=W', '', function (response) {
          //  $scope.contestList = response.data ;
          //  $timeout(function () {
          //    $scope.templateMain = '/components/contest-v2/contest-tab.html';
          //    console.log('初始化完畢');
          //  }, 1500);
          //});
        }
      });
    };
    $scope.queryContestList = function(marketCode,status,callback){
      justHttp($http, 'getContestByStatus', 'GET', httpPath + 'contestSocialCenterQuery/'+marketCode+'/?status='+status, '', function (response) {
        callback(response);
      });
    };
    $scope.delete = function (contestId){ /* 刪除比賽 */
      if (confirm("確定要『刪除』嗎？")) {
        var marketCode = $scope.viewTag.marketCode ;
        justHttp($http, 'deleteContest', 'DELETE', httpPath + 'contestSocialCenterRemove/' + marketCode + '/' + contestId + '/', '', function (response) {
          if (response.status != 200) {
            alert('刪除失敗...');
          } else {
            alert('刪除成功');
          }
          /* 不管刪除成功或者失敗,畫面都重新再刷新一次 */
          var marketCode = $scope.viewTag.marketCode;
          var contestStatus = statusTableFiled($scope.viewTag.tabSwitch);
          $scope.templateMain = '/components/contest-v2/loading-page/contest-query.html';
          justHttp($http, 'getContestByStatus', 'GET', httpPath + 'contestSocialCenterQuery/' + marketCode + '/?status=' + contestStatus, '', function (response) {
            $scope.contestList = response.data;
            $timeout(function () {
              $scope.templateMain = '/components/contest-v2/contest-tab.html';
              console.log('刪除後刷新完畢');
            }, 1500);
          });
        });
      }
    };
    $scope.publish = function (contestId){ /* 發佈比賽 */
      if (confirm("確定要「發佈」嗎？")) {
        var postData = { contest_id : contestId } ;
        var marketCode = $scope.viewTag.marketCode;
        justHttp($http, 'publishContest', 'PUT', httpPath + 'contestSocialCenterPublish/' + marketCode + '/',postData, function (response) {
          if (response.status != 200) {
            alert('發佈失敗...');
          } else {
            alert('發佈成功');
          }
          /* 不管刪除成功或者失敗,畫面都重新再刷新一次 */
          var marketCode = $scope.viewTag.marketCode;
          var contestStatus = statusTableFiled($scope.viewTag.tabSwitch);
          $scope.templateMain = '/components/contest-v2/loading-page/contest-query.html';
          justHttp($http, 'getContestByStatus', 'GET', httpPath + 'contestSocialCenterQuery/' + marketCode + '/?status=' + contestStatus, '', function (response) {
            $scope.contestList = response.data;
            $timeout(function () {
              $scope.templateMain = '/components/contest-v2/contest-tab.html';
              console.log('刪除後刷新完畢');
            }, 1500);
          });
        });
      }
    };
    $scope.edit = function (contestId) {
      localStorage.setItem('contestId', contestId ); /* localStorage 設定 contest_id 的屬性 , 給 編輯頁面使用 */
      $scope.behavior.watchModelSelect('edit');
    }
  }
  function justHttp ($http,tag,method,url,formData,callback){

    var httpObject = null ;
    if ( method == 'PUT' ){
      httpObject = $http({
        method  : method ,
        url     : url    ,
        data    : formData
      })
    }else{
      httpObject = $http({
        method  : method ,
        url     : url    ,
        data    : formData ,
        headers : {'Content-Type': undefined }
      })
    }

    httpObject
      .then(
      function(response) { // 成功
        console.log('[success]'+tag);
        callback(response);
      },
      function (response) { // 失敗
        console.log('[fail]'+tag);
        callback(response);
      });
  }
  function marketSortName (marketCode){
    var name = marketCode ; /* 匹配不到就僅返回 marketCode */
    switch(marketCode){
      case 'FX' :
        name = '外匯';
        break;
      case 'FC' :
        name = '期貨';
        break;
      case 'SC' :
        name = '股市';
        break;
      case 'FT' :
        name = '期貨';
        break;
    }
    return name ;
  }
  function marketFullName (marketCode){
    var name = marketCode ; /* 匹配不到就僅返回 marketCode */
    switch(marketCode){
      case 'FX' :
        name = '外匯操盤手';
        break;
      case 'FC' :
        name = '期貨操盤手';
        break;
      case 'FC' :
        name = '股市操盤手';
        break;
      case 'FT' :
        name = '期貨操盤手(台灣)';
        break;
    }
    return name ;
  }
  function statusTableFiled (status){
    var str = '';
    switch (status){
      case 'plan' :
        str = 'W';
        break;
      case 'upcoming' :
        str = 'R';
        break;
      case 'ongoing' :
        str = 'G';
        break;
      case 'past' :
        str = 'P';
        break;
      case 'cancel' :
        str = 'C';
        break;
    }
    return str ;
  }
  function showTabName(status){
    var str = '';
    switch (status){
      case 'plan' :
        str = '草稿模式';
        break;
      case 'upcoming' :
        str = '準備中（報名中）';
        break;
      case 'ongoing' :
        str = '進行中';
        break;
      case 'past' :
        str = '已結束';
        break;
      case 'cancel' :
        str = '已取消';
        break;
    }
    return str ;
  }

})();
