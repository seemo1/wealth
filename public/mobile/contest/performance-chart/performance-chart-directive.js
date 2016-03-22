(function() {

  'use strict';

  angular.module('fdt.mobile.contest.performanceChart.directive', [])
      .directive('performanceChartDir', PerformanceChart);

  PerformanceChart.$inject = ['lang', '$cookies'];
  function PerformanceChart(lang, $cookies) {
    return {
      restrict: 'EA',
      scope: { data: '=', userPerformance: '=', isPreview: '=', isKicked: '='},
      templateUrl: '/mobile/contest/performance-chart/performance-chart.html',
      link: function(scope, elements, attr) {
        var user = $cookies.getObject('user');
        scope.lang = lang;
        if(!scope.userPerformance) scope.noScore = lang.NO_SCORES_YET;
        scope.profileLink = user.protocol + "://fdt/discover/userprofile?userid=" + scope.data.userId;
        scope.options = {
          responsive: true,
          scaleShowLine: true,
          angleShowLineOut: true,
          scaleShowLabels: false,
          scaleBeginAtZero: true,
          angleLineColor: 'rgba(0,0,255,.1)',
          angleLineWidth: 1,
          pointLabelFontFamily: '"Arial"',
          pointLabelFontStyle: 'normal',
          pointLabelFontSize: 10,
          pointLabelFontColor: '#666',
          pointDot: true,
          pointDotRadius: 4,
          pointDotStrokeWidth: 1,
          pointHitDetectionRadius: 20,
          datasetStroke: true,
          datasetStrokeWidth: 2,
          datasetFill: true,
        };
      },
    };
  }

})();
