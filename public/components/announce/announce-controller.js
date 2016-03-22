'use strict';
(function() {

  angular.module('fdt.announce', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.datetimepicker',])
      .controller('AnnounceController', AnnounceController);

  function AnnounceController($http, $rootScope, $scope, $q, $window, $timeout) {
    var vm = this;
    var logTag = '[Announce Controller]';
    vm.seqno = '';
    vm.versionPath = '/announce/v1';
    vm.products = ['ALL', 'ForexMaster', 'FuturesMaster', 'StockMaster'];
    vm.platforms = ['ALL', 'Android', 'AndroidInc', 'AndroidLive', 'IOS', 'IOSInc', 'IOSLive'];
    vm.languages = ['EN', 'TW', 'CN'];
    vm.product = vm.products[0];
    vm.platform = vm.platforms[0];
    vm.language = vm.languages[0];
    vm.msgTitle = '';
    vm.msgText = '';
    vm.announce_Enable = false;
    vm.announce_Repeat = false;
    vm.announce_version = 'ALL';
    vm.announce_country = 'ALL';
    vm.announce_language = '';
    vm.isCalendarOpen_Begin = false;
    vm.isCalendarOpen_End = false;
    vm.country = '';
    vm.begin_date = '';
    vm.end_date = '';
    vm.buttonCaptions = {
      button1: 'Close',
      button2: '',
      button3: '',
    };
    vm.buttonActions = {
      button1: '',
      button2: '',
      button3: '',
    };
    vm.announceList = [];
    vm.editerView = false;
    vm.listView  = true;
    vm.searchView = true;
    vm.version = '';

    vm.detectButtonType = function(action) {
            if (action === '') {
              return 1;
            } else if (action != undefined && action.indexOf('http') != -1) {
              return 2;
            } else {
              return 3;
            }
          };

    vm.openCalendar = function(e, type) {
      e.preventDefault();
      e.stopPropagation();
      if (type === 'begin') {
        vm.isCalendarOpen_Begin = true;
      }      else {
        vm.isCalendarOpen_End = true;
      }
    };

    vm.loadInfo = function() {
      console.log('loadInfo...');
    };

    vm.onQuery = function() {

      var query = 'product=' + $('#filter_product').val() +
          '&platform=' + $('#filter_platform').val() +
          '&language=' + $('#filter_lang').val();

      var url = vm.versionPath + '/note/query?' + query;
      $http.get(url)
                .success(function(list) {
                  vm.announceList = list;
                })
                .error(function(err) {
                  console.log('cannot get app id', err);
                });
    };

    vm.saveAnnounce = function() {
      var now = new Date();
      if (typeof (vm.begin_date) === 'object') {
        var begin_time = vm.begin_date ? vm.begin_date.toISOString() : now;
      }else {
        var begin_time = vm.begin_date ? vm.begin_date : now;
      };

      if (typeof (vm.end_date) === 'object') {
        var end_time = vm.end_date ? vm.end_date.toISOString() : now;
      }else {
        var end_time = vm.end_date ? vm.end_date : now;
      };

      if (vm.msgTitle === '') {
        alert('msgTitle can not be empty !');
        return;
      }

      if (vm.msgText === '') {
        alert('msgText can not be empty !');
        return;
      }

      if (begin_time > end_time) {
        alert('begin time > end time !');
        return;
      }

      var announce_Enable = vm.announce_Enable ? 1 : 0;
      var announce_Repeat = vm.announce_Repeat ? 1 : 0;

      if (vm.announce_version === '') {
        vm.announce_version = 'ALL';
      }

      if (vm.announce_country === '') {
        vm.announce_country = 'ALL';
      }

      var query = 'seqno=' + vm.seqno +
                  '&product=' + vm.product +
                  '&platform=' + vm.platform +
                  '&language=' + vm.language +
                  '&enable=' + announce_Enable +
                  '&repeat=' + announce_Repeat +
                  '&begin_time=' + begin_time +
                  '&end_time=' + end_time +
                  '&version=' + vm.announce_version +
                  '&country=' + vm.announce_country +
                  '&msg_title=' + vm.msgTitle +
                  '&msg_text=' + vm.msgText.replace(/\n/g, '%0A');

      var types = [];
      var captions = [];
      var actions = [];

      if (vm.buttonCaptions.button1 === '') {
        /* 必填 */
        alert('caption1 can not be empty !');
        return;
      } else {
        types.push(vm.detectButtonType(vm.buttonActions.button1));
        captions.push(vm.buttonCaptions.button1);
        actions.push(vm.buttonActions.button1);
      }

      if (vm.buttonCaptions.button2 !== '' && typeof (vm.buttonCaptions.button2) != 'undefined') {
        types.push(vm.detectButtonType(vm.buttonActions.button2));
        captions.push(vm.buttonCaptions.button2);
        actions.push(vm.buttonActions.button2);
      }else {
        /* 因為是push , 所以沒資料就不要把資料塞進去 */

        //types.push('');
        //captions.push('');
        //actions.push('');
      }

      if (vm.buttonCaptions.button3 !== '' && typeof (vm.buttonCaptions.button3) != 'undefined') {
        console.log('3 has');
        types.push(vm.detectButtonType(vm.buttonActions.button3));
        captions.push(vm.buttonCaptions.button3);
        actions.push(vm.buttonActions.button3);
      }else {
        /* 因為是push , 所以沒資料就不要把資料塞進去 */

        //types.push('');
        //captions.push('');
        //actions.push('');
      }

      query += '&btn_type=' + types.join(',') +
               '&btn_caption=' + captions.join(',') +
               '&btn_action=' + actions.join(',');
      if (vm.seqno == '') {
        var url = vm.versionPath + '/note/add?' + query;
        $http.get(url)
                    .success(function(appIds) {
                      vm.editerView = false;
                      vm.searchView = true;
                      vm.listView  = true;
                      vm.onQuery();
                    })
                    .error(function(err) {
                      console.log('cannot get app id', err);
                    });
      }else {
        var url = vm.versionPath + '/note/put?' + query;
        $http.get(url)
                    .success(function(appIds) {
                      vm.editerView = false;
                      vm.searchView = true;
                      vm.listView  = true;
                      vm.onQuery();
                    })
                    .error(function(err) {
                      console.log('cannot get app id', err);
                    });
      }

    };

    vm.deleteAnnounce = function(seqno) {
      if (confirm('Want to delete?!')) {
        $http.post(vm.versionPath + '/note/delete', {seqno: seqno})
                    .success(function(data, headers) {
                      vm.onQuery();
                      console.log('[Delete succeed]', data);
                    })
                    .error(function(data, headers) {
                      console.log('[Delete error]', data);
                    });
      }
    };

    vm.showAddEditor = function() {
      vm.announceItem = {};
      vm.editerView = true;
      vm.searchView = false;
      vm.listView  = false;
      selectitem('product', 'ALL');
      selectitem('platform', 'ALL');
      selectitem('lang', 'ALL');
      vm.seqno = '';

      //handle checkBox
      vm.product = vm.products[0];
      vm.platform = vm.platforms[0];
      vm.language = vm.languages[0];
      vm.msgTitle = '';
      vm.msgText = '';
      vm.announce_Enable = false;
      vm.announce_Repeat = false;
      vm.announce_version = 'ALL';
      vm.announce_country = 'ALL';
      vm.announce_language = '';
      vm.isCalendarOpen_Begin = false;
      vm.isCalendarOpen_End = false;
      vm.country = '';
      vm.begin_date = '';
      vm.end_date = '';
      vm.buttonCaptions = {
        button1: 'Close',
        button2: '',
        button3: '',
      };
      vm.buttonActions = {
        button1: '',
        button2: '',
        button3: '',
      };
    };

    vm.showModifyEditor = function(seqno) {
      vm.announceItem = {};
      vm.listView  = false;
      var where = 'seqno=' + seqno;
      var url = vm.versionPath + '/note/info?' + where;
      $http.get(url)
                .success(function(item) {
                  /* 等讀取好再把編輯頁面秀出來 */
                  vm.editerView = true;
                  vm.searchView = false;
                  vm.seqno = item[0].seqno;
                  vm.msgTitle = item[0].msg_title;
                  vm.msgText = item[0].msg_text;

                  selectitem('product', item[0].product);
                  selectitem('platform', item[0].platform);
                  selectitem('lang', item[0].language);

                  //handle checkBox
                  vm.announce_Enable = (item[0].enable === '1') ? true : false;
                  vm.announce_Repeat = (item[0].repeat === '1') ? true : false;
                  vm.announce_version = item[0].version;
                  vm.announce_country = item[0].country;

                  //handle button
                  var btnCaptions = item[0].button_caption.split(',');
                  console.log('>>>btnCaptions');
                  console.log(btnCaptions);
                  var btnActions = item[0].button_action.split(',');
                  console.log('>>>btnActions');
                  console.log(btnActions);
                  vm.buttonCaptions.button1 = btnCaptions[0];
                  vm.buttonCaptions.button2 = btnCaptions[1];
                  vm.buttonCaptions.button3 = btnCaptions[2];
                  vm.buttonActions.button1 = btnActions[0];
                  vm.buttonActions.button2 = btnActions[1];
                  vm.buttonActions.button3 = btnActions[2];
                  vm.begin_date = item[0].begin_time;
                  vm.end_date = item[0].end_time;
                })
                .error(function(err) {
                  console.log('cannot get app id', err);
                });

    };

    vm.cancelEditor = function() {
      vm.editerView = false;
      vm.listView  = true;
      vm.searchView = true;
    };
  }

})();

function selectitem(eid, val) {
  $('#' + eid).children().each(function() {
    if ($(this).text() === val) {
      $(this).attr('selected', true);
    }else {
      $(this).attr('selected', false);
    }
  });
}
