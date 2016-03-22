'use strict';

var model = {};

model.AUTH = function(){
  global.AUTH = sequelize.define('AUTH',
      { user_id:{type: Sequelize.STRING, field:'USERID', primaryKey: true },
        username:{type: Sequelize.STRING, field:'USERNAME' },
        email:{type: Sequelize.STRING, field:'EMAIl'},
        create_time:{
          type: Sequelize.DATE,
          field:'CREATED',
          get:function() {
            return sequelize.fn('date_format', sequelize.col('CREATED'), '%Y-%m-%d');
          },
        },
      },
      {freezeTableName: true, timestamps: false, }// Model tableName will be the same as the model name//
  );
};
