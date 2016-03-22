(function() {

  'use strict';

  angular.module('fdt.mobile.contest.popup.controller', [])
      .controller('PopUpCtrl', PopUpController);

  PopUpController.$inject = ['parent', 'lang', 'CONFIG', '$cookies', '$state'];
  function PopUpController(parent, lang, CONFIG, $cookies, $state) {
    var vm = this;
    vm.lang = lang;

    vm.popUpImage = 'mobile/contest/styles/img/joined_succeed_global.png';
    if (window.language == 'cn') {
      vm.popUpImage = 'mobile/contest/styles/img/joined_succeed_china.png';
    }
    else if (window.language == 'tw') {
      vm.popUpImage = 'mobile/contest/styles/img/joined_succeed_global_tw.png';
    }
    
    vm.goRules = function() {
      parent.modal.$promise.then(parent.modal.hide);
      $state.go("rules", { '#': 'scoring' });
    };

    vm.done = function() {
      parent.modal.$promise.then(parent.modal.hide);
    };

    var user = $cookies.getObject('user');
    var contestUrl = CONFIG.shareLink + '?contest_id=' + parent.contestDetail.contest_id +
        '&language=' + user.language +
        '&platform=' + user.platform +
        '&type=' + user.protocol + '&market=' + parent.contestDetail.market_code;
    vm.shareLink = function() {
      parent.modal.$promise.then(parent.modal.hide);
      top.location = user.protocol + '://fdt/request/socialshare?title=' + parent.contestDetail.title +
        '&msg=&url=' + encodeURIComponent(contestUrl);
    }  
  }

})();
