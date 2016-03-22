(function() {

  'use strict';

  angular.module('fdt.mobile.contest.news.controller', [])
      .controller('ContestNewsCtrl', ContestNewsCtrl);

  ContestNewsCtrl.$inject = [];

  function ContestNewsCtrl() {
    var vm = this;

    vm.news = [
      {title: '京港澳投资大赛结果新鲜出炉！结果新鲜出炉！', date: '2015-12-15'},
      {title: '京港澳投资大赛结果新鲜出炉！结果新鲜出炉！', date: '2015-12-15'},
      {title: '京港澳投资大赛结果新鲜出炉！结果新鲜出炉！', date: '2015-12-15'},
      {title: '京港澳投资大赛结果新鲜出炉！结果新鲜出炉！', date: '2015-12-15'},
      {title: '京港澳投资大赛结果新鲜出炉！结果新鲜出炉！', date: '2015-12-15'}
    ];
  }

})();