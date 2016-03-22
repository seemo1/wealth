(function() {
  'use strict';

  angular.module('fdt.bundle.common', ['fdt.directive.uploadFile'])
      .controller('CommonBundleController', CommonBundleController);

  function CommonBundleController($http, $rootScope, $scope, $q, $window, $timeout) {
    var vm = this;
    var logTag = '[Common Bundle Controller]';
    vm.versionPath = '/bundle/v1';
    vm.addingCategory = false;
    vm.types = ['Device', 'Language', 'Product', 'Version'];
    vm.products = ['ForexMaster', 'FuturesMaster', 'StockMaster'];
    vm.platforms = ['Android', 'AndroidInc', 'AndroidLive', 'IOS', 'IOSInc', 'IOSLive'];
    vm.stages = ['Sim', 'Inc', 'Live'];
    vm.languages = ['EN', 'TW', 'CN'];
    vm.environments = ['PROD', 'UAT', 'TEST', 'DEV'];
    vm.appIds = ['EN', 'TW', 'CN', 'A360', 'BAIDU', 'HUAWEI', 'MI', 'QQ', 'WANDO'];
    vm.type = vm.types[0];
    vm.product = vm.products[0];
    vm.platform = vm.platforms[0];
    vm.language = vm.languages[0];
    vm.stage = vm.stages[0];
    vm.appId = vm.appIds[0];
    vm.environment = vm.environments[0];

    vm.newAppId = '';
    vm.uploading = false;
    vm.versionCheck = false;
    vm.newVersion = '';
    vm.versions = [];
    vm.version = '';
    vm.versionProd = vm.versions[0];
    vm.versionUat = vm.versions[0];
    vm.versionTest = vm.versions[0];
    vm.versionDev = vm.versions[0];
    vm.fileInfo = [
        {environment: 'PROD', version: '', is_version_check: '', last_update_time: ''},
        {environment: 'UAT', version: '', is_version_check: '', last_update_time: ''},
        {environment: 'TEST', version: '', is_version_check: '', last_update_time: ''},
        {environment: 'DEV', version: '', is_version_check: '', last_update_time: ''},
    ];
    vm.versionInfoNone = {
      environment: 'NONE',
      version: 'None',
      is_version_check: 'None',
      last_update_time: 'None',
      file_name: 'None',
      file_md5: 'None',
    };
    vm.bundleList = [];
    vm.fileList = [];
    vm.update = {
      version: {
        environment: vm.environments[0],
        product: '',
        isVersionCheck: '',
        version: '',
      },
      bundle: {
        environment: vm.environments[0],
        version: '',
      },
    };

    vm.versionList = {
      platforms: angular.copy(vm.platforms),
      platform: angular.copy(vm.platform),
      products: angular.copy(vm.products),
      product: angular.copy(vm.product),
      versions: [],
      version: '',
      environments: angular.copy(vm.environments),
      environment: angular.copy(vm.environment),
    };

    vm.versionListTemp = [];
    vm.versionListInfo = [];
    vm.copyEnv = [];
    vm.copyEnv2 = [];

    vm.loadAppId = function() {
      var url = vm.versionPath.concat('/appId?product=' + vm.product + '&platform=' + vm.platform);
      $http.get(url)
                .success(function(appIds) {
                  vm.appIds = appIds;
                  vm.appId = vm.appIds[0];
                })
                .error(function(err) {
                  console.log('cannot get app id', err);
                });
    };

    vm.copyFile = function(index) {

      console.log('index:' + index);

      var env = vm.copyEnv[index];
      if (env == null) {
        env = vm.copyEnv2[index];
      }

      if (env == null) {
        alert('Error!! You don\'t Select Environment');
        return;
      }

      if (confirm('Are You Sure to Copy File to ' + env + ' ?') == true) {

        var row = vm.bundleList[index];

        if (row == null) {
          row = vm.fileList[index];
        }

        var url = vm.versionPath + '/copyFile' + '?type=' + vm.type + '&env=' + env + '&product=' + row.product + '&platform=' + row.platform +
            '&language=' + row.language + '&environment=' + row.environment + '&version=' + row.version + '&stage=' + vm.stage;

        $http.get(url)
                    .success(function(err) {

                      if (err != 'ok') {
                        alert('Copy File Fail');
                      }                      else {
                        alert('Copy File Success!');
                      }
                    })
                    .error(function(err) {
                    })
                    .finally(function() {
                      vm.loadInfo();
                    });
      }
    };

    vm.loadVersion = function() {
      var url = vm.versionPath.concat('/version/list' + '?product=' + vm.product + '&platform=' + vm.platform);
      vm.loadBundleList();
      $http.get(url)
                .success(function(versions) {
                  vm.versions = versions;
                  vm.version = vm.versions[0] ? vm.versions[0].version : '';
                  vm.fileInfo[0] = _.where(vm.versions, {
                    environment: 'PROD',
                    product: vm.product,
                    platform: vm.platform,
                  })[0] || vm.versionInfoNone;
                  vm.fileInfo[1] = _.where(vm.versions, {
                    environment: 'UAT',
                    product: vm.product,
                    platform: vm.platform,
                  })[0] || vm.versionInfoNone;
                  vm.fileInfo[2] = _.where(vm.versions, {
                    environment: 'TEST',
                    product: vm.product,
                    platform: vm.platform,
                  })[0] || vm.versionInfoNone;
                  vm.fileInfo[3] = _.where(vm.versions, {
                    environment: 'DEV',
                    product: vm.product,
                    platform: vm.platform,
                  })[0] || vm.versionInfoNone;
                  vm.versionProd = vm.fileInfo[0].version;
                  vm.versionUat = vm.fileInfo[1].version;
                  vm.versionTest = vm.fileInfo[2].version;
                  vm.versionDev = vm.fileInfo[3].version;
                })
                .error(function(err) {
                  console.log('cannot get app id', err);
                });
    };

    vm.loadBundleList = function() {
      var url = vm.versionPath + '/version/list/bundle?platform=' + vm.platform;
      $http.get(url)
                .success(function(bundleList) {
                  vm.bundleList = bundleList;
                })
                .error(function(err) {
                  console.error(logTag, 'loadBundleList', err);
                });
    };

    vm.loadInfo = function() {
      vm.copyEnv = [];
      vm.copyEnv = [];
      if (vm.type == 'Version') {
        vm.loadVersion();
        vm.refreshAppIdList(vm.platform);
      }      else {
        var query = '';

        if (vm.type === 'Device') {
          query = 'type=device&product=' + vm.product + '&platform=' + vm.platform + '&language=' + vm.language;
        }        else if (vm.type === 'Language') {
          query = 'type=language&language=' + vm.language;
        }        else if (vm.type === 'Product') {
          query = 'type=product&product=' + vm.product + '&stage=' + vm.stage;
        }

        if (vm.type !== 'Version') {
          var url = vm.versionPath + '/fileinfo?' + query;
          $http.get(url)
                        .success(function(fileInfo) {
                          vm.fileList = fileInfo;
                          vm.fileInfo[0] = _.where(fileInfo, {environment: 'PROD'})[0] || vm.versionInfoNone;
                          vm.fileInfo[1] = _.where(fileInfo, {environment: 'UAT'})[0] || vm.versionInfoNone;
                          vm.fileInfo[2] = _.where(fileInfo, {environment: 'TEST'})[0] || vm.versionInfoNone;
                          vm.fileInfo[3] = _.where(fileInfo, {environment: 'DEV'})[0] || vm.versionInfoNone;
                        })
                        .error(function(err) {
                          console.log(err);
                        })
                        .finally(function() {
                          $timeout(function() {
                            $scope.$apply();
                          }, 0);
                        });
        }
      }
    };

    vm.addVersion = function() {
      if (!vm.newVersion) {
        alert('Version number cannot be blank!');
        return;
      }

      if (_.pluck(vm.versions, 'version').indexOf(vm.newVersion) > -1) {
        alert('Version already exist!');
        return;
      }

      var url = vm.versionPath.concat('/version/add');
      var newVersion = {
        product: vm.product,
        version: vm.newVersion,
        environment: vm.environment,
        platform: vm.platform,
        appid: vm.appId,
        is_version_check: vm.versionCheck ? '1' : '0',
      };

      $http.post(url, newVersion)
                .success(function(res) {
                  alert('New version added!');
                  vm.loadVersionList();
                })
                .error(function(err) {
                  alert('Sorry! Server error! Cannot add new version');
                  console.error(logTag, err);
                })
                .finally(function() {
                  vm.loadVersion();
                  vm.newVersion = '';
                  vm.versionCheck = false;
                  vm.environment = vm.environments[0];
                });
    };

    vm.updateVersion = function() {
      var url = vm.versionPath.concat('/version/update');
      var updateVersion = {
        product: vm.versionList.product,
        version: vm.versionList.version,
        environment: vm.versionList.environment,
        platform: vm.versionList.platform,
      };

      $http.post(url, updateVersion)
                .success(function(res) {
                  vm.loadVersionList();
                  alert('Version updated!');
                })
                .error(function(err) {
                  console.error(logTag, 'update version', err);
                });
    };

    vm.uploadBundle = function() {
      var bundleFile = $scope.newBundleFile;
      var url = vm.versionPath.concat('/' + vm.type.toLowerCase());

      //check bundle file
      if (!bundleFile) {
        alert('Please select a bundle file for upload!');
        return;
      }

      //if version check whether version is selected
      if (vm.type === 'Version') {
        if (!vm.appId) {
          alert('Please select appId!');
          return;
        }

        if (!vm.version) {
          alert('Please select version!');
          return;
        }
      }

      var validFileName = vm.checkFileName(bundleFile.name, vm.type);
      if (!validFileName) {
        alert('Invalid file name! The filename must be ' + vm.type + '.zip');
        return;
      }

      var formData = new FormData();

      formData.append('product', vm.product);
      formData.append('platform', vm.platform);
      formData.append('stage', vm.stage);
      formData.append('language', vm.language);
      formData.append('appid', vm.appId);
      formData.append('version', vm.version);
      formData.append('file_name', bundleFile.name);
      formData.append('file_type', bundleFile.type);
      formData.append('file_content', bundleFile);
      formData.append('environment', vm.update.bundle.environment);

      $http.post(url, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
      })
                .success(function(res) {
                  vm.uploading = false;
                  vm.loadInfo();
                  alert('Bundle uploaded successfully!');
                })
                .error(function(err) {
                  vm.uploading = false;
                  alert('Bundle upload failed!');
                });
    };

    vm.checkFileName = function(fileName, type) {
      return type + '.zip' === fileName;
    };

    vm.downloadBundle = function(fileListIndex) {
      var selectedBundle = vm.fileList[fileListIndex];
      if (selectedBundle) {
        var query = '';
        if (vm.type === 'Device') {
          query = 'type=device&product=' + selectedBundle.product +
              '&platform=' + selectedBundle.platform +
              '&language=' + selectedBundle.language +
              '&environment=' + selectedBundle.environment;
        }        else if (vm.type === 'Language') {
          query = 'type=language&language=' + selectedBundle.language + '&environment=' + selectedBundle.environment;
        }        else if (vm.type === 'Product') {
          query = 'type=product&product=' + selectedBundle.product + '&environment=' + selectedBundle.environment + '&stage=' + selectedBundle.stage;
        }

        var url = vm.versionPath + '/download?' + query;
        $timeout(function() {
          $window.open(url);
        }, 500);
      }

    };

    //TODO: can be mixed with downloadBundle method
    vm.downloadBundleVersion = function(bundleIndex) {
      var selectedBundle = vm.bundleList[bundleIndex];
      var query = 'type=version&product=' + selectedBundle.product +
          '&platform=' + selectedBundle.platform +
          '&language=' + selectedBundle.language +
          '&version=' + selectedBundle.version;
      var url = vm.versionPath + '/download?' + query;
      $timeout(function() {
        $window.open(url);
      }, 500);
    };

    vm.refreshAppIdList = function(platform) {
      if (platform.toLowerCase().indexOf('android') > -1) {
        vm.appIds = ['EN', 'TW', 'CN', 'A360', 'BAIDU', 'HUAWEI', 'MI', 'QQ', 'WANDO'];
      }      else if (platform.toLowerCase().indexOf('ios') > -1) {
        vm.appIds = ['EN', 'TW', 'CN'];
      }
    };

    vm.loadVersionList = function() {
      vm.versionListInfo = [];
      var url = vm.versionPath.concat('/version/all' + '?product=' + vm.versionList.product);
      $http.get(url)
                .success(function(versionList) {
                  vm.versionListTemp = versionList;
                  vm.reloadVersionList();
                })
                .error(function(err) {
                  console.log(err);
                });
    };

    vm.reloadVersionList = function() {
      var tempVersion = _.where(vm.versionListTemp, {platform: vm.versionList.platform});
      vm.versionList.versions = _.uniq(_.pluck(tempVersion, 'version'));
      vm.versionList.version = vm.versionList.versions[0];
      vm.versionList.environment = _.pluck(_.where(tempVersion, {version: vm.versionList.version}), 'environment')[0];
      vm.versionListInfo = _.where(vm.versionListTemp, {
        version: vm.versionList.version,
        environment: vm.versionList.environment,
        platform: vm.versionList.platform,
      });
    };

    vm.reloadVersionListInfo = function() {
      vm.versionList.environment = _.pluck(_.where(vm.versionListTemp,
          {version: vm.versionList.version, platform: vm.versionList.platform}), 'environment')[0];
      vm.versionListInfo = _.where(vm.versionListTemp, {
        version: vm.versionList.version,
        environment: vm.versionList.environment,
        platform: vm.versionList.platform,
      });
    };

    vm.updateVersionCheck = function(selectedVersionIndex) {
      var selectedVersion = vm.versionListInfo[selectedVersionIndex];
      var url = vm.versionPath.concat('/version/updateVersionCheck');

      var updateVersion = {
        product: vm.versionList.product,
        version: selectedVersion.version,
        platform: selectedVersion.platform,
        isVersionCheck: selectedVersion.is_version_check,
        appid: selectedVersion.appid,
      };

      $http.post(url, updateVersion)
          .success(function(res) {})
                .error(function(err) {
                  console.error(logTag, 'update version', err);
                });
    };
  }

})();
