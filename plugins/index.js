'use strict';

var plugins = [
    require('inert'),
    require('vision'),
    require('./mailer'),
    require('./exception-handle'),
    require('./url-monit-response'),

];

module.exports = plugins;
