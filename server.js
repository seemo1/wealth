'use strict';

const colors = require('colors');
const Config = require('config');
const Inert = require('inert');
const Path = require('path');
const Hapi = require('hapi');
const Swig = require('swig');
const MySqlCommon = require('./commonlib/mysql-common');
const RedisCommon = require('./commonlib/redis-common');
const SettingsCommon = require('./commonlib/settings-common')
const RabbitMQCommon = require('./commonlib/rabbitmq-common')
const Logger = require('./commonlib/logger');
const Boom = require('./commonlib/boom');

// Create a server with a host and port
const server = new Hapi.Server({
  cache: [
    {
      name: 'redisCache',
      engine: require('catbox-redis'),
      host: Config.get('Redis.host'),
      port: Config.get('Redis.port'),
      partition: 'cache',
    },
  ],
});
global.MySqlConn = {};
global.RedisConn = {};
global.SystemSettings = {};
global.MQconn = {};

server.connection({
  host: Config.get('Server.host'),
  port: Config.get('Server.port'),
  labels: ['api'],
  app: {
    swagger: {
      info: {
        title: 'FDT API Docs',
        description: 'Financial Data Technologies - Social Platform API',
      },
    },
  },
  routes: {
    cors: true
    /*
       The Cross-Origin Resource Sharing protocol allows browsers to make cross-origin API calls.
       CORS is required by web applications running inside a browser which are loaded from a different domain than the API server.
       CORS headers are disabled by default (false). To enable, set cors to true, or to an object with the following options:
    */
  },
});

server.register(require('./plugins'), (err) => {
  if (err) {
    throw err;
  }

  //mysql connection options;
  let mysqlOption = Config.get('MySQL');
  global.MySqlConn = new MySqlCommon(mysqlOption);
  global.RedisConn = server.cache({
    cache: 'redisCache',
    expiresIn: 6 * 60 * 60 * 1000,
    segment: 'customSegment',
  });
  global.MQconn = new RabbitMQCommon();
  global.SystemSettings = new SettingsCommon();

  Promise.all([
      MySqlConn.initial(),
      //RedisConn.initial(),
      MQconn.initial(),
  ])
      .then(SystemSettings.initial.bind(SystemSettings))
      .then(function() {
        server.start((err) => {
          if (err) {
            throw err;
          }else {
            Logger.info('Server running at:', server.info.uri);
          }
        });
      })
      .catch(function(err) {
        Logger.error(err)
      });
});

//swig 需要自行設定自己的 cache 參數，hapi 也要同時設定才有作用
let viewCache = (Config.get('Server.environment') === 'development') ? false : true;
if (!viewCache) {
  Swig.setDefaults({ cache: false });
}

server.views({
  engines: {
    html: require('swig'),
  },
  relativeTo: __dirname,
  path: 'views',
  isCached: viewCache,
});

server.route({
  method: 'GET',
  path: '/{p*}',
  handler: {
    directory: {
      path: 'public',
    },
  },
});

server.ext('onPostHandler', function(request, reply) {
  const response = request.response;

  if (response.isBoom &&
      response.output.statusCode === 404) {
    return reply.view('404').code(404);
  }
  return reply.continue();
});

server.decorate('reply', 'ok', function(result) {
  return this.response(Boom.ok(result));
});

module.exports = server;
