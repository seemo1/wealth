'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AUTH',
      { user_id:{type: DataTypes.STRING(40), field:'USERID', primaryKey: true },
        username:{type: DataTypes.STRING(80), field:'USERNAME' },
        email:{type: DataTypes.STRING(160), field:'EMAIl'},
        phone:{type: DataTypes.STRING(20), field:'PHONE'},
        create_time:{type: DataTypes.DATE, field:'CREATED',},
        country:{type: DataTypes.STRING(4), field:'COUNTRY'},
        language:{type: DataTypes.STRING(4), field:'LANGUAGE'},
        firstname:{type: DataTypes.STRING(255), field:'firstname'},
        lastname:{type: DataTypes.STRING(255), field:'lastname'},
        org:{type: DataTypes.STRING(255), field:'org'},
        bio:{type: DataTypes.TEXT, field:'bio'},
        sex:{type: DataTypes.STRING(10), field:'sex'},
        birthday:{type: DataTypes.STRING(45), field:'birthday'},
        school_id:{type: DataTypes.BIGINT(50), field:'school_id'},
        school_key:{type: DataTypes.STRING(255), field:'school_key'},
        school_region:{type: DataTypes.STRING(255), field:'school_region'},
        school_name:{type: DataTypes.STRING(255), field:'school_name'},
        background_url:{type: DataTypes.TEXT, field:'background_url'},
        serving_url:{type: DataTypes.TEXT, field:'serving_url'},
        forget_password:{type: DataTypes.STRING(255), field:'forget_password'},
        last_update_time:{type: DataTypes.DATE, field:'last_update_time'},
        openid:{type: DataTypes.STRING(200), field:'openid'},
        unionid:{type: DataTypes.STRING(200), field:'unionid'},
        province:{type: DataTypes.STRING(200), field:'province'},
        wechat_privilege:{type: DataTypes.STRING(200), field:'wechat_privilege'},
        qq_vip:{type: DataTypes.STRING(200), field:'qq_vip'},
      },
      { freezeTableName: true,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }// Model tableName will be the same as the model name//
  );
};