(function() {

  'use strict';

  angular.module('fdt.mobile.contest.participant.controller', [])
      .controller('ParticipantCtrl', ParticipantCtrl);

  ParticipantCtrl.$inject = ['$scope', 'contestApi', '$cookies', 'lang', 'CONFIG'];

  function ParticipantCtrl($scope, contestApi, $cookies, lang, CONFIG) {
    var vm = this;
    vm.participant = angular.copy($scope.participant);
    vm.selectedContest = $cookies.getObject('selectedContest');
    vm.daily = $scope.daily;
    vm.showChart = false;
    vm.lang = lang;
    vm.userPerformance = {};

    var performanceLabels = [
      vm.lang.PROFITABILITY, vm.lang.RISK_MANAGEMENT,
      vm.lang.LEVEL_OF_FOCUS, vm.lang.EXECUTION_STRATEGY,
    ];

    var chartColor = CONFIG.chartColor;

    vm.participant.data = {
      labels: performanceLabels,
      datasets: [
        {
          label: 'Contest  Performance',
          fillColor: chartColor.fillColor,
          strokeColor: chartColor.strokeColor,
          pointColor: chartColor.pointColor,
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: chartColor.pointHighlightStroke,
          data: [0, 0, 0, 0],
        },
      ],
    };

    $scope.$parent.addChild(function() { 
      vm.showChart = false;
    }); 

    vm.openChart = function(userId) {
      if (vm.mode == "applied") {
        window.location = window.appProtocol + "://fdt/discover/userprofile?userid=" + vm.participant.user_id;
        return;
      }
      if (vm.showChart) {
        vm.showChart = false;
        return;
      }

      contestApi.getUserPerformance(vm.selectedContest.contest_id, userId)
          .then(function(res) {
            if (Object.hasOwnProperty.call(res.data.data[0], 'user_id')) {
              var participantData = res.data.data[0];
              vm.userPerformance = participantData;
              vm.participant.data = {
                userId: userId,
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
                      parseFloat(participantData.profitability),
                      parseFloat(participantData.risk_control),
                      parseFloat(participantData.consistency),
                      parseFloat(participantData.activity),
                    ],
                  },
                ],
              };
              $scope.$parent.closeAllChart();
              vm.showChart = true;
            }
          }, function(err) {

            console.log(err);
          });
    };
  }

})();
