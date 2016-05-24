'use strict';

const Config = require('config');
const Logger = require('./logger');
const Fs = require('fs');
const Moment = require('moment');
const commonUtil = {};
const Nodemailer = require('nodemailer');
const SmtpTransport = require('nodemailer-smtp-transport');

commonUtil.writeFile = function(fileName, content, append) {
  let logPath = './logs';
  if (append) {
    Fs.appendFile(logPath.concat('/' + fileName), content, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }  else {
    Fs.writeFile(logPath.concat('/' + fileName), content, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
};

commonUtil.saveFile = function(fileName, buffer, callback) {
  //TODO: check if buffer is correct type and not null
  fileName = Moment().format('YYYYMMDDHHmmss') + fileName;
  let filePath = './public' + '/' + fileName;
  let streamWriter = Fs.createWriteStream(filePath);
  streamWriter.on('finish', function() {
    callback(fileName);
  });
  streamWriter.write(buffer);
  streamWriter.end();
};

commonUtil.dateToString = function(date) {
  return Moment(date).format('YYYY-MM-DD HH:mm:ss').toString();
};

commonUtil.sendMail = function(msg) {
  return new Promise(function(resolve, reject) {
    let mailConfig = Config.get('Mail');
    let config = {
      host: mailConfig.host,
      auth: {
        user: mailConfig.account,
        pass: mailConfig.password,
      },
    };

    let transporter = Nodemailer.createTransport(SmtpTransport(config));
    let subject = SystemSettings.get('Mail', 'Subject') + ' Uncaught Exception ' + Moment().format('YYYY-MM-DD HH:mm:ss');

    let mailOptions = {
      from: 'Uncaught Exception <FDTChina@info.fdtic.org.cn>', // sender address
      subject: subject, // Subject line
      text: msg, // plaintext body
      html: msg // html body
    };
    let sendMailFlag = SystemSettings.get('Debug','SendErrMail');
    if (sendMailFlag === 'Y') {
      mailOptions.to = 'seemo.chen@hkfdt.com;';
      transporter.sendMail(mailOptions, function(error, info) {
      });

      mailOptions.to = 'peter.lyu@hkfdt.com;';
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
          Logger.info(result);
        })
        .catch(function(err) {
          Logger.error(err);
        });
};

module.exports = commonUtil;
