var Sequelize = require('sequelize');
var Config    = require('config');  // we use node-config to handle environments

// initialize database connection
var sequelize = new Sequelize(
  Config.get('LTSGlobalMySQL.database'),
  Config.get('LTSGlobalMySQL.account'),
  Config.get('LTSGlobalMySQL.password'),
  {host: Config.get('LTSGlobalMySQL.host'),
    dialect: 'mysql',
    define: { timestamps: false, },
    timezone: '+08:00',//
    logging: false,//outputting SQL
    pool: {
      max: 5,
      min: 0,
      idle: 100000
    },

  }
);

// load models
var models = [
  'AUTH',
  'school',
];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// describe relationships
//(function(m) {
//  m.PhoneNumber.belongsTo(m.User);
//  m.Task.belongsTo(m.User);
//  m.User.hasMany(m.Task);
//  m.User.hasMany(m.PhoneNumber);
//})(module.exports);

// export connection
module.exports.sequelize = sequelize;