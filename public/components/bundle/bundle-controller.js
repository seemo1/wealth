(function() {
  'use strict';

  angular.module('fdt.bundle', ['fdt.bundle.file'])
      .controller('BundleController', BundleController)
      .directive('fileModel', UploadFileDirective);

  function BundleController($http, $rootScope, $scope) {
    var vm = this;
    vm.versionPath = '';
    vm.addingCategory = false;
    vm.products = [
            {
              name: 'ForexMaster',
              markets: [],
              devices: ['Android', 'AndroidInc', 'AndroidLive', 'IOS', 'IOSInc', 'IOSLive'],
            },
            {
              name: 'FuturesMaster',
              markets: [],
              devices: ['Android', 'AndroidInc', 'AndroidLive', 'IOS', 'IOSInc', 'IOSLive'],
            },
            {
              name: 'StockMaster',
              markets: [],
              devices: ['Android', 'AndroidInc', 'AndroidLive', 'IOS', 'IOSInc', 'IOSLive'],
            },
        ];
    vm.product = vm.products[0];
    vm.device = vm.product.devices[0];
    vm.market = vm.product.markets[0];
    vm.newMarket = '';

    vm.getDefaultBundleCategory = function() {
      var endPoint = vm.versionPath.concat('/bundle/v0/market/product/' + vm.product.name + '/device/' + vm.device);
      $http.get(endPoint)
                .success(function(data, headers) {
                  vm.product.markets = data;
                  vm.market = vm.product.markets[0];
                  vm.loadBundleFile();
                })
                .error(function(data, headers) {
                  console.log('[ERROR getDefaultBundleCategory]', data);
                });
    };

    vm.changeMarket = function() {
      var endPoint = vm.versionPath.concat('/bundle/market/product/' + vm.product.name + '/device/' + vm.device);
      $http.get(endPoint)
                .success(function(data, headers) {
                  vm.loadBundleFile();
                })
                .error(function(data, headers) {
                  console.log('[ERROR getDefaultBundleCategory]', data);
                });
    };

    vm.changeProduct = function() {
      vm.getDefaultBundleCategory();
      console.log('[Change Product]', vm.product);
    };

    vm.changeProductOption = function() {
      var product = {
        name: vm.product.name,
        market: vm.market,
        device: vm.device,
      };
      vm.getDefaultBundleCategory();
      console.log('[Change Product Option]', product);
    };

    vm.addMarket = function() {
      if (!vm.newMarket) return;

      var data = {
        product: vm.product.name,
        device: vm.device,
        market: vm.newMarket,
      };
      vm.addingCategory = true;
      $http.post(vm.versionPath.concat('/bundle/category'), data)
                .success(function(data, status) {
                  vm.getDefaultBundleCategory();
                  vm.addingCategory = false;
                })
                .error(function(data, status) {
                  console.log('[ERROR addMarket]', data);
                  vm.addingCategory = false;
                });

      vm.newMarket = '';
    };

    vm.loadBundleFile = function() {
      console.log('[Load Bundle File] Broadcast');
      var bundleData = {
        product: vm.product.name,
        device: vm.device,
        market: vm.market,
      };

      $rootScope.$broadcast('loadBundleFile', bundleData);
    };
  }

  //INFO: this shit doesn't work on IE9
  function UploadFileDirective($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function() {
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  }

})();
