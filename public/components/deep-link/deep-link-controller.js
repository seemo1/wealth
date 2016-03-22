(function() {

  angular.module('fdt.deepLink', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'fdt.deepLink.edit',])
      .controller('DeepLinkController', DeepLinkController);
  function DeepLinkController($http, $scope, $modal, $timeout) {

    var vm = this;
    vm.versionPath = '/deep-link/v1';

    vm.showAddDeepLink = false;
    vm.formAddNewLink = $scope.formAddNewLink;
    vm.addSucceed = false;

    vm.deepLinkList = [];
    vm.newLink = {};
    vm.newEmptyLink = angular.copy(vm.newLink);

    vm.query = {
      link: '',
      iosPath: '',
      androidPath: '',
    };

    vm.getLinks = function(number) {

      console.log('[Get deep link]');

      $http.get(vm.versionPath)
                .success(function(data, headers) {
                  vm.deepLinkList = data;
                  console.log('[Get deep link]', 'done', data);
                })
                .error(function(data, headers) {
                  console.log('[Get deep link]', 'error', data);
                });
    };

    vm.showAddForm = function() {
      vm.showAddDeepLink = !vm.showAddDeepLink;
      vm.addSucceed = false;
    };

    vm.saveNewLink = function() {

      console.log('[Save new link]', vm.newLink);

      var formData = new FormData();
      for (var prop in vm.newLink) {
        formData.append(prop, vm.newLink[prop]);
      }

      $http.post(vm.versionPath, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
                .success(function(data, headers) {
                  console.log('[Save new link succeed]', data);

                  vm.newLink = angular.copy(vm.newEmptyLink);
                  vm.addSucceed = true;
                  vm.getLinks();
                })
                .error(function(data, headers) {
                  console.log('[Save new link error]', data);
                });
    };

    vm.delete = function(link) {
      var confirmed = confirm('Are you sure to delete this link?');

      if (confirmed) {
        $http.delete(vm.versionPath + '/' + encodeURIComponent(link))
                    .success(function(data, headers) {
                      console.log('[Delete link succeed]', data);
                      vm.getLinks();
                    })
                    .error(function(data, headers) {
                      console.log('[Delete link error]', data);
                    });
      }
    };

    vm.edit = function(link) {
      vm.selectedLink = _.where(vm.deepLinkList, {link: link})[0];
      console.log('[Edit deep link]', 'edit', vm.selectedLink);

      //REF: https://angular-ui.github.io/bootstrap/ (modal)
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'edit-deep-link.html',
        controller: 'EditDeepLinkController',
        controllerAs: 'editDeepLink',
        resolve: {
          deepLink: function() {
            return vm.selectedLink;
          },
        },
      });

      modalInstance.result.then(function(result) {
        console.log('[Edit deep link]', 'reload deep link list');
        $timeout(vm.getLinks(), 2000);
        vm.getLinks(); //reload school list
      }, function() {

        console.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.convertTime = function(timeStr) {
      return moment.utc(timeStr).format('YYYY-MM-DD HH:mm:ss').toString();
    };
  }

})();
