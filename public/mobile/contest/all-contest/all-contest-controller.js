(function() {

  'use strict';

  angular.module('fdt.mobile.contest.list.all.controller', [])
      .controller('ListAllCtrl', ListAllCtrl);

  ListAllCtrl.$inject = ['contests', 'contestApi', 'lang', '_'];

  function ListAllCtrl(contests, contestApi, lang, _) {
    var vm = this;
    vm.contests = contests.data.data;
    vm.lang = lang;
    document.title = lang.ALL_CONTEST;
    vm.loading = false;
    vm.noMore = false;
    vm.selectedMarket = (sessionStorage.getItem('market')) ? sessionStorage.getItem('market') : 'FX';

    vm.availableMarkets = window.availableMarkets.split(',');
    vm.availableMarkets = _.reject(vm.availableMarkets, function (m) {
      return m === 'DEFAULT';
    });
    vm.rowClass = 'col-xs-' + (12 / vm.availableMarkets.length);
    var startRows = 0;

    vm.loadMore = function() {
      if (vm.loading) return;

      vm.loading = true;
      contestApi.getAllContest(localStorage.getItem('market'), startRows, 20)
          .then(function(res) {
            if (res.data.data.length > 0) {
              startRows += 20;
              res.data.data.forEach(function(d) {
                vm.contests.push(d);
              });
            } else {
              vm.noMore = true;
            }

            if (res.data.data.length < 20) {
              vm.noMore = true;
            }

            vm.loading = false;
          }, function(err) {

            console.error(err);
          });
    };

    vm.switchMarket = function(market) {
      startRows = 0;
      vm.selectedMarket = market;
      localStorage.setItem('market', market);
      sessionStorage.setItem('market', market);
      vm.loadContest();
    };

    vm.loadContest = function() {
      vm.contests = [];
      contestApi.getAllContest(localStorage.getItem('market'), startRows, 20)
          .then(function(res) {
            startRows += 20;
            vm.contests = res.data.data;
          }, function(err) {
            console.error(err);
          });
    };

  }

})();
