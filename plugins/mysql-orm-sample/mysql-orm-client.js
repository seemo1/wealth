/**
 * Created by rayson on 2015/12/3.
 */
var Sequelize = require('sequelize');
var Config = require('config');
global.sequelize = new Sequelize(
    Config.get('LTSGlobalMySQL.database'),
    Config.get('LTSGlobalMySQL.account'),
    Config.get('LTSGlobalMySQL.password'),
    {host: Config.get('LTSGlobalMySQL.host'),
      dialect: 'mysql',
      define: { timestamps: false, },
      timezone: '+08:00',//
    });

//AUTH.findAll({limit:10}).then(function(user) {
//  console.log(user);
//  process.exit(0);
//}).catch(function(err) {
//  console.log('err=', err);process.exit(0);
//});
