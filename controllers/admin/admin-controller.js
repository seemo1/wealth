'use strict';


class AdminController {

  constructor() {
  }

  index(request, reply) {
    return reply('Admin Dashboard. Hello ' + request.query.user);
  }

}

module.exports = AdminController;