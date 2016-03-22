'use strict';

var Handlebars = require('handlebars');
var Path = require('path');
var Config = require('config');
var mailSetting = Config.get('Mail');
var options = {
  transport: {
    host: mailSetting.host,
    port: 25,

    //service: "Gmail",
    auth: {
      user: mailSetting.account,
      pass: mailSetting.password,
    },
  },
  views: {
    engines: {
      html: {
        module: Handlebars.create(),
        path: Path.resolve('./public/views'),
      },
    },
  },
};
var Mailer = {
  register: require('hapi-mailer'),
  options: options,
};

module.exports = Mailer;
