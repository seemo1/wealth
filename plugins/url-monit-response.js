// Load modules
'use strict';

var Fs = require('fs');
var Path = require('path');
var Util = require('util');
var Promise = require('bluebird');
var Lodash = require('lodash');

var Hoek = require('hoek');
var pathRoot = global.PROJECT_ROOT || Path.join(__dirname, '..');
var logger = require(pathRoot + '/utils/logger');

var outfitUtil = require(pathRoot + '/utils/outfit-util');

var limit = 5;
var limitLength = 40;

var joCass = {
  s1: [
      'system_settings',
      'ip_nation',
      'ip_nation_country',
      'server_status',
      'system_settings',
      'temp_user_feeds_no_system',],
  s2: [
      'user',
      'group',
      'school',
      'post',
      'post_comment',
      'comment_rel_users',
      'by_comment_count',
      'post_group',
      'post_symbol',
      'post_user_wall',
      'user_referral',
      'post_rel_users',
      'symbol_vote_user',
  ],
  s3: [
      'by_user_count',
      'by_group_count',
      'by_school_count',
      'group_member',
      'by_comment_count',
      'by_post_count',
      'symbol_vote_count',
      'temp_post_lang_time_cn',
      'temp_post_lang_time_tw',
      'temp_post_lang_time_en',
  ],
  big: [
      'post_user_feed',
  ],
};

var joGlobal = {
  s1: ['social_user_account', 'social_coin_record'],
};
joGlobal.all = joGlobal.s1;

var joCentral = {
  s1: ['contest_social_join', 'contest_social', 'following', 'literal_group'],
};
joCentral.all = joCentral.s1;

joCass.all = joCass.s1.concat(joCass.s2, joCass.s3);

exports.register = function(server, options, next) {

  server.route({
    method: 'GET',
    path: '/urlmonitresponse',
    handler:  checkItem,
  });
  server.route({
    method: 'GET',
    path: '/table/{section}',
    handler:  tableCount,
  });
  server.route({
    method: 'GET',
    path: '/table/data/{section}',
    handler:  tableData,
  });
  return next();
};

exports.register.attributes = {
  name: 'urlMonitResponse',
  version: '0.0.1',
};

function pmCassExecute(cql, aryParam, option) {
  return new Promise(function(resolve, reject) {
    cassandraClient.execute(cql, aryParam, option, function(err, result) {
      if (err) {
        return reject(err);
      }

      //return resolve('done: ' + cql + Util.inspect(result) );
      if (Lodash.has(result, 'rows') && (result.rows.length > 0)) {
        resolve(result.rows);
      }

      return resolve([]); //return empty array

    });
  });
}

function mysqlQuery(mysqlClient, sql) {
  return new Promise(function(resolve, reject) {
    mysqlClient.query(sql, function(errSql, rows) {
      if (errSql) {
        return reject(errSql);
      }

      if (Array.isArray(rows) && (rows.length > 0)) {
        return resolve(rows);
      }

      return resolve([]);
    });
  });
}

//implement Promise.settleProps
function settleProps(joKey2Pm) {
  return new Promise(function(resolve, reject) {
    var aryPm = [];
    var aryKey = [];
    Lodash.forOwn(joKey2Pm, function(value, key) {
      aryPm.push(value);
      aryKey.push(key);
    });

    return Promise.settle(aryPm).then(function(aryPmInspect) {
      var joBack = {};
      for (var ii = 0; ii < aryPmInspect.length; ii++) {
        var pmI = aryPmInspect[ii];
        if (pmI.isFulfilled()) {
          joBack[aryKey[ii]] = pmI.value();
        } else if (pmI.isRejected()) {
          joBack[aryKey[ii]] = pmI.reason();
        } else {
          joBack[aryKey[ii]] = pmI;
        }
      }

      return resolve(joBack);
    })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              return reject(err);
            });
  });
}

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function rowsToTable(rows) {
  //console.log(rows);
  if (!Array.isArray(rows)) {
    return '';
  }

  var row0 = rows[0];
  var out = '<table border="1"><tr>';
  Lodash.forOwn(row0, function(data, key) {
    out += '<th>' + htmlEntities(key) + '</th>';
  });

  out += '</tr>';
  rows.forEach(function(row) {
    out += '<tr>';
    Lodash.forOwn(row, function(data, key) {
      var tmpData = data;
      if ((typeof data === 'string') && (data.length > limitLength)) {
        tmpData = data.substr(0, limitLength);
      }

      out += '<td>' + htmlEntities(tmpData) + '</td>';
    });

    out += '</tr>';
  });

  out += '</table>';
  return out;
}

function htmlJo(joData) {
  var htmlOut = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body><table border="2">';
  Lodash.forOwn(joData, function(data, key) {
    var dataOut = '';
    if (typeof data === 'string') {
      dataOut = htmlEntities(data);
    } else if (Array.isArray(data)) {
      if (data.length === 1) {
        if (Lodash.has(data[0], 'count')) {
          dataOut = data[0].count;
        } else {
          dataOut = JSON.stringify(data[0]);
        };
      } else {
        //console.log(data);
        dataOut = rowsToTable(data);
      }
    } else if (typeof dataOut === 'object') {
      dataOut = JSON.stringify(dataOut);
    } else {
      dataOut = Util.inspect(data, {depth:3});
    };

    htmlOut += '<tr><td>' + htmlEntities(key) + '</td><td>' + dataOut + '</td></tr>';
  });

  htmlOut += '</table></body></html>';
  console.log(htmlOut);
  return htmlOut;
}

function tableCount(request, reply) {
  var aryCass;
  var section;
  if (Lodash.has(request.params, 'section') && Lodash.has(joCass, request.params.section)) {
    section = request.params.section;
    aryCass = joCass[section];
  } else {
    return reply(outfitUtil.endResult('No such data'));
  }

  var joTable2Pm = {};
  aryCass.forEach(function(table) {
    joTable2Pm[table] = pmCassExecute('select count(*) from ' + table, [], {});
  });

  if (Lodash.has(joGlobal, section)) {
    joGlobal[section].forEach(function(table) {
      joTable2Pm[ 'GLOBAL_' + table] = mysqlQuery(mysqlClient, 'select count(*) as count from ' + table);
    });
  }

  if (Lodash.has(joCentral, section)) {
    joCentral[section].forEach(function(table) {
      joTable2Pm[ 'CENTRAL_' + table] = mysqlQuery(mysqlCentralClient, 'select count(*) as count from ' + table);
    });
  }

  settleProps(joTable2Pm)
        .then(function(joResult) {
          return reply(htmlJo(joResult)).type('text/html');
        })
        .catch(function(error) {
          return reply(outfitUtil.endResult(error));
        });
}

function tableData(request, reply) {
  var aryCass;
  var section;
  if (Lodash.has(request.params, 'section') && Lodash.has(joCass, request.params.section)) {
    section = request.params.section;
    aryCass = joCass[section];
  } else {
    return reply(outfitUtil.endResult('No such data'));
  }

  var joTable2Pm = {};
  aryCass.forEach(function(table) {
    joTable2Pm[table] = pmCassExecute('select * from ' + table + ' limit ' + limit, [], {});
  });

  if (Lodash.has(joGlobal, section)) {
    joGlobal[section].forEach(function(table) {
      joTable2Pm[ 'glo_' + table] = mysqlQuery(mysqlClient, 'select * from ' + table + ' limit ' + limit);
    });
  }

  if (Lodash.has(joCentral, section)) {
    joCentral[section].forEach(function(table) {
      joTable2Pm[ 'cen_' + table] = mysqlQuery(mysqlCentralClient, 'select * from ' + table + ' limit ' + limit);
    });
  }

  settleProps(joTable2Pm)
        .then(function(joResult) {
          return reply(htmlJo(joResult)).type('text/html');
        })
        .catch(function(error) {
          return reply(outfitUtil.endResult(error));
        });
}

function checkItem(request, reply) {
  var cql = 'select * from user limit 1';
  var centralSql = 'select * from account_daily limit 1';
  var globalSql = 'select * from AUTH limit 1';
  var out = {};
  out.data = {
    cql: 'ok',
    centralSql: 'ok',
    globalSql: 'ok',
  };

  cassandraClient.execute(cql, function(err, result) {
    if (err) {
      out.data.cql = err;
      return reply(outfitUtil.endResult(out));
    };

    //return reply(outfitUtil.endResult(null, result.first()));

    mysqlCentralClient.query(centralSql, function(errCentralSql, rows, fields) {
      if (err) {
        out.data.errCentralSql = err;
        return reply(outfitUtil.endResult(out));
      }

      mysqlClient.query(globalSql, function(errGlobalSql, rows, fields) {
        if (errGlobalSql) {
          out.data.globalSql = errGlobalSql;
          return reply(outfitUtil.endResult(out));
        }

        return reply(outfitUtil.endResult(null, out));
      });

    });

  });
}
