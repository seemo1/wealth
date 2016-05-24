'use strict';

//const Admin = require('./admin-controller');
//const validator = require('./admin-validator');

let rootPath = '/manager';
//let admin = new Admin();

module.exports = [
  {
    path: rootPath + '',
    method: 'GET',
    config: {
      handler: function(request, reply) {
        return reply.view('manager/index');;
      },
      //validate: validator.index,
    }
  },
  {
    path: rootPath + '/login',
    method: 'GET',
    config: {
      handler: function(request, reply) {
          return reply.view('manager/login');
      }
    }
  }
];