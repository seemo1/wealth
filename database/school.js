module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school',
      { school_key:{type: DataTypes.STRING(25), field:'school_key', primaryKey: true },
        en_name:{type: DataTypes.TEXT, field:'en_name' },
        en_short:{type: DataTypes.STRING(45), field:'en_short'},
        sc_name:{type: DataTypes.TEXT, field:'sc_name'},
        sc_pinyin:{type: DataTypes.STRING(45), field:'sc_pinyin'},
        tc_name:{type: DataTypes.TEXT, field:'tc_name'},
        region:{type: DataTypes.STRING(25), field:'region'},
        display_en:{type: DataTypes.INTEGER, field:'display_en'},
        display_sc:{type: DataTypes.INTEGER, field:'display_sc'},
        display_tc:{type: DataTypes.INTEGER, field:'display_tc'},
        domain:{type: DataTypes.STRING(45), field:'domain'},
        flag_url:{type: DataTypes.TEXT, field:'flag_url'},
        oss_flag_url:{type: DataTypes.TEXT, field:'oss_flag_url'},
        device_language:{type: DataTypes.STRING(10), field:'device_language'},
        is_del:{type: DataTypes.INTEGER, field:'is_del'},
        publish_time:{type: DataTypes.DATE, field:'publish_time'},
        last_update_time:{type: DataTypes.DATE, field:'last_update_time'},
      },
      { freezeTableName: true,
        timestamps: true,
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
      }// Model tableName will be the same as the model name//
  );
};