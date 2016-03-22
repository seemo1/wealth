(function () {

  angular.module('fdt.mobile.contest.details.past.controller', [])
      .controller('PastCtrl', PastCtrl);

  PastCtrl.$inject = ['contestDetail', 'userPerformance', 'topPerformers', 'lang', 'CONFIG'];

  function PastCtrl(contestDetail, userPerformance, topPerformers, lang, CONFIG) {
    var vm = this;
    vm.contestDetail = contestDetail.data.data[0];
    vm.userPerformance = (userPerformance.data.data.length > 0) ? userPerformance.data.data[0] : '';
    vm.topPerformersState = 'topPerformers';
    vm.topPerformers = topPerformers.data.data;
    vm.lang = lang;

    var performanceLabels = [
      vm.lang.PROFITABILITY, vm.lang.RISK_MANAGEMENT,
      vm.lang.LEVEL_OF_FOCUS, vm.lang.EXECUTION_STRATEGY
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
              parseFloat(vm.userPerformance.activity)
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
  }

})();
