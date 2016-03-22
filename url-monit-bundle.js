//version: 0.0.5
'use strict';

//Public or open source modules
var Path = require('path');
var pm2 = require('pm2');
var Util = require('util');
var Fs = require('fs');
var Lodash = require('lodash');
var EventEmitter = new require('events').EventEmitter;
var RequestClient = require('request');
var separator = '==========================================';
var separator2 = '--------------------------';

//environment checking
var cwd = process.cwd();
console.log('Staring directory: ' + cwd);
global.PROJECT_ROOT = __dirname;

//global.PROJECT_ROOT = Path.normalize(Path.dirname(__filename) + '/..'); //if in sub directory
if (cwd !== global.PROJECT_ROOT) {
  process.chdir(global.PROJECT_ROOT);
  console.log('change working directory: ' + process.cwd());
}

//Team common modules
var outfitUtil = require('./utils/outfit-util');
var Config = require('config');
var port = Config.get('Server.port');

var settings = {
  url: 'http://localhost:' + port + '/apis/getBundleFile',
  postData: {
    appid: 'CN',
    platform: 'IOS',
    product: 'FuturesMaster',
    ver: '3.0.150525005',
  },
  request: {
    method: 'POST',
    timeout: 50000,
    limitRestart: 5,
    interval: 5000,  //ms
    timeoutFailed: 20000,
    showBody: false  //show response body
    //max: 40
  },
  filePm2StartJson: 'server-cluster.json',
};

//main();
console.log(separator + '\n' + separator + '\n');
var filePm2StartJson = settings.filePm2StartJson;

//var joPm2 = require(filePm2StartJson); //failed unknown
var joPm2 = JSON.parse(Fs.readFileSync(filePm2StartJson, {encoding: 'utf8'}));
var aryPm2AppName = [];
if (Lodash.has(joPm2, 'apps') && Array.isArray(joPm2.apps)) {
  joPm2.apps.forEach(function(proc) {
    if (Lodash.has(proc, 'name')) {
      aryPm2AppName.push(proc.name);
    }
  });
} else {
  console.log('Error!!! cannot parse PM2 json file: ' + filePm2StartJson);
  process.exit(1);
}

if (aryPm2AppName.length === 0) {
  console.log('Error!!! No apps settings found in PM2 json file: ' + filePm2StartJson);
  process.exit(1);
}

console.log('PM2 settings=', joPm2);
console.log('PM2 apps name=', aryPm2AppName);
console.log(separator + '\n' + separator + '\n');

function parseParam(aryParam) {
  if ((aryParam.length > 0) && aryParam[0]) {
    settings.url = aryParam[0];
    settings.request.method = 'GET';
    delete settings.postData;
  }

  if ((aryParam.length > 1) && aryParam[1]) {
    settings.postData = JSON.parse(aryParam[1]);
    settings.request.method = 'POST';
  }
}

function cUrlMonit(url, data, interval) {
  if (!(this instanceof cUrlMonit)) {
    return new cUrlMonit();
  }

  EventEmitter.call(this);
  var self = this;

  self.option = {
    url: url,
    method: settings.request.method,
    form: data || {},
    timeout: settings.request.timeout

    //encoding: null    //If null, the body is returned as a Buffer.
  };
  self.counter = {
    limit: 0,
    limitRestart: settings.request.limitRestart,
    total:0, ok: 0, err: 0, reStart: 0

    //max: settings.request.max
  };

  //limit will increase 1 when err happen and reset to 0 once got ok.
  self.interval = interval || settings.request.interval; //default interval
  self.intervalHandle = null;
}

Util.inherits(cUrlMonit, EventEmitter);

cUrlMonit.prototype.showCounter = function() {
  var self = this;
  console.log('\n' + separator + (new Date().toISOString()) + '\n', self.counter);
  console.log(self.option);
};

cUrlMonit.prototype.checkCounter = function() {
  var self = this;
  self.counter.total++;

  //for debug, limit max request
  //if ((self.counter.total === self.counter.max) && (self.intervalHandle !== null)) {
  //    clearInterval(self.intervalHandle);
  //    self.emit('end');
  //}
  if (self.counter.limitRestart === self.counter.limit) {
    self.counter.limit = 0;
    self.emit('limitRestart');
  }
};

cUrlMonit.prototype.increaseOk = function() {
  var self = this;
  self.counter.ok++;
  self.limit = 0;
  self.option.timeout = settings.request.timeout;
  self.checkCounter();
};

cUrlMonit.prototype.increaseErr = function() {
  var self = this;
  self.counter.err++;
  self.counter.limit++;
  self.option.timeout = settings.request.timeoutFailed;
  self.checkCounter();
};

cUrlMonit.prototype.request = function() {
  var self = this;
  console.log(separator2);
  console.time('response time');
  RequestClient(self.option, function(err, response, body) {
    if (err) {
      self.increaseErr();
      return self.emit('error', err);
    }

    if (response) {
      console.timeEnd('response time');
      self.increaseOk();
      console.log('response.statusCode=' + response.statusCode +
      ' body length=' + response.body.length);
      if (settings.request.showBody) {
        console.log(body.toString());
      }

      //Util.inspect(response, {depth:5}));

      self.emit('response');
      return;
    }

    if ((self.option.encoding === null) && body && Buffer.isBuffer(body)) {
      //Fs.writeFile('logs/getUrl', body);
      var lengthBody = body.length;
      console.log(separator + 'response.statusCode=' + response.statusCode);
      console.log('body length=' + lengthBody);

      //console.log(body.toString());
      return self.emit('response');
    } else {
      return self.emit('fail_get_body');
    }
  });
};

cUrlMonit.prototype.get = function(url) {
  var self = this;
  self.option.method = 'GET';

  //Todo: check url format
  if (url) {
    self.option.url = url;

    //self.option.encoding = null; //muse set to null if want Buffer.isBuffer(body)
  }

  self.request();
};

cUrlMonit.prototype.post = function(url) {
  var self = this;
  self.option.method = 'POST';

  //Todo: check url format
  if (url) {
    self.option.url = url;
  }

  self.request();
};

cUrlMonit.prototype.setMethod = function(method) {
  var self = this;
  self.option.method = method.toUpperCase();
};

cUrlMonit.prototype.start = function(interval) {
  var self = this;
  if (interval) {
    self.interval = interval;
  }

  self.intervalHandle = setInterval(function() {
    self.request();
  }, self.interval);
  console.log('\nurl=' + self.option.url + '\ninterval=' + self.interval,
      'counter=\n', self.counter);
};

cUrlMonit.prototype.pm2StartOnStopped = function(pm2info) {
  var statusStopped = 0;
  if (Array.isArray(pm2info)) {
    console.log(separator2);
    pm2info.forEach(function(proc) {
      if (proc.pm2_env.status == 'stopped') {
        statusStopped++;
      };

      console.log('pid=' + proc.pid + ' name=' + proc.pm2_env.name +
          ' status=' + proc.pm2_env.status + ' restart=' + proc.pm2_env.restart_time);
    });

    console.log(separator2);
  }

  if (statusStopped > 0) {
    console.log(separator2, '\npm2 not reloaded. statusStopped=' + statusStopped + '. Trying to restart all');
    pm2.start(joPm2, function(err, result) {
      if (err) {
        console.log('failed to restart pm2', err);
        return;
      }

      result.forEach(function(proc) {
        if (proc.pm2_env.status == 'stopped') {
          statusStopped++;
        };

        console.log('pid=' + proc.pid + ' name=' + proc.pm2_env.name +
            ' status=' + proc.pm2_env.status + ' restart=' + proc.pm2_env.restart_time);
      });
    });
  }

};

// Connect or launch PM2
cUrlMonit.prototype.pm2Reload = function() {
  var self = this;
  self.counter.reStart++;
  pm2.connect(function(err) {
    if (err) {
      console.log(separator2, '\npm2 error', err, separator2 + '\n');
      return;
    }

    // Start a script on the current folder
    // Get all processes running

    //pm2.list(function(err, process_list) {
    //    console.log(process_list);
    //
    //    // Disconnect to PM2
    //    pm2.disconnect(function() { process.exit(0) });
    //});

    aryPm2AppName.forEach(function(appName) {
      pm2.gracefulReload(appName, function(errReload, result) {
        if (errReload) {
          console.log(separator2, '\npm2.gracefulReload name:' + appName + ' error!', errReload, separator2 + '\n');
          return;
        }

        console.log(separator2, '\nPM2 gracefulReload may be success. Check status and restart if not...');
        self.pm2StartOnStopped(result);
      });
    });
  });
};

//function main() {
if (process.argv.length > 2) {
  var aryParam = process.argv.slice(2);
  parseParam(aryParam);
}

console.log(settings);

var oMonit = new cUrlMonit(settings.url, settings.postData);

oMonit
        .on('error', function(err) {
          outfitUtil.dumpError(err);
          oMonit.showCounter();
        })
        .on('response', function() {
          oMonit.showCounter();
        })
        .on('limitRestart', function() {
          console.log(separator2, '\npm2 reloading...');
          oMonit.pm2Reload();

        })
        .on('end', function() {
          console.log(separator, 'end\n');
          oMonit.showCounter();
          process.exit(1);
        });

oMonit.start();

//}

