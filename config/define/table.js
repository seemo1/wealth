/**
 * Created by CCMa on 5/8/15.
 */

var table = {};
var lodash = require('lodash');

/**
 *
 * @type {{user: {name: string, old: string[], new: string[]}}}
 * old : GAE tag
 * new : NEW tag
 */
var table =
{
  user: {
    old: ['userid', 'background_Url', 'biggest_Loss', 'biggest_Win', 'numTrade', 'publishtime', 'RankingPer',
            'School_Key', 'School_Name', 'servingUrl', 'WinRatio', 'winningPer', 'CASH', 'Biggest_Loss', 'Biggest_Win',
        'Ranking', 'RankingPer', 'WinRatio', 'winningPer', 'lastupdatetime', 'Daily_Pnl', 'DerbyID', 'OverAllPnLRate',
        'Roll_Price', 'Total_PL', 'UR_Pnl', 'Unit_Price', 'ossbackground_Url', 'ossservingUrl', 'background_Bolbkey', 'Account_Value',],
    new: ['user_id', 'background_url', 'biggest_loss', 'biggest_win', 'num_trade', 'publish_time', 'ranking_per',
            'school_key', 'school_name', 'serving_url', 'win_ratio', 'winning_per', 'cash', 'biggest_loss', 'biggest_win',
        'ranking', 'ranking_per', 'win_ratio', 'winning_per', 'last_update_time', 'daily_pnl', 'derby_id', 'over_all_pnL_rate',
        'roll_price', 'total_pL', 'ur_pnl', 'unit_price', 'ossbackground_url', 'ossserving_url', 'background_bolbkey', 'account_value',],
  },
  user_referral: {
    old: ['referralCode', 'referredBy'],
    new: ['referral_code', 'referral_by'],
  },
  group: {
    name: 'group',
    old: ['groupid', 'imageHeight', 'imageWidth', 'lastupdatetime', 'publishtime', 'servingUrl'],
    new: ['group_id', 'image_height', 'image_width', 'last_update_time', 'publish_time', 'serving_url'],
  },

};

table.convertIn = function(tableName, json)
{
  var oldPath = tableName + '.old';
  var newPath = tableName + '.new';
  var oldAy = lodash.get(table, oldPath, []);
  var newAy = lodash.get(table, newPath, []);
  var newJson = {};

  lodash.forEach(json, function(value, key) {
    var match = 1;
    for (var ii = 0; ii < oldAy.length; ii++) {
      if (key == oldAy[ii]) {
        match = 0;
        lodash.set(newJson, newAy[ii], value);
        break;
      }
    }

    if (match == 1) {
      lodash.set(newJson, key, value);
    }
  });

  return newJson;
};

/**
 * 將old tag加入json中 為了新舊格式相容
 * @param table
 * @param json
 * @returns {*}
 */
table.convertOut = function(tableName, json)
{
  var oldPath = tableName + '.old';
  var newPath = tableName + '.new';
  var oldAy = lodash.get(table, oldPath, []);
  var newAy = lodash.get(table, newPath, []);

  for (var ii = 0; ii < newAy.length; ii++)
  {
    if (lodash.has(json, newAy[ii]))
    {
      lodash.set(json, oldAy[ii], lodash.get(json, newAy[ii], ''));
    }
  }

  return json;
};

module.exports = table;
