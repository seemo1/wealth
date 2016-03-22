(function () {
  'use strict';

  angular.module('fdt',
      [
        //'ngRoute',
        //'ui.bootstrap',
        //'ui.bootstrap.tabs',
        'fdt.login',
        'fdt.dashboard',
        'fdt.service.settings',
        'toggle-switch',
      ])
      .config(fdtRouter);

  fdtRouter.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
  function fdtRouter($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/fdt/login', {templateUrl: '/components/login/login.html', controller: 'LoginController'});
    $routeProvider.when('/fdt/dashboard', {
      templateUrl: '/components/dashboard/dashboard.html',
      controller: 'DashboardController',
    });
    $httpProvider.defaults.timeout = 60000;

    $routeProvider.when('/', {templateUrl: '/views/main.html'});
    $locationProvider.html5Mode({enabled: true, requireBase: false});
  }
})();
