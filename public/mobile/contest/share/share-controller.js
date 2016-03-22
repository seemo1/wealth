(function() {

  angular.module('fdt.mobile.contest.share', [])
      .controller('ShareCtrl', ShareCtrl);

  ShareCtrl.$inject = ['contestDetail', '$stateParams', 'CONFIG', 'lang'];

  function ShareCtrl(contestDetail, $stateParams, CONFIG, lang) {
    var vm = this;
    vm.contestDetail = contestDetail.data;
    vm.lang = lang;

    vm.joinUrl =  CONFIG.host + '/' + getShortDeeplink($stateParams.type) + '/contests?contestid=' +
        $stateParams.contest_id + '&isNew=y&mkt=' + vm.contestDetail.market_code;

    function getShortDeeplink(longDeeplink) {
      var shortDeepLink = 'fxmen';
      if (!longDeeplink) {
        return shortDeepLink;
      }

      longDeeplink = longDeeplink.toLowerCase();

      switch (longDeeplink) {
        case 'forexmaster':
          shortDeepLink = 'fxmen';
          break;
        case 'forexmastertw':
          shortDeepLink = 'fxmtw';
          break;
        case 'forexmastercn':
          shortDeepLink = 'fxmsc';
          break;
        case 'futuresmastercn':
          shortDeepLink = 'ftmsc';
          break;
        case 'stockmastercn':
          shortDeepLink = 'smsc';
          break;
        case 'forexmasterinc':
          shortDeepLink = 'fxmeninc';
          break;
        case 'forexmasterinccn':
          shortDeepLink = 'fxmscinc';
          break;
        case 'stockmasterlttw':
          shortDeepLink = 'smtw';
          break;
      }

      return shortDeepLink;
    };

  }

})();
