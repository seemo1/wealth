//INFO:
//table schema migration in migration/log-cql.js
var Moment = require('moment');

exports.register = function(server, options, next) {

  server.ext('onPreHandler', function(request, reply) {
    var requestData = '';
    try {
      requestData = JSON.stringify(request.payload || request.params || request.query);
    }
    catch (e) {
      console.error(e);
    }

    var data = {
      userAgent: request.headers['user-agent'],
      ip: request.headers['x-forwarded-for'],
      method: request.method,
      reqId: request.id,
      reqPath: request.path,
      reqData: requestData,
      startTime: new Date().getTime(),
      date: new Moment().format('YYYY-MM-DD').toString(),
    };
    var fields = 'req_id, req_path, req_data, user_agent, ip, method, start_time, date';
    var query = 'INSERT INTO logs (' + fields + ') VALUES(?,?,?,?,?,?,?,?)';
    var params = [
        data.reqId, data.reqPath,
        data.reqData, data.userAgent,
        data.ip, data.method,
        data.startTime, data.date,
    ];

    cassandraClient.execute(query, params, {prepare: true}, function(err) {
      if (err) {
        console.error('cannot log request', err);
        return;
      }

      var tempData = '';
      try {
        tempData = JSON.stringify(data);
        redisClient.set(data.reqId, tempData);
      }
      catch (e) {
        console.error('onPreHandler', 'cannot parse data', e);
      }
    });

    return reply.continue();
  });

  server.on('response', function(request) {
    //logger.logReqMeta('info', 'responseEvent', request,
    //    { emitter: 'hapijs', task: 'responseEvent',
    //        response: JSON.parse(JSON.stringify(request.response.source)), header: request.response.headers});
    var userId = '';
    var responseData = '';
    var requestId = '';

    try {
      if (request.pre.hasOwnProperty('body')) {
        userId = request.pre.body.user.Id;
      }

      responseData = JSON.stringify(request.response.source);
      requestId = request.id;
    }
    catch (e) {
      console.error('server on response'.red, 'cannot parse output');
    }

    var data = {
      userId: userId,
      resData: responseData,
      endTime: new Date().getTime(),
      date: Moment().format('YYYY-MM-DD').toString(),
      reqId: '',
    };
    var query = 'UPDATE logs SET user_id=?, res_data=?, end_time=? WHERE date=? AND req_id=? AND start_time=?';

    redisClient.get(requestId, function(err, redisData) {
      if (err) {
        return;
      }

      try {
        redisData = JSON.parse(redisData);
        if (redisData) {
          if (redisData.hasOwnProperty('startTime')) {
            var params = [data.userId, data.resData, data.endTime, data.date, requestId, redisData.startTime];
            redisClient.del(requestId);
            cassandraClient.execute(query, params, {prepare: true}, function(err, res) {
              if (err) {
                console.error('cannot log response', err);
              }
            });
          }
        }
      }
      catch (e) {
        console.error('on server response', 'cannot parse json', e);
      }
    });
  });

  return next();
};

exports.register.attributes = {
  name: 'cassandra-logger',
  version: '1.0',
};
