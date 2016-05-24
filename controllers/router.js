
'use strict';

let rootPath = '';

module.exports = [
  {
    path: rootPath + '/',
    method: 'GET',
    handler: function(request, reply) {
      return reply.redirect('manager/login');
    }
  }
];