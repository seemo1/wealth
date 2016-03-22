(function() {

  angular.module('fdt.mobile.contest.details.upcoming.controller', [])
      .controller('UpcomingCtrl', UpcomingCtrl);

  UpcomingCtrl.$inject = ['contestDetail', '$stateParams', '$cookies', 'user', 'lang', '$modal', '$scope', '$state', '$timeout', '$window'];

  function UpcomingCtrl(contestDetail, $stateParams, $cookies, user, lang, $modal, $scope, $state, $timeout, $window) {
    var vm = this;
    vm.user = $cookies.getObject('user');
    vm.contestDetail = contestDetail.data.data[0];
    vm.joinUrl = vm.user.protocol + '://fdt/discover/contests/joinContest/?contestid=' + $stateParams.id + '&mkt=' + vm.contestDetail.market_code;
    vm.lang = lang;

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
    vm.goApplied = function() {
      $state.go('participantList', {id: vm.contestDetail.contest_id});
    }
  }
})();
