/**
 * Created by dev0x10 on 4/16/15.
 */
'use strict';
var requestUtil = require('../utils/request-util');

module.exports = function(server) {

  server.route({
    method: 'GET', path: '/',
    handler: function(request, reply) {
      reply.view('index');
    },
  });

  server.route({
    method: 'GET', path: '/contest-bundle.js',
    handler: function(request, reply) {
      reply.file('../public/mobile/dist/contest-bundle.js');
    },
  });

  server.route({
    method: 'GET', path: '/version',
    handler: function(request, reply) {
      reply.file('../version.txt');
    },
  });

  server.route({
    method: 'GET', path: '/rest/{filename}',
    handler: function(request, reply) {
      //handle error
      var fileNames = ['fdtfccn.html', 'fdtfm.html', 'fdtfmcn.html', 'fdtfmtw.html', 'fdtsccn.html', 'setuser.html'];
      if (fileNames.indexOf(request.params.filename) > -1) {
        reply.view('rest/' + request.params.filename);
        return;
      }

      reply.view('index');
    },
  });

  server.route({
    method: 'GET', path: '/log/{filename}',
    handler: function(request, reply) {
      reply.file('../logs/' + request.params.filename);
    },
  });

  server.route({
    method: 'GET', path: '/{filename}',
    handler: {
      file: function(request) {
        return request.params.filename;
      },
    },
  });

  server.route({
    method: 'GET', path: '/img/{path*}',
    config: {
      handler: {
        directory: {path: '../public/img'},
      },
    },
  });

  server.route({
    method: 'GET', path: '/font/{path*}',
    config: {
      handler: {
        directory: {path: '../public/font'},
      },
    },
  });

  server.route({
    method: 'GET', path: '/js/{path*}',
    config: {
      handler: {
        directory: {path: '../public/js'},
      },
    },
  });

  server.route({
    method: 'GET', path: '/styles/{path*}',
    config: {
      handler: {
        directory: {path: '../public/styles'},
      },
    },
  });

  server.route({
    // 後台的路徑是從這邊開始載入的
    method: 'GET', path: '/components/{path*}', // <<< 後台URL的進入點
    config: {
      handler: {
        directory: {path: '../public/components'} // <<< 實際上對應的資料夾路徑
      },
    },
  });

  server.route({
    method: 'GET', path: '/bower_components/{path*}',
    config: {
      handler: {
        directory: {path: '../public/bower_components'},
      },
    },
  });

  server.route({
    method: 'GET', path: '/reset-password.html',
    config: {
      handler: function(request, reply) {
        reply.view('reset-password', {name: 'rayson', company: 'FDT'}); //TODO: ???????? why send that data???
      },
    },
  });

  server.route({
    method: 'GET', path: '/forget_password/resetPasswordEN.html',
    config: {
      handler: function(request, reply) {
        reply.view('forget_password/resetPasswordEN', {name: 'rayson', company: 'FDT'}); //TODO: ???????? why send that data???
      },
    },
  });

  server.route({
    method: 'GET', path: '/views/{path*}',
    config: {
      handler: {
        directory: {path: '../public/views'},
      },
    },
  });

  server.route({
    method: 'GET', path: '/mobile/{path*}',
    config: {
      handler: {
        directory: {path: '../public/mobile'},
      },
    },
  });

  server.route({
    method: 'GET', path: '/{param*}',
    handler: function(request, reply) {
      reply.view('index');
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/student/{path*}',
    config: {
      pre: [{method: requestUtil.backendCookieValidate}],
      handler: {
        directory: {
          path: '../public/components/student',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/school/{path*}',
    config: {
      pre: [{method: requestUtil.backendCookieValidate}],
      handler: {
        directory: {
          path: '../public/components/school',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/concentration/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/concentration',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/contest/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/contest',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/contestV2/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/contest-v2'
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/adBulletin/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/bulletin',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/deepLink/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/deep-link',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/systemSettings/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/system-settings',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/group/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/group',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/fuel/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/fuel',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/coin/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/coin',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/user/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/user',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/splashScreen/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/splash-screen',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/announce/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/announce',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/banner/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/banner',
        },
      },
    },
  });

  server.route({
    method: 'GET', path: '/fdt/dashboard/contest-banner/{path*}',
    config: {
      handler: {
        directory: {
          path: '../public/components/contest-banner',
        },
      },
    },
  });
};
