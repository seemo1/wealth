(function() {

  angular.module('fdt.serverActivator', [])
      .controller('ServerActivatorController', ServerActivatorController);

  function ServerActivatorController($http) {
    var vm = this;
    vm.versionPath = '/server/v0/status';
    vm.servers = [];
    vm.toggle = true;

    vm.getStatus = function() {
      $http.get(vm.versionPath)
                .success(function(data) {
                  _.forEach(data, function(d) {
                    d.statusBool = d.status == 'Y' ? true : false;
                  });

                  vm.servers = data;
                  console.log('[Server Activator] ', 'received', vm.servers);
                })
                .error(function(err) {
                  console.log('[Server Activator Error] ', 'get', err);
                });
    };

    //TODO: should be a service
    vm.convertTime = function(timeStr) {
      return moment.utc(timeStr).format('YYYY-MM-DD HH:mm:ss').toString();
    };

    vm.activate = function(index) {
      var confirmed = confirm('Are you sure you want to change server status?');
      var server = vm.servers[index];
      if (confirmed) {
        server.status = server.statusBool ? 'Y' : 'N';
        $http.put(vm.versionPath, server)
                    .success(function(res) {
                      console.log('[Server Activator]', 'activated');
                      vm.getStatus();
                    })
                    .error(function(err) {
                      console.log('[Server Activator Error]', err);
                    });
      }      else {
        server.statusBool = !server.statusBool;
        server.status = server.statusBool ? 'Y' : 'N';
      }

    };
  }

})();
