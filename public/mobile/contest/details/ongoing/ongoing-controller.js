(function() {

  angular.module('fdt.mobile.contest.details.ongoing.controller', [])
      .controller('OngoingCtrl', OngoingCtrl);

  OngoingCtrl.$inject = [
    'contestDetail', 'topPerformers', 'dailyTopPerformers',
    'userPerformance', '$cookies', 'lang', '$stateParams',
    'CONFIG', '$modal', '$scope', '$window'
  ];

  function OngoingCtrl(contestDetail, topPerformers, dailyTopPerformers, userPerformance, $cookies, lang, $stateParams,
      CONFIG, $modal, $scope, $window) {

    var vm = this;
    vm.user = $cookies.getObject('user');
    vm.contestDetail = contestDetail.data.data[0];
    vm.joinUrl = vm.user.protocol + '://fdt/discover/contests/joinContest/?contestid=' + $stateParams.id + '&mkt=' + vm.contestDetail.market_code;
    vm.topPerformers = topPerformers.data.data;
    vm.dailyTopPerformers = dailyTopPerformers.data.data;
    vm.userPerformance = (userPerformance.data.data.length > 0) ? userPerformance.data.data[0] : '';
    vm.lang = lang;

    var performanceLabels = [
      vm.lang.PROFITABILITY, vm.lang.RISK_MANAGEMENT,
      vm.lang.LEVEL_OF_FOCUS, vm.lang.EXECUTION_STRATEGY,
    ];
    var chartColor = CONFIG.chartColor;

    if (vm.userPerformance.fdt_score) { 
      vm.performanceData = {
        labels: performanceLabels,
        datasets: [
          {
            label: 'Contest Performance',
            fillColor: chartColor.fillColor,
            strokeColor: chartColor.strokeColor,
            pointColor: chartColor.pointColor,
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: chartColor.pointHighlightStroke,
            data: [
              parseFloat(vm.userPerformance.profitability),
              parseFloat(vm.userPerformance.risk_control),
              parseFloat(vm.userPerformance.consistency),
              parseFloat(vm.userPerformance.activity),
            ],
          },
        ],
      };
    }
    else {
      vm.performanceData = {
        labels: performanceLabels,
        datasets: [
          {
            label: 'Contest Performance',
            fillColor: 'rgba(0, 0, 0, 0)',
            strokeColor: 'rgba(0, 0, 0, 0)',
            pointColor: 'rgba(0, 0, 0, 0)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: chartColor.pointHighlightStroke,
            data: [
              parseFloat(0),
              parseFloat(0),
              parseFloat(0),
              parseFloat(0),
            ],
          },
          {
            label: 'Mask',
            fillColor: 'rgba(0, 0, 0, 0)',
            strokeColor: 'rgba(0, 0, 0, 0)',
            pointColor: 'rgba(0, 0, 0, 0)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: chartColor.pointHighlightStroke,
            data: [
              parseFloat(50),
              parseFloat(50),
              parseFloat(50),
              parseFloat(50),
            ],
          },
        ],
      };
    }
    vm.dailyTopPerformersState = 'dailyTopPerformers';
    vm.topPerformersState = 'topPerformers';
    vm.params = $stateParams;

    vm.modal = $modal({
      scope: $scope,
      templateUrl: '/mobile/contest/popup/popup.html',
      show: false,
      controller: 'PopUpCtrl',
      controllerAs: 'popUpCtrl',
      resolve: {
        parent: function(){
          return vm;
        }
      }
    });
    vm.joinStatus = vm.contestDetail.join_status;

    $window.onJoinContest = function() {
      vm.joinStatus = true;
      vm.contestDetail.user_join_sum ++;
      vm.modal.$promise.then(vm.modal.show);
    };

    $window.onClosePopup = function() {
      vm.modal.$promise.then(vm.modal.hide);
    };
  }

})();
