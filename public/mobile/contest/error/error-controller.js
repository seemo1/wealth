(function () {

  'use strict';

  angular.module('fdt.mobile.contest.error.controller', [])
      .controller('ContestErrorCtrl', ContestErrorCtrl);

  ContestErrorCtrl.$inject = ['$state', '$cookies', '$location'];

  function ContestErrorCtrl($state, $cookies) {
    var vm = this;
    vm.user = $cookies.getObject('user');
    vm.deeplink = vm.user.protocol.concat('://fdt/discover/index'); //deeplink for going back to discover
  }

})();