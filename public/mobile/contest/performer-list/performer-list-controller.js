(function() {

  'use strict';

  angular.module('fdt.mobile.contest.performer.list.controller', [])
      .controller('PerformerListCtrl', PerformerListCtrl);

  PerformerListCtrl.$inject = ['topPerformers', '$cookies', 'lang', '$scope'];
  function PerformerListCtrl(topPerformers, $cookies, lang, $scope) {
    var vm = this;
    vm.lang = lang;
    vm.title = vm.lang.TOP_TRADER_LIST;
    vm.mode = "top";

    var toState = $cookies.getObject('toState');
    if (toState.name.indexOf('dailyTop') > -1) {
      vm.title = vm.lang.TOP_TRADER_RAISE;
      vm.mode = "dailyTop";
    }
    else if (toState.name.indexOf('participantList') > -1) {
      vm.title = vm.lang.APPLIED;      
      vm.mode = "applied";
    }
    document.title = vm.title;
    vm.topPerformers = topPerformers.data.data;

    // 開一個接口讓 children 丟 function 給 parent
    var childs = [];
    $scope.addChild = function(child) {
      childs.push(child);
    };

    $scope.closeAllChart = function() {
      childs.forEach(function(element){
        element();
      })
    };
  }

})();
