'use strict';

const Boom = require('../../../../commonlib/boom');
const CannedImageModel = require('../../../../models/canned-image-model');


const Fs = require('fs');
const Path = require('path');
const Uuid = require('node-uuid');

class CannedImageController {
  constructor() {
    this._cannedImageModel = new CannedImageModel();
  }

  getCannedImage(request, reply) {
    this._cannedImageModel.getCannedImage(request.query.offset, request.query.hits)
      .then(function(res) {
        if (res.length > 0) {
          reply.ok(res);
        } else {
          reply(Boom.noContent());
        }
      })
      .catch(function(err) {
        reply(Boom.unauthorized(err));
      });
  }

  addCannedImage(request, reply) {
    this._cannedImageModel.addCannedImage(request.payload.image, request.payload.comment)
      .then(function(res) {
        reply.ok(res);
      })
      .catch(function(err) {
        reply(Boom.unauthorized(err));
      })

  }

  updateCannedImage(request, reply) {
    
    this._cannedImageModel.updateCannedImage(request.params.seqno,request.payload.image,request.payload.comment)
      .then(function(res) {
        reply.ok(res);
      })
      .catch(function(err) {
        reply(Boom.unauthorized(err));
      })
  }

  delCannedImage(request, reply) {
    this._cannedImageModel.delCannedImage(request.params.seqno)
      .then(function(res) {
        reply.ok(res);
      })
      .catch(function(err) {
        return reply(Boom.unauthorized(err));
      })
  }

  getCannedImageById(request, reply) {
    this._cannedImageModel.getCannedImageById(request.params.seqno)
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

module.exports = CannedImageController;
