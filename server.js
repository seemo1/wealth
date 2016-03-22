'use strict';

global.PROJECT_ROOT = __dirname;
global.Promise = require('bluebird');
Promise.config({
	warnings: false, // Enable warnings.
	longStackTraces: false, // Enable long stack traces.
	cancellation: true // Enable cancellation.
});
global.evt = new require('events').EventEmitter();
global.mysqlClient = {};
global.redisClient = {};
global.queueUtil = {};
global.mq = {};

require('colors');
require('./commonlib/config-handler'); //for system settings pubsub

var Config = require('config');
var Hapi = require('hapi'); //main framework object
var plugins = require('./plugins'); //load plugins
var redisConnect = require('./utils/redis-client');
var Path = require('path');
var Swig = require('swig');
var systemSettings = require('./commonlib/settings-common');
var fs = require('fs');
var mysqlGlobalConnect = require('./utils/ltsglobalmysql-client.js');
var mqConnect = require('./utils/mq-client.js');
var logger = require('./utils/logger');



var server = new Hapi.Server();
global.SERVER = server;

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
		files: {
			relativeTo: Path.join(__dirname, 'public'),
		},
		validate: {
			options: {
				allowUnknown: true,
			},
		},
		cors: true
	}
});

server.register(plugins, function (pluginError) {
	if (pluginError) {
		throw pluginError;
	}

	server.views({
		//accepts multiple view path, priority ordered
		path: ['./public/views', './public/mobile/dist'],
		engines: {html: Swig},
		isCached: false,
		allowAbsolutePaths: true,
	});

	server.state('fdt', {
		ttl: null,
		isSecure: false,
		isHttpOnly: true,
		encoding: 'base64json',
		path: '/fdt/dashboard',
		clearInvalid: true,
		strictHeader: true,
	});

	require('./routers')(server);

	/** Start sequencial of server start process by Kim **/
	return Promise.all([
		mysqlGlobalConnect.initial(),
		redisConnect.initial(),
	])
		.then(function (conn) {
			mysqlClient = conn[0];
			console.info('MySQL(Global) is ready'.yellow);
			server.log('info', 'MySQL(Global) is ready');

			redisClient = conn[3];
			console.info('Redis is ready'.yellow);
			server.log('info', 'Redis is ready');

		})
		.then(mqConnect.initialAsync)
		.then(function (channel) {
			mq = channel;
			console.info('MQ service is ready'.yellow);
			server.log('info', 'MQ service is ready');
		})
		.then(function (res) {
			console.log(res);
			server.log('info:', res);
			serverReady();
		})
		.then(function () {
			server.start(function (err) {
				if (err) {
					throw new Error(err);
				}

				console.info('Server is running at: ' + server.info.uri);
				server.log('info', 'Server is running at: ' + server.info.uri);
			});
		})
		.then(systemSettings.loadFromMysql)
		.catch(function (e) {
			console.error(e);
		});
});

function serverReady() {
	if (systemSettings.getD('plugin', 'swagger', 'N') === 'Y') {
		var apiDoc = require('./plugins/api-docs');
		server.register(apiDoc, function (err) {
			if (err) {
				console.error(err);
			}
		});
	}

	if (systemSettings.getD('logstashTcp', 'send', 'N') === 'Y') {
		logger.enableLogstashTcp();
	}
}
