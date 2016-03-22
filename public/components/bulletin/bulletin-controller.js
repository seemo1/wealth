(function() {
  angular.module('fdt.adBulletin', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'fdt.adBulletin.service'])
      .controller('AdBulletinCtrl', AdBulletinCtrl);

  AdBulletinCtrl.$inject = ['adBulletinService', '$scope'];
  function AdBulletinCtrl(adBulletinService, $scope) {
    var vm = this;
    vm.title = 'Ad Bulletin';
    vm.languages = [
      {name: 'EN'},
      {name: 'TW'},
      {name: 'CN'}
    ];
    vm.dateNow = new Date();
    vm.selectedLanguages = vm.languages[0];
    vm.isStartTimeOpened = false;
    vm.isEndTimeOpened = false;
    vm.startTime = new Date();
    vm.startDate = '';
    vm.endTime = new Date();
    vm.endDate = '';
    vm.newBulletin = {
      language: '',
      title: '',
      startDateTime: '',
      endDateTime: '',
      runningTime: 8,
      link: '',
      sequence: '',
    };
    vm.error = false;
    vm.succeed = false;
    vm.requesting = false;

    vm.openStartTime = function() {
      vm.isStartTimeOpened = !vm.isStartTimeOpened;
    };

    vm.openEndTime = function() {
      vm.isEndTimeOpened = !vm.isEndTimeOpened;
    };

    vm.add = function() {
      vm.error = false;
      vm.succeed = false;
      vm.requesting = true;
      vm.newBulletin.language = vm.selectedLanguages.name;

      //working with date time format
      var endTime = moment(vm.endTime).format('HH:mm').toString();
      var endDate =moment(vm.endDate).format('YYYY-MM-DD').toString();
      var startTime = moment(vm.startTime).format('HH:mm').toString();
      var startDate =moment(vm.startDate).format('YYYY-MM-DD').toString();
      vm.newBulletin.startDateTime = moment(startDate + ' ' + startTime).toDate();
      vm.newBulletin.endDateTime = moment(endDate + ' ' + endTime).toDate();

      adBulletinService.add(vm.newBulletin)
        .then(function(res) {
          vm.error = false;
          vm.succeed = true;
          $scope.$emit('refreshAdBulletin');
          vm.resetForm();
        }, function(err) {
          vm.error = true;
          vm.errorMsg = err.data.message;
        })
        .finally(function() {
          vm.requesting = false;
        });
    };

    vm.resetForm = function() {
      vm.newBulletin = {
        language: '',
        title: '',
        startDateTime: '',
        endDateTime: '',
        runningTime: 8,
        link: '',
        sequence: '',
      };
      vm.startDate = '';
      vm.endDate = '';
      vm.startTime = new Date();
      vm.endTime = new Date();
      vm.selectedLanguages = vm.languages[0];
    };

    $scope.$on('deleteAdBulletin', function(e, obj) {
      adBulletinService.delete(obj.seq, obj.language)
          .then(function (res) {
            $scope.$emit('refreshAdBulletin');
          }, function (err) {
            console.error(err);
          });
    })
  }

  angular.module('fdt.adBulletin.service', [])
      .factory('adBulletinService', AdBulletinService);

  AdBulletinService.$inject = ['$http'];
  function AdBulletinService($http) {
    var adBulletin = {};
    var baseUrl = '/backend/contests/adBulletin';

    adBulletin.add = function(newBulletin) {
      var url = baseUrl + '/';

      return $http.post(url, newBulletin);
    };

    adBulletin.get = function(language) {
      var url = baseUrl + '/?language=' + language;
      return $http.get(url);
    };

    adBulletin.delete = function(sequence, language) {
      var url = baseUrl + '/?language=' + language + '&sequence=' + sequence;
      return $http.delete(url);
    };

    return adBulletin;
  }

})();
