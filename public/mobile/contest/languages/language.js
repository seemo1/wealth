(function() {

  'use strict';

  angular.module('fdt.mobile.contest.language.api', [
      'fdt.mobile.contest.language.en',
      'fdt.mobile.contest.language.tw',
      'fdt.mobile.contest.language.cn'
  ])
      .factory('lang', Lang);

  Lang.$inject = ['langEn', 'langTw', 'langCn'];

  function Lang(langEn, langTw, langCn) {
    if(window.language.toString() === 'en') return langEn;
    else if(window.language.toString() === 'tw') return langTw;
    else if(window.language.toString() === 'cn') return langCn;
  }

})();

