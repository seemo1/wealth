(function () {

  angular.module('fdt.mobile.contest.details.proxy.controller', [])
      .controller('DetailProxyController', DetailProxyController);

  DetailProxyController.$inject = ['$stateParams', 'contestApi', '$state', '$cookies'];
  function DetailProxyController($stateParams, contestApi, $state, $cookies) {
    var vm = this;

    //if the url query doesn't contain mkt or contest_id
    //redirect to other contest main page
    if(!$stateParams.market || !$stateParams.contest_id) {
      $state.go('contest');
      return;
    }

    localStorage.setItem('market', $stateParams.market); //set default market

    contestApi.getContestDetail($stateParams.contest_id)
      .then(function (res) {
        if(res.data.data.length < 1) {
          $state.go('contest');
          return;
        }
        var contest = res.data.data[0];
        $cookies.putObject('selectedContest', contest);
        $state.go(contest.progress_status, {id: contest.contest_id});
      }, function(err) {
        console.log("ERORO");
      });

  }

})();