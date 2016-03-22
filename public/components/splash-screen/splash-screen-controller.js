(function() {

  angular.module('fdt.splashScreen', [
        'ngRoute',
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ngFileUpload',
        'fdt.service.splashScreen'])
      .controller('SplashScreenController', SplashScreenController);

  //TODO: rename editFormSplashScreen and editSplashScreen :D
  //otherwise you will confuse using it
  SplashScreenController.$inject = ['splashScreenService', '$scope', '$timeout', '$route'];
  function SplashScreenController(splashScreenService, $scope, $timeout, $route) {
    var vm = this;

    vm.list = [];
    vm.selectedImageId = '';
    vm.addFormShow = false;
    vm.regionList = [
        {code: 'US', checked: false},
        {code: 'TW', checked: false},
        {code: 'HK', checked: false},
        {code: 'IN', checked: false},
        {code: 'GB', checked: false},
        {code: 'CN', checked: false},
        {code: 'OTHERS', checked: false},
    ];
    vm.editRegionList = [];
    vm.selectedRegion = [];
    vm.calendarOpened = false;
    vm.newSplashScreen = {
      displayUntil: '',
      regions: [],
      display: false,
      image: null,
      androidLink: '',
      iosLink: '',
    };
    vm.minDate = new Date();
    vm.formSplashScreen = $scope.formSplashScreen;
    vm.uploadSuccess = false;
    vm.uploadError = false;
    vm.errorMessage = false;
    vm.uploading = false;
    vm.ungroupedSplashScreen = [];
    vm.editFormShow = false;
    vm.editFormSplashScreen = $scope.editFormSplashScreen;
    vm.editSplashScreen = {};

    vm.get = function() {
      splashScreenService.get()
                .success(function(splashScreens) {
                  vm.list = [];
                  vm.ungroupedSplashScreen = angular.copy(splashScreens);

                  //grouping the screen splash list by region
                  var list = _.groupBy(splashScreens, 'splash_screen_id');
                  for (var prop in list) {
                    var regions = [];
                    list[prop].forEach(function(obj) {
                      regions.push(obj.region);
                    });

                    list[prop][0].region = regions.join(', ');
                    vm.list.push(angular.copy(list[prop][0]));
                  }

                  $timeout(function() {
                    $scope.$apply();
                  }, 100);
                })
                .error(function(err) {
                  console.error(err);
                });
    };

    vm.setAsDefault = function(index) {
      if (confirm('Are you sure you want to change the default splash screen?')) {
        var selectedImage = vm.images[index];
        vm.selectedImageId = selectedImage.id;
      }
    };

    vm.showHideAddForm = function() {
      vm.addFormShow = !vm.addFormShow;
      vm.resetAddForm();
      vm.get();
      vm.uploadSuccess = false;
      vm.uploadError = false;
      if (!vm.addFormShow) {
        $route.reload();
      }
    };

    vm.showHideEditForm = function() {
      vm.editSplashScreen = {};
      if (arguments[0] > -1) {
        vm.editFormSplashScreen.$setPristine();
        vm.editSplashScreen = angular.copy(vm.list[arguments[0]]);
        vm.editSplashScreen.display_until = new moment(vm.editSplashScreen.display_until).format('YYYY-MM-DD').toString();
        vm.editSplashScreen.display = (vm.editSplashScreen.display == 1);

        //hacky for checking region @@ --------
        vm.editRegionList = angular.copy(vm.regionList);
        var tempRegion = vm.editSplashScreen.region;

        //check if it has more than 1 region, if yes then convert to array
        if (tempRegion.indexOf(',') > -1) {
          tempRegion = tempRegion.split(',');
          tempRegion.forEach(function(r) {
            r = r.trim();
          });
        }        else {
          tempRegion = [tempRegion];
        }

        vm.editRegionList.forEach(function(r) {
          tempRegion.forEach(function(t) {
            if (r.code === t.trim()) { //remove whitespace
              r.checked = true;
            }
          });
        });

        //---------------------------------------

        delete vm.editSplashScreen['image'];
      }      else {
        vm.get();
      }

      vm.editFormShow = !vm.editFormShow;
    };

    vm.resetAddForm = function() {
      vm.newSplashScreen = {
        displayUntil: '',
        regions: [],
        display: false,
        image: null,
        androidLink: '',
        iosLink: '',
      };
      $scope.splashImage = null;
      document.getElementById('formSplashScreen').reset();
    };

    vm.toggleRegion = function(region) {
      var regionIndex = vm.newSplashScreen.regions.indexOf(region);
      if (regionIndex > -1) {
        vm.newSplashScreen.regions.splice(regionIndex, 1);
      }      else {
        vm.newSplashScreen.regions.push(region);
      }
    };

    vm.openCalendar = function() {
      vm.calendarOpened = true;
    };

    vm.intersectedRegions = function(checkedRegions) {
      var regions = vm.ungroupedSplashScreen.map(function(l) {
        return l.region;
      });

      return _.intersection(checkedRegions, regions);
    };

    vm.save = function(file) {

      vm.uploadSuccess = false;
      vm.uploadError = false;

      //check if any region selected
      if (vm.newSplashScreen.regions.length < 1) {
        alert('Please select at least one region!');
        return;
      }

      //check whether selected region already used in another splash screen
      var intersectedRegions = vm.intersectedRegions(vm.newSplashScreen.regions);
      if (intersectedRegions.length > 0) {
        alert('Region ' + intersectedRegions.join(',') + ' already exists!');
        return;
      }

      vm.uploading = true;

      if (file) {
        vm.newSplashScreen.image = file;
      }

      vm.newSplashScreen.displayUntil = new moment(new Date(vm.newSplashScreen.displayUntil)).format('YYYY-MM-DD').toString();
      vm.newSplashScreen.display = (vm.newSplashScreen.display == true) ? 1 : 0; //convert into tinyint

      var data = new FormData();
      for (var property in vm.newSplashScreen) {
        data.append(property, vm.newSplashScreen[property]);
      }

      splashScreenService.add(data)
                .success(function(res) {
                  vm.resetAddForm();
                  vm.uploadSuccess = true;
                })
                .error(function(err) {
                  vm.uploadError = true;
                  vm.errorMessage = err;
                })
                .finally(function() {
                  vm.uploading = false;
                });
    };

    vm.delete = function(index) {
      if (confirm('Are you sure you want to delete the splash screen?')) {
        var selectedSplash = vm.list[index];
        splashScreenService.delete(selectedSplash.splash_screen_id)
                    .success(function() {
                      $route.reload();
                    })
                    .error(function(err) {
                      alert('Failed on deleting splash screen! Please try again!');
                    });
      }
    };

    vm.updateRegion = function(region) {
      vm.editRegionList.forEach(function(r) {
        if (r.code == region.code) {
          r.checked = !r.checked;
        }
      });
    };

    vm.changeEditDisplay = function() {
      if (vm.editSplashScreen.display == true) {
        vm.editSplashScreen.display = false;
      }      else {
        vm.editSplashScreen.display = true;
      }
    };

    //別問我別問我別問我 @_@
    //should be simplified!
    vm.update = function(file) {

      if (!confirm('Are you sure you want to update?')) {
        return;
      }

      if (file) {
        vm.editSplashScreen.image = file;
      }

      //get regions
      var regions = _.where(vm.editRegionList, {checked: true});
      regions = _.map(regions, function(r) {
        return r.code;
      });

      //check if region checked
      if (regions.length < 1) {
        alert('No region selected!');
        return;
      }

      //remove original checked region
      var originalRegion = vm.editSplashScreen.region;
      if (originalRegion.indexOf(',') > -1) {
        originalRegion = originalRegion.split(',');

        var o = [];
        originalRegion.forEach(function(r) {
          o.push(r.trim());//need to remove whitespace
        });

        originalRegion = o;
      }      else {
        originalRegion = [originalRegion.trim()]; //need to remove whitespace
      }

      //check if original region checked
      var tempOriginalRegion = angular.copy(originalRegion);
      originalRegion.forEach(function(r) {
        vm.editRegionList.forEach(function(l) {
          if (l.code === r) {
            if (l.checked === false) {
              tempOriginalRegion = _.without(tempOriginalRegion, l.code);
            }
          }
        });
      });

      originalRegion = tempOriginalRegion;

      var newRegions = _.xor(regions, originalRegion); //remove original regions for checking

      //check if selected region exist on another splash screen
      var intersectedRegions = vm.intersectedRegions(newRegions);
      if (intersectedRegions.length > 0) {
        alert('Region ' + intersectedRegions.join(',') + ' already exists!');
        return;
      }

      vm.uploading = true;

      vm.editSplashScreen.regions = regions;
      vm.editSplashScreen.display = (vm.editSplashScreen.display == true) ? 1 : 0;
      vm.editSplashScreen.display_until = moment(vm.editSplashScreen.display_until).format('YYYY-MM-DD').toString();

      var data = new FormData();
      for (var property in vm.editSplashScreen) {
        data.append(property, vm.editSplashScreen[property]);
      }

      splashScreenService.update(data)
                .success(function(res) {
                  location.reload();
                })
                .error(function(err) {
                  alert('Failed on updating splash screen!');
                  console.error(err);
                })
                .finally(function() {
                  vm.uploading = false;
                });
    };

  }

  //TODO: create new file for this
  angular.module('fdt.service.splashScreen', [])
      .factory('splashScreenService', SplashScreenService);

  SplashScreenService.$inject = ['$http'];
  function SplashScreenService($http) {
    var splashScreenService = {};
    var rootPath = '/backend/splashScreens';

    splashScreenService.get = function() {
      return $http.get(rootPath, {cache: false});
    };

    splashScreenService.add = function(newSplashScreen) {
      return $http.post(rootPath, newSplashScreen, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      });
    };

    splashScreenService.delete = function(splashScreenId) {
      return $http.delete(rootPath + '/' + splashScreenId);
    };

    splashScreenService.update = function(splashScreen) {
      return $http.put(rootPath, splashScreen, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      });
    };

    return splashScreenService;
  }
})();
