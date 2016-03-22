'use strict';

var ipDiscover = {};
var Config = require('config');
var tableIpNation = Config.get('Cassandra.keyspace').concat('.ip_nation');
var tableIpNationCountry = Config.get('Cassandra.keyspace').concat('.ip_nation_country');
var logger = require('./logger');
var _ = require('lodash');
var Promise = require('bluebird');

ipDiscover.getCountry = function(ipAddress) {
  if (ipAddress && typeof ipAddress === 'string') {
    var ipArray = ipAddress.split('.');
    if (ipArray.length < 4) {
      return new Promise(function(resolve, reject) {
        resolve('HK');
      });
    }

    var ipLong = (parseInt(ipArray[0]) * 16777216) + (parseInt(ipArray[1]) * 65536) + (parseInt(ipArray[2]) * 256) + parseInt(ipArray[3]);

    //172.17.1.0 ~ 172.17.1.255  CN IDC IP
    logger.info('Checking ip address: ' + ipAddress);
    if (ipLong >= 2886795520 && ipLong <= 2886795775) {
      logger.info(ipAddress + ' country code is CN');
      return new Promise(function(resolve, reject) {
        resolve('CN');
      });
    }    else {
      return new Promise(function(resolve, reject) {
        var query = 'SELECT country FROM ' + tableIpNation + ' WHERE ip_key=0 AND ip <= ' + ipLong + ' ORDER BY ip DESC LIMIT 1';
        cassandraClient.execute(query, function(err, success) {
          if (err) {
            logger.error(err);
            reject(new Error(err));
          }

          var result = success.rows[0];
          if (_.isEmpty(result)) {
            resolve('HK');
            logger.info(ipAddress + ' country code is unknown, returns hk');
          }          else {
            logger.info(ipAddress + ' country code is ' + result.country);
            if (typeof result.country === 'string') {
              result.country = result.country;
            }

            cassandraClient.execute('SELECT iso_code_2 FROM ' + tableIpNationCountry + ' WHERE code=?', [result.country], function(err, result) {
              var country = 'HK';
              if (_.has(result, 'rows')) {
                if (result.rows.length > 0 && _.has(result.rows[0], 'iso_code_2')) {
                  country = result.rows[0].iso_code_2;
                  if (country == 'CH') country = 'CN'; //special case
                  if (country == 'JP') country = 'JA'; //special case
                }
              }

              logger.info(ipAddress + ' iso_code_2 is ' + country);
              resolve(country);
            });
          }
        });
      });
    }
  }  else {
    return new Promise(function(resolve, reject) {
      resolve('HK');
    });
  }
};

module.exports = ipDiscover;

