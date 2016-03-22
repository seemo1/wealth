(function() {

  'use strict';

  angular.module('fdt.mobile.contest.list.user.controller', [])
      .controller('ListUserCtrl', ListUserCtrl);

  ListUserCtrl.$inject = ['upcomingContest', 'ongoingContest', 'pastContest', 'lang'];

  function ListUserCtrl(upcomingContest, ongoingContest, pastContest, lang) {
    var vm = this;
    vm.lang = lang;
    vm.noData = false;
    vm.upcomingContest = upcomingContest.data.data;
    vm.ongoingContest = ongoingContest.data.data;
    vm.pastContest = pastContest.data.data;
    if ( (!vm.upcomingContest || vm.upcomingContest.length < 1)
      && (!vm.ongoingContest || vm.ongoingContest.length < 1)
      && (!vm.pastContest || vm.pastContest.length < 1) ) {
      
      vm.noData = true;
    }
    document.title = lang.MY_CONTEST;
    console.log(vm);
  }

})();
