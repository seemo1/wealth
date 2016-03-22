'use strict';

//INFO: Remember that HapiJS request is order based
module.exports = function(server) {


  //Open this only if needed
  //require('../modules/settings-module/settings-router')(server);
  //require('../modules/storage-module/v0/storage-router')(server);
  //require('../modules/server-status-module/server-status-router')(server);
  //require('../modules/deep-link-module/deep-link-router')(server);
  //require('../modules/fix-module/fix-router')(server);

  //TODO: remove this if not used anymore
  server.route({
    path: '/apis/im/test',
    method: 'GET',
    handler: function(request, reply) {
      setTimeout(function () {
        reply('ok');
      }, 3000);
    },
  });

  //INFO:keep this at the bottom
  require('./static')(server);
};
