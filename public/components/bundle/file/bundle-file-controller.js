(function() {

  angular.module('fdt.bundle.file', ['fdt.directive.bundleFile'])
      .controller('BundleFileController', BundleFileController);

  function BundleFileController($scope, $http, $q) {
    var vm = this;
    vm.versionPath = '/v0';
    vm.bundleData = {};
    vm.bundleList = [
        {environment: 'DEV', files: []},
        {environment: 'PROD', files: []},
        {environment: 'UAT', files: []},
        {environment: 'TEST', files: []},
    ];
    vm.showUpload = false;
    vm.selectedEnvironment = '';
    vm.newBundleTemplate = {
      product: '',
      device: '',
      market: '',
      note: '',
      version: '',
      environment: '',
    };
    vm.newBundleFile = {};
    vm.uploadError = false;
    vm.uploadSucceed = false;
    vm.uploading = false;
    vm.fileList = [];
    vm.tabs = [
        {title: 'Environment'},
        {title: 'Files (' + vm.fileList.length + ')'},
    ];

    $scope.$on('loadBundleFile', function(event, bundleData) {
      console.log('[Load Bundle File] event received');
      vm.fileList = [];
      vm.tabs[1].title = 'Files (' + vm.fileList.length + ')';
      vm.bundleData = bundleData;
      vm.loadBundleFiles(bundleData);
    });

    vm.loadBundleFiles = function(bundleData) {
      vm.fileList = [];
      vm.bundleList = [];
      console.log('[Load Bundle Files]', bundleData);
      var endPoint = vm.versionPath.concat('/bundle/product/' + bundleData.product + '/device/' + bundleData.device + '/market/' + bundleData.market);
      $http.get(endPoint)
                .success(function(data, headers) {
                  if (data.length == 0) return;

                  vm.bundleList = data;
                  vm.newBundleTemplate.product = data[0].project;
                  vm.newBundleTemplate.device = data[0].device;
                  vm.newBundleTemplate.market = data[0].market;
                  vm.showUpload = false;
                  vm.fileList = _.pluck(vm.bundleList, 'files');
                  convertTime(vm.bundleList);

                  //TODO: figure out how to use lodash merging file list arrays
                  var tempFileList = [];
                  _.forEach(vm.fileList, function(file) {
                    _.forEach(file, function(f) {
                      tempFileList.push(f);
                    });
                  });

                  vm.fileList = tempFileList;
                  convertTime(vm.fileList);
                  vm.tabs[1].title = 'Files (' + vm.fileList.length + ')';
                  console.log('[Load Bundle Files - Done]', data);
                })
                .error(function(data, headers) {
                  console.log('[ERROR loadBundleFiles]', data);
                });
    };

    vm.showUploadForm = function() {
      vm.showUpload = !vm.showUpload;
    };

    vm.closeUploadForm = function() {
      vm.showUpload = false;
      vm.loadBundleFiles(vm.bundleData);
    };

    vm.tabChanged = function(tabName) {
      vm.selectedEnvironment = tabName;
      vm.newBundleTemplate.environment = vm.selectedEnvironment;
      console.log('[Tab Changed]', tabName);
    };

    vm.upload = function() {
      if (!$scope.newBundleFile || !vm.newBundleTemplate.version) {
        vm.uploadError = true;
        return;
      }

      console.log(vm.fileList);
      if (_.where(vm.fileList, {version: vm.newBundleTemplate.version}).length > 0) {
        var updateConfirm = confirm('Bundle version ' + vm.newBundleTemplate.version + ' is exist. Do you want to continue?');
        if (!updateConfirm) {
          return;
        }        else {
          vm.updateBundle();
          return;
        }

      }

      console.log('[UPLOAD BUNDLE]', vm.newBundleTemplate);

      vm.uploading = true;
      vm.uploadError = false;

      vm.addBundle();

    };

    vm.changeVersion = function(index) {

      var selectedBundle = vm.bundleList[index];

      if (selectedBundle.version === 'None' || !selectedBundle.version) {
        alert('Please select version');
        return;
      }

      delete selectedBundle['files'];
      $http.put(vm.versionPath.concat('/bundle/version'), selectedBundle)
                .success(function(data, headers) {
                  console.log('[Save Version]: ', data);
                  vm.loadBundleFiles(vm.bundleData);
                })
                .error(function(data, headers) {
                  console.log('[Save Version Error]: ', data);
                });
    };

    vm.changeVersionCheck = function(index) {
      var changedBundle = vm.bundleList[index];
      $http.put(vm.versionPath.concat('/bundle/versionCheck'), changedBundle)
                .success(function(data, headers) {
                  console.log();
                })
                .error(function(data, headers) {
                  console.log('[Change Version Check Error]: ', data);
                });
    };

    vm.hideError = function() {
      vm.uploadError = false;
    };

    vm.cancel = function() {
      vm.showUpload = false;
    };

    //TODO: should create bundle service -------------------------
    vm.updateBundle = function() {
      console.log('[Update Bundle]');
      var formData = new FormData();
      formData.append('file_name', $scope.newBundleFile.name);
      formData.append('file_type', $scope.newBundleFile.type);

      for (var prop in vm.newBundleTemplate) {
        formData.append(prop, vm.newBundleTemplate[prop]);
      }

      var uploadUrl = vm.versionPath.concat('/bundle/file');

      convertToBase64($scope.newBundleFile)
          .then(
                function(base64String) {
                  formData.append('file_content', base64String); //append encoded file

                  $http.put(uploadUrl, formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined},
                  })
                        .success(function(data, headers) {
                          vm.uploading = false;
                          vm.uploadSucceed = true;
                        })
                        .error(function(data, headers) {
                          console.log('error');
                          vm.uploading = false;
                        });
                },

                function(error) {
                  alert('Sorry fatal error! Please contact developer');
                });
    };

    vm.addBundle = function() {
      console.log('[Add Bundle]');
      var formData = new FormData();
      formData.append('file_name', $scope.newBundleFile.name);
      formData.append('file_type', $scope.newBundleFile.type);

      for (var prop in vm.newBundleTemplate) {
        formData.append(prop, vm.newBundleTemplate[prop]);
      }

      var uploadUrl = vm.versionPath.concat('/bundle/file');

      convertToBase64($scope.newBundleFile)
          .then(
                function(base64String) {
                  formData.append('file_content', base64String); //append encoded file

                  $http.post(uploadUrl, formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined},
                  })
                        .success(function(data, headers) {
                          vm.uploading = false;
                          vm.uploadSucceed = true;
                        })
                        .error(function(data, headers) {
                          console.log('error', data);
                          vm.uploading = false;
                        });
                },

                function(error) {
                  alert('Sorry fatal error! Please contact developer');
                });
    };

    //------------------------------------ END OF TO DO

    function convertToBase64(data) {
      var deferred = $q.defer();
      var reader = new FileReader();
      reader.onload = function(event) {
        var base64String = event.target.result;
        deferred.resolve(btoa(base64String));
      };

      reader.readAsBinaryString(data);
      return deferred.promise;
    }

    function convertTime(bundleList) {
      _.forEach(bundleList, function(bundle) {
        bundle.localUpdateTime = moment.utc(bundle.last_update_time).format('YYYY-MM-DD HH:mm:ss').toString();
      });
    }
  }

})();
