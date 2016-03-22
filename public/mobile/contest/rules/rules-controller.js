(function() {

  'use strict';

  angular.module('fdt.mobile.contest.rules.controller', [])
      .controller('ContestRulesCtrl', ContestRulesCtrl);

  ContestRulesCtrl.$inject = ['lang', '$location', '$anchorScroll', '$timeout'];

  function ContestRulesCtrl(lang, $location, $anchorScroll, $timeout) {
    var vm = this;
    vm.title = lang.CAMPUS_CONTEST_RULES;
    document.title = vm.title;
    vm.rulesHtmlSrc = '/mobile/contest/rules/rules-' + window.language + '.html';

    vm.dummyChart = {
      labels: ['Profitability', 'Risk Control', 'Consistency', 'Activity'],
      datasets: [
        {
          label: 'Contest Performance',
          fillColor: 'rgba(220,220,0,0.2)',
          strokeColor: 'rgba(220,220,0,1)',
          pointColor: 'rgba(220,220,0,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,0,1)',
          data: [
            parseFloat(99.99),
            parseFloat(99.99),
            parseFloat(99.99),
            parseFloat(99.99)
          ],
        },
      ],
    };
    $timeout(function() {
      if($location.hash()) {
        $anchorScroll();  
      } 
    }, 500);
  }

})();
