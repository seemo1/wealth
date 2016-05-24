'use strict';

const Admin = require('./admin-controller');
const validator = require('./admin-validator');

let rootPath = '/admin';
let admin = new Admin();

module.exports = [
  {
    path: rootPath + '',
    method: 'GET',
    config: {
      handler: function(request, reply) {
        return admin.index(request, reply);
      },
      validate: validator.index,
    }
  },
  {
    path: rootPath + '/login',
    method: 'GET',
    handler: function(request, reply) {
        return reply.view('admin/login');
    }
  }
];