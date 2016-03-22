(function() {

  angular.module('fdt.adBulletin.directive.listDir', [])
      .directive('adBulletinListDir', AdBulletinListDir)

  AdBulletinListDir.$inject = [];
  function AdBulletinListDir() {
    return {
      restrict: 'E',
      templateUrl: '/components/bulletin/bulletin-list.html',
      controller: AdBulletinListCtrl,
      controllerAs: 'adBulletinListCtrl',
      bindToController: true
    };
  }

  AdBulletinListCtrl.$inject = ['adBulletinService', '$scope'];
  function AdBulletinListCtrl(adBulletinService, $scope) {
    var vm = this;

    vm.languages = [
      {name: 'EN'},
      {name: 'TW'},
      {name: 'CN'}
    ];

    vm.selectedLanguages = vm.languages[0];
    vm.bulletins = [];

    vm.get = function () {
      adBulletinService.get(vm.selectedLanguages.name)
          .then(function (res) {
            vm.bulletins = res.data;
          }, function (err) {
            console.log(err);
          });
    };

    vm.delete = function(index) {
      if(confirm('Are you sure you want to delete?')) {
        $scope.$emit('deleteAdBulletin', vm.bulletins[index]);
      }
    };

    $scope.$on('refreshAdBulletin', function () {
      vm.get();
    });

    vm.get();

  }

})();
