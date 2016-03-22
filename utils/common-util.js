'use strict';

var Config = require('config');
var logger = require('./logger');
var fs = require('fs');
var Moment = require('moment');
var commonUtil = {};
var nodemailer = require('nodemailer');
var Promise = require('bluebird');
var SmtpTransport = require('nodemailer-smtp-transport');
var systemSettings = require('../commonlib/settings-common');
var Joi = require('joi');

commonUtil.writeFile = function(fileName, content, append) {
  var logPath = './logs';
  if (append) {
    fs.appendFile(logPath.concat('/' + fileName), content, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }  else {
    fs.writeFile(logPath.concat('/' + fileName), content, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
};

commonUtil.saveFile = function(fileName, buffer, callback) {
  //TODO: check if buffer is correct type and not null
  fileName = Moment().format('YYYYMMDDHHmmss') + fileName;
  var filePath = './public' + '/' + fileName;
  var streamWriter = fs.createWriteStream(filePath);
  streamWriter.on('finish', function() {
    callback(fileName);
  });

  streamWriter.write(buffer);
  streamWriter.end();
};

commonUtil.sendErrorMail = function(msg) {
  sendMail(msg);
};

commonUtil.dateToString = function(date) {
  return Moment(date).format('YYYY-MM-DD HH:mm:ss').toString();
};

var sendMail = function(msg) {

  new Promise(function(resolve, reject) {

    var config = {
      host: 'smtp.emailcar.net',

      //port: 25,
      auth: {
        user: 'fdtchina',
        pass: 'e952c66f',
      },
    };

    //var config = {
    //    host: 'smtpout.secureserver.net',
    //    port: 80,
    //    auth: {
    //        user: 'error@uncaughtexception.xyz',
    //        pass: 'exception7474'
    //    }
    //};

    var transporter = nodemailer.createTransport(SmtpTransport(config));
    var subject = systemSettings.get('Mail', 'Subject') + ' Uncaught Exception ' + Moment().format('YYYY-MM-DD HH:mm:ss');

    var mailOptions = {
      from: 'Uncaught Exception <FDTChina@info.fdtic.org.cn>', // sender address
      //to: 'yauri@hkfdt.com;rayson.tsai@hkfdt.com;seemo.chen@hkfdt.com;joe.lo@hkfdt.com;claudia.zhou@hkfdt.com', // list of receivers
      subject: subject, // Subject line
      text: msg, // plaintext body
      html: msg // html body
    };
    var sendMailFlag = Config.get('SendErrMail');
    if (sendMailFlag === 'Y') {
      mailOptions.to = 'yauri@hkfdt.com';
      transporter.sendMail(mailOptions, function(error, info) {
      });

      mailOptions.to = 'rayson.tsai@hkfdt.com';
      transporter.sendMail(mailOptions, function(error, info) {
      });

      mailOptions.to = 'seemo.chen@hkfdt.com;';
      transporter.sendMail(mailOptions, function(error, info) {
      });

      mailOptions.to = 'peter.lyu@hkfdt.com';
      transporter.sendMail(mailOptions, function(error, info) {
      });

      mailOptions.to = 'joe.lo@hkfdt.com;';
      transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        reject(error);
      } else {
        resolve('Message sent: ' + info.response);
      }
    });
    }
  })
        .then(function(result) {
          logger.info(result);
        })
        .catch(function(err) {
          logger.error(err);
        });
};


commonUtil.headerValidator = function() {
  return Joi.object().keys({
    'x-token': Joi.string().required(),
    'x-language': Joi.string().required(),
    'x-country': Joi.string().required(),
  });
};

//REF: https://docs.google.com/presentation/d/1j_shUJH0tK4sEI6TJjiiol-wKbnX-_AEjjAm6UwR-lk/
commonUtil.getShortDeeplink = function(longDeeplink) {
  var shortDeepLink = 'fxmen';
  if (!longDeeplink) {
    return shortDeepLink;
  }

  longDeeplink = longDeeplink.toLowerCase();

  switch (longDeeplink) {
    case 'forexmaster':
      shortDeepLink = 'fxmen';
      break;
    case 'forexmastertw':
      shortDeepLink = 'fxmtw';
      break;
    case 'forexmastercn':
      shortDeepLink = 'fxmsc';
      break;
    case 'futuresmastercn':
      shortDeepLink = 'ftmsc';
      break;
    case 'stockmastercn':
      shortDeepLink = 'smsc';
      break;
    case 'forexmasterinc':
      shortDeepLink = 'fxmeninc';
      break;
    case 'forexmasterinccn':
      shortDeepLink = 'fxmscinc';
      break;
    case 'stockmasterlttw':
      shortDeepLink = 'smtw';
      break;
  }

  return shortDeepLink;
};

module.exports = commonUtil;
