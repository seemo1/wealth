(function() {

  angular.module('fdt.banner', [
      'ngRoute',
      'ui.bootstrap',
      'ui.bootstrap.tabs',
      'ngFileUpload',
      'fdt.banner.edit',])
      .controller('BannerController', BannerController);

  function BannerController($http, $scope, $modal, $timeout) {

    var logTag = '[Banner Controller]';

    $scope.minDate = new Date();

    $scope.status = {
      opened: false,
    };

    $scope.open = function($event) {
      $scope.status.opened = true;
    };

    $scope.$on('closeEditBanner', function() {
      console.log(logTag, 'closeEditBanner');
      vm.showEditForm();
    });

    $scope.$on('bannerUpdated', function() {
      vm.showEditForm();
      vm.getBanners(vm.market, vm.language);
    });

    var vm = this;
    vm.versionPath = '/banner/v1';

    vm.showAddBanner = false;
    vm.showEditBanner = false;
    vm.formAddNewBanner = $scope.formAddNewBanner;
    vm.addSucceed = false;

    vm.market = 'FX';
    vm.language = 'EN';

    vm.bannerList = [];
    vm.newBanner = {
      market: 'FX',
      language: 'EN',
      iosLink: '',
      androidLink: '',
      display: true,
      displayUntil: null,
    };
    vm.newEmptyBanner = angular.copy(vm.newBanner);

    vm.markets = [{name: 'Forex', value: 'FX'}, {name: 'Futures', value: 'FC'}, {name: 'Stock', value: 'SC'}, {name: 'StockTW', value: 'FT'}];
    vm.languages = ['EN', 'TW', 'CN'];

    vm.showAddForm = function() {
      vm.showAddBanner = !vm.showAddBanner;
      vm.addSucceed = false;
    };

    vm.showEditForm = function() {
      vm.showAddBanner = false;
      vm.showEditBanner = !vm.showEditBanner;
    };

    vm.getBanners = function(market, language) {
      vm.bannerList = [];
      vm.market = market;
      vm.language = language;

      $http.get(vm.versionPath, {params: {market: market, language: language}})
                .success(function(data, headers) {
                  vm.bannerList = data;
                  console.log('[Get banner]', 'done', data);
                })
                .error(function(data, headers) {
                  console.log('[Get banner]', 'error', data);
                });
    };

    vm.saveNewBanner = function(file) {
      console.log('[Save new banner]', vm.newBanner);

      if (file) {
        vm.newBanner.img = file;
        vm.newBanner.fileType = file.type;
      }

      var formData = new FormData();
      for (var prop in vm.newBanner) {
        formData.append(prop, vm.newBanner[prop]);
      }

      $http.post(vm.versionPath, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
                .success(function(data, headers) {
                  console.log('[Save new banner succeed]', data);

                  vm.newBanner = angular.copy(vm.newEmptyBanner);
                  vm.addSucceed = true;

                  $scope.file = null;
                  angular.forEach(
                      angular.element('input[type=\'file\']'),
                        function(inputElem) {
                          angular.element(inputElem).val(null);
                        });

                  vm.getBanners(vm.market, vm.language);
                })
                .error(function(data, headers) {
                  console.log('[Save new banner error]', data);
                });
    };

    vm.delete = function(id) {
      var confirmed = confirm('Are you sure to delete this banner?');

      if (confirmed) {
        $http.delete(vm.versionPath + '/' + encodeURIComponent(id))
                    .success(function(data, headers) {
                      console.log('[Delete banner succeed]', data);
                      vm.getBanners(vm.market, vm.language);
                    })
                    .error(function(data, headers) {
                      console.log('[Delete banner error]', data);
                    });
      }
    };

    vm.edit = function(id) {
      console.log('edit');

      var selectedBanner = _.find(vm.bannerList, {banner_id: id});
      $scope.$broadcast('editBanner', selectedBanner);
      vm.showEditForm();
    };

    vm.convertTime = function(timeStr) {
      return moment.utc(timeStr).format('YYYY-MM-DD HH:mm:ss').toString();
    };
  }

})();
