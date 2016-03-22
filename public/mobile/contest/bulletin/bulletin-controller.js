(function() {

  'use strict';

  angular.module('fdt.mobile.contest.bulletin.controller', [])
      .controller('ContestBulletinCtrl', ContestBulletinCtrl);

  ContestBulletinCtrl.$inject = ['bulletins', '$cookies', 'lang'];

  function ContestBulletinCtrl(bulletins, $cookies, lang) {
    var vm = this;
    var user = $cookies.getObject('user');
    var bulletins = bulletins.data;
    bulletins.forEach(function(element, index, array){
      if(/^https?:\/\//g.exec(element.link)) {
         element.link = user.protocol + "://fdt/insidewebview?url=" + encodeURIComponent(element.link);
      }
    });
    vm.bulletins = bulletins;
    vm.title = lang.ALL_ANNOUNCEMENTS;

    vm.goLink = function(link) {
      fdt.callAPP('fdt/gapagetracking', ['screen_name=Contest_Notice_Detail'], window.appProtocol);
      top.location = link;
    }
    document.title = vm.title;
  }

})();