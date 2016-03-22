var _ = require('lodash');
var XLS = require('xlsjs');
var Fs = require('fs');
var MySQL = require('mysql');
var Moment = require('moment');
var server = require('../test/test-server');
var mysqlGlobalComm = require('../commonlib/mysql-global-common');
var workbook = XLS.readFile('School_Lists.xls');
var all = workbook.Sheets.ALL;
var newArray = [];
var newArray2 = [];
var newObj = {};
server.start()
    .then(function() {
      return new Promise(function(resolve, reject) {
        for (var i = 2; i > 0; i++) {
          if (!all['A' + i]) {
            newArray = _.sortBy(newArray, function(d) {
              return -d.school_key;
            });

            resolve(newArray);
            break;
          }

          newObj = {
            school_key: '',
            country: '',
            country_code: '',
            en_name: '',
            tc_name: '',
            sc_name: '',
            sc_pinyin: '',
            domain: '',
          };
          if (all['A' + i]) {
            newObj.school_key = all['A' + i].v;
          }

          if (all['B' + i]) {
            newObj.country = all['B' + i].v;
          }

          if (all['C' + i]) {
            newObj.country_code = all['C' + i].v;
          }

          if (all['D' + i]) {
            newObj.en_name = all['D' + i].v;
          }

          if (all['E' + i]) {
            newObj.tc_name = all['E' + i].v;
          }

          if (all['F' + i]) {
            newObj.sc_name = all['F' + i].v;
          }

          if (all['G' + i]) {
            newObj.sc_pinyin = all['G' + i].v;
          }

          if (all['H' + i]) {
            newObj.domain = all['H' + i].v;
          }

          newArray.push(newObj);

        }
      });
    })
    .then(function(newArray) {
      var count = newArray.length;
      var updateQuery = '';
      var insertQuery = [];
      var school_key_tmp = '';
      console.log('count=', count);
      newArray.forEach(function(newObj) {
        if (newObj.school_key != '') {
          selectSchool(newObj.school_key)
            .then(function(res) {
              if (res.length > 0) {
                var objTmp = '';
                //newObj.school_key = res[0].school_key;
                //newArray2.push(newObj);
                //var updateQueryTmp = 'UPDATE school SET ' +
                //                  'en_name=\'' + newObj.en_name + '\',' +
                //                  'sc_name=\'' + newObj.sc_name + '\',' +
                //                  'sc_pinyin=\'' + newObj.sc_pinyin + '\',' +
                //                  'tc_name=\'' + newObj.tc_name + '\',' +
                //                  'region=\'' + newObj.country_code + '\',' +
                //                  'domains=\'' + newObj.domain + '\',' +
                //                  'last_update_time=\'' + Moment().format('YYYY-MM-DD HH:mm:ss') + '\' ' +
                //                  'WHERE school_key=\'' + newObj.school_key + '\';';
                if(newObj.school_key == '103' ||
                    newObj.school_key == '230' ||
                    newObj.school_key == '612' ||
                    newObj.school_key == '672' ||
                    newObj.school_key == '825' ||
                    newObj.school_key == 'INOTHER' ||
                    newObj.school_key == 'MCOTHER' ||
                    newObj.school_key == 'AUOTHER'){
                  objTmp = [{
                    en_name:newObj.en_name,
                    sc_name:newObj.sc_name,
                    sc_pinyin:newObj.sc_pinyin,
                    tc_name:newObj.tc_name,
                    region:newObj.country_code,
                    domains:newObj.domain,
                    is_del:1,
                    last_update_time:Moment().format('YYYY-MM-DD HH:mm:ss'),
                  },{
                    school_key:newObj.school_key}];
                }else {
                  objTmp = [{
                    en_name: newObj.en_name,
                    sc_name:newObj.sc_name,
                    sc_pinyin: newObj.sc_pinyin,
                    tc_name: newObj.tc_name,
                    region: newObj.country_code,
                    domains: newObj.domain,
                    last_update_time: Moment().format('YYYY-MM-DD HH:mm:ss'),
                  }, {
                    school_key: newObj.school_key
                  }];
                }
                mysqlClient.query('UPDATE school SET ? WHERE ?', objTmp, function(err, res) {
                  var query = MySQL.format('UPDATE school SET ? WHERE ?', objTmp);
                  Fs.appendFile('./logs/schoolUpdate.txt', 'school_key = ' + newObj.school_key + ', Query=' + query + '\n', function(err) {
                  });

                  if (err) {
                    console.log(err);
                  }
                  --count;
                  if (count == 0) {
                    process.exit(0);
                  }
                });
              }else {
                //var insertQueryTmp = "INSERT INTO school (`school_key`,`en_name`,`sc_name`,`sc_pinyin`,`tc_name`,`region`,`domains`,`publish_time`,`last_update_time`)"+
                //        "VALUES ('"+newObj.school_key+"','"+newObj.en_name+"','"+newObj.sc_name+"','"+newObj.sc_pinyin+"','"+newObj.tc_name+"','"+newObj.country_code+"','"+newObj.domain+"','"+Moment().format('YYYY-MM-DD HH:mm:ss')+"','"+Moment().format('YYYY-MM-DD HH:mm:ss')+"');"
                //Fs.appendFile('./logs/schoolInsert.txt', 'school_key = ' + newObj.school_key + ', Query=' + insertQueryTmp + '\n', function(err) {
                //});
                var objTmp = '';
                if(newObj.school_key == '103' ||
                    newObj.school_key == '230' ||
                    newObj.school_key == '612' ||
                    newObj.school_key == '672' ||
                    newObj.school_key == '825' ||
                    newObj.school_key == 'INOTHER' ||
                    newObj.school_key == 'MCOTHER' ||
                    newObj.school_key == 'AUOTHER'){
                  objTmp = [{
                    school_key:newObj.school_key,
                    en_name:newObj.en_name,
                    sc_name:newObj.sc_name,
                    sc_pinyin:newObj.sc_pinyin,
                    tc_name:newObj.tc_name,
                    region:newObj.country_code,
                    domains:newObj.domain,
                    is_del:1,
                    publish_time:Moment().format('YYYY-MM-DD HH:mm:ss'),
                    last_update_time:Moment().format('YYYY-MM-DD HH:mm:ss'),
                    }];
                }else {
                  objTmp = {
                    school_key: newObj.school_key,
                    en_name: newObj.en_name,
                    sc_name:newObj.sc_name,
                    sc_pinyin: newObj.sc_pinyin,
                    tc_name: newObj.tc_name,
                    region: newObj.country_code,
                    domains: newObj.domain,
                    publish_time: Moment().format('YYYY-MM-DD HH:mm:ss'),
                    last_update_time: Moment().format('YYYY-MM-DD HH:mm:ss'),
                  };
                }
                mysqlClient.query('INSERT INTO school SET ?', objTmp, function(err, res) {
                  var query = MySQL.format('INSERT INTO school SET ?', objTmp);
                  Fs.appendFile('./logs/schoolInsert.txt', 'school_key = ' + newObj.school_key + ', Query=' + query + '\n', function(err) {
                    });

                  if (err) {
                    console.log(err);
                  }
                  --count;
                  if (count == 0) {
                    process.exit(0);
                  }
                });
              };
            })
            .catch(function(err) {
              console.log(err);
            });
        }else {
          --count;
          newArray2.push(newObj);
          if (count == 0) {
            console.log(newArray2);
          }
        }
      });
    })
    .catch(function(err) {
      console.log('ERR2 , ', err);
    });

function selectSchool(name) {
  return new Promise(function(resolve, reject) {
    var query = 'SELECT * FROM school WHERE school_key=?';
    mysqlGlobalComm.select('[excel-parse]', query, [name], function(err, res) {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
};

console.log(newArray);
