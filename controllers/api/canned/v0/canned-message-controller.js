'use strict';

const Boom = require('../../../../commonlib/boom');
const CannedMessageModel = require('../../../../models/canned-message-model');

class CannedController {

    constructor() {
      this._cannedMessageModel = new CannedMessageModel();
    }

    getCannedMessage(request, reply) {
      this._cannedMessageModel.getCannedMessage(request.query.offset, request.query.hits)
        .then(function(res) {
          if (res.length > 0) {
            reply.ok(res);
          } else {
            reply(Boom.noContent(res));
          }
        })
        .catch(function(err) {
          reply(Boom.unauthorized(err));
        });
    }

    addCannedMessage(request, reply) {
      this._cannedMessageModel.addCannedMessage(request.payload.message)
          .then(function(res) {
            console.log(res);
            reply.ok(res);
          })
          .catch(function(err) {
            reply(Boom.unauthorized(err));
          })
    }

    updateCannedMessage(request, reply) {
      this._cannedMessageModel.updateCannedMessage(request.params.seqno,request.payload.message)
        .then(function(res) {
          reply.ok(res);
        })
        .catch(function(err) {
          reply(Boom.unauthorized(err));
        })
    }

    delCannedMessage(request, reply) {
      this._cannedMessageModel.delCannedMessage(request.params.seqno)
        .then(function(res) {
          reply.ok(res);
        })
        .catch(function(err) {
          return reply(Boom.unauthorized(err));
        })
    }

    getCannedMessageById(request, reply) {
      this._cannedMessageModel.getCannedMessageById(request.params.seqno)
        .then(function(res) {
          if (res.length > 0) {
            reply.ok(res[0]);
          } else {
            reply(Boom.noContent());
          }
        })
        .catch(function(err) {
          reply(Boom.unauthorized(err));
        })
    }
}

module.exports = CannedController;
