'use strict';

const Boom = require('../../../../commonlib/boom');
const ImModel = require('../../../../models/im-model');

class ImController {

  constructor() {
  }

  getImAccount(request, reply) {
    let imModel = new ImModel();
    imModel.getUserImInfo(request.query.user_id)
        .then(function(res) {
          let result = {
            yun_uid: res[0].yun_uid,
            token: res[0].token,
          }
          reply.ok(result);
        })
        .catch(function(err) {
          reply(Boom.unauthorized(err));
        });
  }
}

module.exports = ImController;
