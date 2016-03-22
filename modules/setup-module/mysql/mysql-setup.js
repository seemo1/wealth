/**
 * Created by rayson on 15/6/29.
 */
'use strict';

var mysqlSetup = {};
var Promise = require('bluebird');

// var mysqlCenterClient = require('../../../utils/ltscentralmysql-client');
// var mysqlGlobalClient = require('../../../utils/ltsglobalmysql-client');

var social_user_account_SQL = 'CREATE TABLE IF NOT EXISTS `social_user_account` (\
            `user_id` varchar(40) ,\
            `coins` int(11) DEFAULT 0,\
            `fuel` int(11) DEFAULT 0,\
            `publish_time` timestamp NULL DEFAULT NULL,\
            `last_update_time` timestamp NULL DEFAULT NULL,\
                PRIMARY KEY (`user_id`)\
            ) ENGINE=InnoDB  ';

var social_coin_record_SQL = 'CREATE TABLE IF NOT EXISTS `social_coin_record` (\
            `coin_id` varchar(20) ,\
            `coin_number` int(11) DEFAULT \'0\',\
            `msg` text ,\
            `status` varchar(4)  DEFAULT NULL,\
            `type` varchar(3)  DEFAULT NULL,\
            `user_id` varchar(40)  DEFAULT NULL,\
            `transact_id` varchar(20)  DEFAULT NULL,\
            `gae_coin_id` varchar(20)  DEFAULT NULL,\
            `publish_time` timestamp NULL DEFAULT NULL,\
            `last_update_time` timestamp NULL DEFAULT NULL,\
                PRIMARY KEY (`coin_id`)\
            ) ENGINE=InnoDB  ';

var literal_group = 'CREATE TABLE IF NOT EXISTS `literal_group` (\
            `group_id` varchar(40) ,\
            `name` varchar(255)  DEFAULT NULL,\
                PRIMARY KEY (`group_id`)\
            ) ENGINE=InnoDB ';

var alter = 'ALTER TABLE `ACCOUNTS_DAILY` \
            ADD INDEX `ranking_d1` (`TRADE_DATE` ASC, `PnLRate` ASC),\
            ADD INDEX `ranking_d5` (`TRADE_DATE` ASC, `5DPnLRate` ASC),\
            ADD INDEX `ranking_m` (`TRADE_DATE` ASC, `MTD` ASC),\
            ADD INDEX `ranking_y` (`ON_TIME` ASC, `YTD` ASC),\
            ADD INDEX `ranking_all` (`ON_TIME` ASC, `OverAllPnLRate` ASC)';

var literal_following = 'CREATE TABLE IF NOT EXISTS `following` (\
            `follower_userid` varchar(45) ,\
            `following_userid` varchar(45) ,\
            `follower_username` longtext  DEFAULT NULL,\
            `following_username` longtext  DEFAULT NULL,\
            `type` int(11) NOT NULL DEFAULT 1,\
            `publish_time` varchar(255)  DEFAULT NULL,\
            `last_update_time` varchar(255)  DEFAULT NULL,\
            PRIMARY KEY (`follower_userid`,`following_userid`)\
            ) ENGINE=InnoDB  ';

var contest_social = 'CREATE TABLE IF NOT EXISTS `contest_social` ( \
                    `contest_id` varchar(16)  NOT NULL COMMENT \'Contest ID ：產生規則 yyyymmddhhmmss + 隨機亂數兩組號碼\', \
                    `name` varchar(512)  DEFAULT NULL COMMENT \'比賽名稱 - 海外版\', \
                    `title` varchar(512)  DEFAULT NULL COMMENT \'比賽標題 - 海外版\', \
                    `icon_image` text  COMMENT \'比賽圖示( aliyun image ) - 海外版\', \
                    `description` text  COMMENT \'比賽敘述 - 海外版\', \
                    `cn_name` varchar(512)  DEFAULT NULL COMMENT \'比賽名稱 - 簡中版\', \
                    `cn_title` varchar(512)  DEFAULT NULL COMMENT \'比賽標題 - 簡中版\', \
                    `cn_icon_image` text  COMMENT \'比賽圖示( aliyun image ) - 簡中版\', \
                    `cn_description` text  COMMENT \'比賽敘述 - 簡中版\', \
                    `tw_name` varchar(512)  DEFAULT NULL COMMENT \'比賽名稱 - 繁中版\', \
                    `tw_title` varchar(512)  DEFAULT NULL COMMENT \'比賽標題 - 繁中版\', \
                    `tw_icon_image` text  COMMENT \'比賽圖示( aliyun image ) - 繁中版\', \
                    `tw_description` text  COMMENT \'比賽敘述 - 繁中版\', \
                    `start_date_time` timestamp NOT NULL DEFAULT \'0000-00-00 00:00:00\' COMMENT \'比賽開始時間（台灣時間）\', \
                    `end_date_time` timestamp NOT NULL DEFAULT \'0000-00-00 00:00:00\' COMMENT \'比賽結束時間（台灣時間）\', \
                    `status` varchar(10)  DEFAULT NULL COMMENT \'比賽狀態 \'\'N\'\' : 草稿模式 , \'\'Y\'\' : 準備中&進行中 , \'\'X\'\' : 已失效\', \
                    `region` varchar(512)  DEFAULT NULL COMMENT \'比賽所屬國度代號（參考國碼縮寫，如EN,CN,TW）\', \
                    `join_cond_free` varchar(10)  DEFAULT NULL COMMENT \'比賽條件 - Y : 自由參賽 ; N : 非自由參加\', \
                    `join_cond_school_key` varchar(512)  DEFAULT NULL COMMENT \'比賽條件 - school_key\', \
                    `join_cond_school_region` varchar(512)  DEFAULT NULL COMMENT \'比賽條件 - school_region\', \
                    `join_cond_user_country` varchar(512)  DEFAULT NULL COMMENT \'比賽條件 - 用戶的country\', \
                    `join_cond_mail` text COMMENT \'比賽條件 - 用戶的email\', \
                    `reward_max_money` float DEFAULT NULL COMMENT \'比賽獎金資訊 - 金額最大值\', \
                    `reward_base_money` float DEFAULT NULL COMMENT \'比賽獎金資訊 - 金額基礎數值\', \
                    `reward_rise_money` float DEFAULT NULL COMMENT \'比賽獎金資訊 - 單次上升金額數值\', \
                    `reward_coin_mark` varchar(128)  DEFAULT NULL COMMENT \'比賽獎金資訊 - 金額符號\', \
                    `reward_coin_name` varchar(128)  DEFAULT NULL COMMENT \'比賽獎金資訊 - 金額符號名稱\', \
                    `reward_bonus_ratio` varchar(512)  DEFAULT NULL COMMENT \'比賽獎金資訊 - 得獎排行的獎金獲得比例，如 70,20,10\', \
                    `reward_stop_rise_date_time` timestamp NOT NULL DEFAULT \'0000-00-00 00:00:00\' COMMENT \'比賽獎金資訊 - 獎金停止成長的時間（台灣時間）\', \
                    `reward_base_join_total` int(11) DEFAULT NULL COMMENT \'比賽獎金資訊 - 最小參賽人數\', \
                    `user_join_sum` int(11) DEFAULT NULL COMMENT \'目前比賽累積的參賽人數\', \
                    `current_money` int(11) DEFAULT NULL COMMENT \'目前比賽的金額\', \
                    `version` varchar(10)  DEFAULT NULL COMMENT \'比賽版本：{固定獎金制:1 , 浮動獎金:2 , 浮動獎金+多語系: 2.1 , 浮動獎金v2.0+多語系 :3.0}\', \
                    `reward_money_list` varchar(512)  DEFAULT NULL COMMENT \'目前獎金金額的列表（有人加入就會更新）。如 200,100,59\', \
                    `reward_item_list` varchar(512)  DEFAULT NULL COMMENT \'兼容舊版的（ contest 1.0時期），如 \'\'Iphone 4\'\' or \'\'Apple Watch\'\' or \'\'Iphone 6,Iphone 5\'\'\', \
                    `reward_complex_list` varchar(512) DEFAULT NULL COMMENT \'綜合列表，兼容獎金跟獎品的列表（只是先開著，未來規格說不定會用到）\', \
                    `publish_time` timestamp NOT NULL DEFAULT \'0000-00-00 00:00:00\' COMMENT \'資料新增時間\', \
                    `last_update_time` timestamp NOT NULL DEFAULT \'0000-00-00 00:00:00\' COMMENT \'資料最後修改時間\', \
                        PRIMARY KEY (`contest_id`) \
                    ) ENGINE=InnoDB ';


var contest_social_join = 'CREATE TABLE IF NOT EXISTS `contest_social_join` ( \
                            `contest_id` varchar(16) NOT NULL, \
                            `user_id` varchar(40) NOT NULL, \
                            `join_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP, \
                                PRIMARY KEY (`contest_id`,`user_id`) \
                            ) ENGINE=InnoDB ';

var social_referral_log = 'CREATE TABLE IF NOT EXISTS `social_referral_log` ( \
                            `user_id` VARCHAR(50) NOT NULL , \
                            `by_user_id` VARCHAR(50) NOT NULL , \
                            `publish_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , \
                                PRIMARY KEY (`user_id`, `by_user_id`) \
                            ) ENGINE=InnoDB ';

var user_referral_code = 'CREATE TABLE IF NOT EXISTS `user_referral_code` ( \
                          `user_id` varchar(40) NOT NULL, \
                          `referral_code` varchar(10) NOT NULL, \
                          `referral_by` varchar(40) DEFAULT NULL, \
                          `publish_time` datetime DEFAULT NULL, \
                          `last_update_time` datetime DEFAULT NULL, \
                          `referral_count` int(11) DEFAULT \'0\', \
                            PRIMARY KEY (`referral_code`) \
                          ) ENGINE=InnoDB ;';

var popular_trader_count_daily = 'CREATE TABLE IF NOT EXISTS `popular_trader_count_daily` ( \
                            `user_id` varchar(50) NOT NULL, \
                            `market` varchar(45) NOT NULL, \
                            `login_count` int(11) DEFAULT \'0\', \
                            `tran_count` int(11) DEFAULT \'0\', \
                            `comment_count` int(11) DEFAULT \'0\', \
                            `post_count` int(11) DEFAULT \'0\', \
                            `date` datetime NOT NULL, \
                                PRIMARY KEY (`user_id`,`market`,`date`) \
                            ) ENGINE=InnoDB ';
var cronjob_log = 'CREATE TABLE IF NOT EXISTS `cronjob_log` ( \
                `id` INT NOT NULL AUTO_INCREMENT COMMENT \'\', \
                `name` VARCHAR(255) NOT NULL COMMENT \'\', \
                `date` VARCHAR(45) NOT NULL COMMENT \'\', \
                `market` VARCHAR(10) NULL COMMENT \'\', \
                `start_time` DATETIME NULL COMMENT \'\', \
                `end_time` DATETIME NULL COMMENT \'\', \
                `error_msg` LONGTEXT NULL COMMENT \'\', \
                `error_time` DATETIME NULL COMMENT \'\', \
                    PRIMARY KEY (`id`, `name`) \
                )ENGINE=InnoDB  ';


var global_school = 'CREATE TABLE IF NOT EXISTS `school` ( ' +
'`school_key` VARCHAR(25) NOT NULL COMMENT \'\', ' +
'`en_name` TEXT NULL COMMENT \'\', ' +
'`en_short` VARCHAR(45) NULL COMMENT \'\', ' +
'`sc_name` TEXT NULL COMMENT \'\', ' +
'`sc_pinyin` VARCHAR(45) NULL COMMENT \'\', ' +
'`tc_name` TEXT NULL COMMENT \'\', ' +
'`region` VARCHAR(25) NOT NULL DEFAULT 0 COMMENT \'\', ' +
'`display_en` TINYINT(1) NULL DEFAULT 0 COMMENT \'\', ' +
'`display_sc` TINYINT(1) NULL DEFAULT 0 COMMENT \'\', ' +
'`display_tc` TINYINT(1) NULL COMMENT \'\', ' +
'`domains` VARCHAR(45) NULL COMMENT \'\', ' +
'`flag_url` TEXT NULL COMMENT \'\', ' +
'`oss_flag_url` TEXT NULL COMMENT \'\', ' +
'`group_id` TEXT NULL COMMENT \'\', ' +
'`device_language` VARCHAR(10) NULL COMMENT \'\', ' +
'`is_del` TINYINT(1) NULL DEFAULT 0 COMMENT \'\', ' +
'`publish_time` DATETIME NOT NULL COMMENT \'\', ' +
'`last_update_time` DATETIME NOT NULL COMMENT \'\', ' +
    'PRIMARY KEY (`school_key`)) ENGINE=InnoDB ';

var global_school_group = 'CREATE TABLE IF NOT EXISTS `school_group` ( ' +
'`school_key` VARCHAR(25) NOT NULL COMMENT \'\', ' +
'`market` VARCHAR(25) NOT NULL COMMENT \'\', ' +
'`group_id` VARCHAR(50) NOT NULL COMMENT \'\', ' +
    'PRIMARY KEY (`school_key`,`market`,`group_id`)) ENGINE=InnoDB ';

var global_concentration = 'CREATE TABLE IF NOT EXISTS `concentration` ( ' +
'`concentration_key` VARCHAR(10) NOT NULL , ' +
'`en_name` TEXT NOT NULL COMMENT \'\', ' +
'`en_short` VARCHAR(45) NOT NULL DEFAULT \'\' COMMENT \'\', ' +
'`sc_name` TEXT NOT NULL COMMENT \'\', ' +
'`sc_pinyin` VARCHAR(45) NOT NULL DEFAULT \'\' COMMENT \'\', ' +
'`tc_name` TEXT NOT NULL COMMENT \'\', ' +
'`region` VARCHAR(25) NOT NULL DEFAULT \'\' COMMENT \'\', ' +
'`concentration_group` VARCHAR(45) NOT NULL COMMENT \'\', ' +
'`is_del` TINYINT(1) NOT NULL DEFAULT 0 COMMENT \'\', ' +
'`people_count` INT(5) NOT NULL DEFAULT 0 COMMENT \'\', ' +
'`publish_time` DATETIME NOT NULL COMMENT \'\', ' +
'`last_update_time` DATETIME NOT NULL COMMENT \'\', ' +
    'PRIMARY KEY (`concentration_key`)) ENGINE=InnoDB ';

var global_user_school_detail = 'CREATE TABLE IF NOT EXISTS `user_school_detail` ( ' +
'`user_id` varchar(40) NOT NULL , ' +
'`concentration_key` varchar(20) NOT NULL DEFAULT \'\' COMMENT \'\', ' +
'`start_year` VARCHAR(5) NOT NULL DEFAULT \'\' COMMENT \'\', ' +
'`end_year` VARCHAR(5) NOT NULL DEFAULT \'\' COMMENT \'\', ' +
'`url1` TEXT NOT NULL  COMMENT \'\', ' +
'`url2` TEXT NOT NULL  COMMENT \'\', ' +
'`is_verified` varchar(1) NOT NULL DEFAULT 0 COMMENT \'\', ' +
'`verify_date` varchar(10) NOT NULL DEFAULT \'\' COMMENT \'\', ' +
'`reject_reason` varchar(45) NOT NULL DEFAULT \'\' COMMENT \'\', ' +
'`publish_time` DATETIME NOT NULL COMMENT \'\', ' +
'`last_update_time` DATETIME NOT NULL COMMENT \'\', ' +
    'PRIMARY KEY (`user_id`)) ENGINE=InnoDB ';

var global_user_type = 'CREATE TABLE IF NOT EXISTS `user_type` ( ' +
'`user_id` varchar(40) , ' +
'`type_id` varchar(5) NOT NULL, ' +
'`publish_time` datetime DEFAULT CURRENT_TIMESTAMP, ' +
    'PRIMARY KEY (`user_id`,`type_id`) ) ENGINE=InnoDB ';

var global_user_type_list = 'CREATE TABLE IF NOT EXISTS `user_type_list` ( ' +
    '`type_id` varchar(5) NOT NULL, ' +
    '`name` varchar(40) , ' +
    '`note` varchar(120) , ' +
    'PRIMARY KEY (`type_id`) ) ENGINE=InnoDB  ';


var global_group_info="CREATE TABLE IF NOT EXISTS  `group_info` (\n" +
    "  `group_id` varchar(60) NOT NULL DEFAULT '',\n" +
    "  `background_url` varchar(200) DEFAULT NULL,\n" +
    "  `create_userid` varchar(60) DEFAULT NULL,\n" +
    "  `description` varchar(200) DEFAULT NULL,\n" +
    "  `gae_group_id` varchar(200) DEFAULT NULL,\n" +
    "  `image_height` int(11) DEFAULT NULL,\n" +
    "  `image_width` int(11) DEFAULT NULL,\n" +
    "  `last_update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
    "  `name` varchar(60) DEFAULT NULL,\n" +
    "  `ossserving_url` varchar(200) DEFAULT NULL,\n" +
    "  `publish_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',\n" +
    "  `serving_url` varchar(200) DEFAULT NULL,\n" +
    "  `type` varchar(20) DEFAULT NULL,\n" +
    "  PRIMARY KEY (`group_id`)\n" +
    ") ENGINE=InnoDB";

var global_group_member="CREATE TABLE IF NOT EXISTS `group_member` (\n" +
    "  `group_id` varchar(60) NOT NULL DEFAULT '',\n" +
    "  `user_id` varchar(60) NOT NULL DEFAULT '',\n" +
    "  `publish_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
    "  PRIMARY KEY (`group_id`,`user_id`)\n" +
    ") ENGINE=InnoDB";

var global_group_invited="CREATE TABLE IF NOT EXISTS `group_invited` (\n" +
    "  `group_id` varchar(60) NOT NULL DEFAULT '',\n" +
    "  `user_id` varchar(60) NOT NULL DEFAULT '',\n" +
    "  `publish_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
    "  PRIMARY KEY (`group_id`,`user_id`)\n" +
    ") ENGINE=InnoDB";

var global_group_request="CREATE TABLE IF NOT EXISTS `group_requested` (\n" +
    "  `group_id` varchar(60) NOT NULL DEFAULT '',\n" +
    "  `user_id` varchar(60) NOT NULL DEFAULT '',\n" +
    "  `publish_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
    "  PRIMARY KEY (`group_id`,`user_id`)\n" +
    ") ENGINE=InnoDB";

var global_discover_news=" CREATE TABLE `discover_news` ( " +
    "  `id` int(11) unsigned NOT NULL AUTO_INCREMENT, " +
    "  `type` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '目前只有 academy', " +
    "  `language` enum('CN','TW','EN') COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '語系', " +
    "  `name` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'type 內的屬性', " +
    "  `time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '用時間來比較小紅點顯示與否', " +
    " PRIMARY KEY (`id`) " +
    " ) ENGINE=InnoDB ";

mysqlSetup.contestTableScheam = {
  "5.0" : {
    contest_social_center : 'CREATE TABLE IF NOT EXISTS contest_social_center ( ' +
    'contest_id VARCHAR(20)  NOT NULL, ' +
    'start_date_time DATETIME NOT NULL COMMENT "比賽實際開始的時間(GMT+0)", ' +
    'end_date_time DATETIME NOT NULL COMMENT "比賽實際結束的時間(GMT+0", ' +
    'apply_user_total INT(11) UNSIGNED NOT NULL DEFAULT 0, ' +
    'progress_status ENUM("W","R","G","P","C")  NULL DEFAULT "W" COMMENT "比賽進行狀態（ W = 草稿模式 , R = 準備中 , G = 進行中 , P = 已結束 , C = 已取消）", ' +
    'is_new ENUM("Y","N")  NULL DEFAULT "Y" COMMENT "Y = 是新版HTML View 的比賽 , N = 是舊版 App View 的比賽", ' +
    'create_type ENUM("1","2")  NULL DEFAULT "1" COMMENT "比賽類型：1 = 一般比賽（由TW admin 後台建立） , 2 = FDT Lab（由CN admin 後台建立）", ' +
    'guest_user_visible ENUM("Y","N")  NULL DEFAULT "Y" COMMENT "未登入用戶可見的比賽", ' +
    'can_join_user_visible ENUM("Y","N")  NULL DEFAULT "N" COMMENT "符合資格的用戶可見", ' +
    'award_item CHAR(1)  NULL DEFAULT "" COMMENT "A = 浮動獎金制 , B = 固定獎金制", ' +
    'current_money DECIMAL(12,2) UNSIGNED NULL DEFAULT 0 COMMENT "如果是固定獎金制，就會等於 fixed_reward_total_money . 如果是浮動獎金制，則每個人加入時會刷新", ' +
    'fixed_reward_total_money DECIMAL(12,2) UNSIGNED NULL DEFAULT 0 COMMENT "固定獎金制：此比賽就固定這個金額", ' +
    'dynamic_reward_base_money DECIMAL(12,2) UNSIGNED NULL DEFAULT 0 COMMENT "浮動獎金制：獎金基礎值", ' +
    'dynamic_reward_rise_money DECIMAL(12,2) UNSIGNED NULL DEFAULT 0 COMMENT "浮動獎金制：參賽者加入時，獎金數值的成長幅度", ' +
    'dynamic_reward_max_money DECIMAL(12,2) UNSIGNED NULL DEFAULT 0 COMMENT "浮動獎金制：參賽者加入時，獎金數值的成長幅度的最大上限值", ' +
    'join_cond_enable ENUM("Y","N")  NULL DEFAULT "N" COMMENT "比賽門檻：是否為無門檻類型的比賽 ( Y = 需要通過檢查才可以加入比賽 , N = 誰都可以加入的比賽 )", ' +
    'join_cond_has_school ENUM("Y","N")  NULL DEFAULT "N" COMMENT "比賽門檻：參賽帳號必須有有設置過任一學校 ( Y = 是 , N = 不是 )", ' +
    'join_cond_school_checking_before ENUM("Y","N")  NULL DEFAULT "N" COMMENT "比賽門檻：必須是事先通過學校驗證才可以參加的比賽 ( Y = 是 , N = 不是 ) ", ' +
    'join_cond_has_phone ENUM("Y","N")  NULL DEFAULT "N" COMMENT "比賽門檻：參賽帳號必須有綁定手機( Y = 是 , N = 不是 ) ", ' +
    'join_cond_school_key VARCHAR(512)  NULL DEFAULT "" COMMENT "比賽門檻：只有指定學校的學生才可以參賽，school key 如有複數則中間用逗點隔開", ' +
    'join_cond_school_region VARCHAR(512)  NULL DEFAULT "" COMMENT "比賽門檻：只有指定的國家校區的學生才可以參賽，school region 如有複數則中間用逗點隔開", ' +
    'join_cond_before_the_end_day_can_not_join VARCHAR(20)  NULL DEFAULT 0 COMMENT "比賽門檻：比賽結束前的N天內不能再加入, 空值代表不限制", ' +
    'join_cond_group VARCHAR(512)  NULL DEFAULT "" COMMENT "比賽門檻：只能是指定群組用戶才可以加入的比賽 ,  空值代表不限制 , 如有複數則中間用逗點隔開", ' +
    'join_cond_least_money VARCHAR(512)  NULL DEFAULT "" COMMENT "比賽門檻：必須[大於]指定的Account value 才能加入比賽 ,  空值代表不限制", ' +
    'join_cond_max_money VARCHAR(512)  NULL DEFAULT "" COMMENT "比賽門檻：必須[小於]指定的Account value 才能加入比賽 ,  空值代表不限制", ' +
    'ongoing_setting_stop_loss_point VARCHAR(512)  NULL DEFAULT "" COMMENT "淘汰機制：虧損超過指定的N%即喪失比賽資格,設置空值代表不限制", ' +
    'upcoming_setting_activation_user_total VARCHAR(512)  NULL DEFAULT "" COMMENT "淘汰機制：最少參賽人數限制，如果未達標則比賽會被取消,設置空值代表不限制", ' +
    'default_language CHAR(10)  NULL DEFAULT "" COMMENT "預設語系設定：假設token遇到的 語系並為支援，會轉而顯示預設語系", ' +
    'market_code VARCHAR(20)  NULL DEFAULT "" COMMENT "三合一用途的產品代號（FX,SC,FC,FT)", ' +
    'publish_time DATETIME NULL COMMENT "資料新增時間", ' +
    'last_update_time DATETIME NULL COMMENT "資料最後修改時間", ' +
    'PRIMARY KEY (contest_id) ' +
    ')ENGINE=InnoDB ' ,
    contest_social_notice  : 'CREATE TABLE IF NOT EXISTS contest_social_notice (' +
    'contest_id VARCHAR(20)  NOT NULL COMMENT "比賽的代號", ' +
    'name VARCHAR(512)  NULL COMMENT "比賽名稱", ' +
    'title VARCHAR(512)  NULL COMMENT "比賽標題", ' +
    'icon_image TEXT  NULL COMMENT "比賽圖片", ' +
    'coin_mark VARCHAR(512)  NULL COMMENT "金額符號", ' +
    'reward_description TEXT  NULL COMMENT "比賽獎金說明敘述", ' +
    'content_description TEXT  NULL COMMENT "比賽說明敘述", ' +
    'language VARCHAR(20)  COMMENT "用戶對應的語系，譬如EN,CN,TW", ' +
    'publish_time DATETIME NULL, ' +
    'last_update_time DATETIME NULL COMMENT "資料最後修改時間", ' +
    'PRIMARY KEY (contest_id,language) ' +
    ')ENGINE=InnoDB ' ,
    contest_social_join_user_performance : 'CREATE TABLE IF NOT EXISTS contest_social_join_user_performance ( ' +
    'contest_id VARCHAR(20)  NOT NULL COMMENT "比賽的代號", ' +
    'user_id VARCHAR(40)  NOT NULL COMMENT "該用戶的userId", ' +
    'ranking_date DATE NOT NULL COMMENT "當入結算的日期", ' +
    'ranking INT(11) UNSIGNED NULL COMMENT "當日比賽排名", ' +
    'ranking_upgrade_status VARCHAR(10)  NULL COMMENT "當日比賽排名，與昨天比較，是上升或者下降（ down = 下降 , up = 上升 , 沒變 = same ）" , ' +
    'ranking_upgrade INT(11) NULL COMMENT "當日比賽排名，與昨天比較，是上升或者下降了多少值", ' +
    'score_sum DECIMAL(12,2) NULL COMMENT "當日比賽評分", ' +
    'score_sum_upgrade_status VARCHAR(10)  NULL COMMENT "當日比賽評分，與昨天比較，是上升或者下降（ down = 下降 , up = 上升 , 沒變 = same）", ' +
    'score_sum_upgrade INT(11) NULL COMMENT "當日比賽評分，與昨天比較，是上升或者下降了多少值", ' +
    'competition_compare_scale VARCHAR(20)  NULL COMMENT "當日比賽結算後，超過其他參賽者的比例", ' +
    'competition_compare_scale_upgrade_status VARCHAR(10)  NULL COMMENT "當日比賽結算後，超過其他參賽者的比例，與昨天比較，是上升或者下降（ down = 下降 , up = 上升 , 沒變 = same）", ' +
    'profitability DECIMAL(12,2) NULL COMMENT "盈利能力", ' +
    'activity DECIMAL(12,2) NULL COMMENT "活耀度", ' +
    'consistency DECIMAL(12,2) NULL COMMENT "行為一致性", ' +
    'risk_control DECIMAL(12,2) NULL COMMENT "風險控制", ' +
    'roi DECIMAL(12,2) NULL COMMENT "投資報酬率", ' +
    'publish_time DATETIME NULL COMMENT "資料新增時間", ' +
    'PRIMARY KEY (contest_id, user_id, ranking_date) ' +
    ')ENGINE=InnoDB ',
    contest_social_join_user : 'CREATE TABLE IF NOT EXISTS contest_social_join_user ( ' +
    'contest_id VARCHAR(20)  NOT NULL COMMENT "比賽的代號", ' +
    'user_id VARCHAR(40)  NOT NULL COMMENT "該用戶的userId（這個是by 產品的. 有可能是 FX,FC,SC或者FT的用戶ID）", ' +
    'fx_user_id VARCHAR(40)  NOT NULL COMMENT "因應3合1之後的查詢到social這端僅會傳送FX的用戶ID, 用來反查其他相關資訊使用", ' +
    'join_date_time DATETIME NULL COMMENT "用戶加入的日期(GMT+0)", ' +
    'identity CHAR(10)  NULL COMMENT "參賽身份（1 = 競賽中 , 2 = 已經失去資格）", ' +
    'is_new_contest_join ENUM("Y","N")  NULL DEFAULT "Y" COMMENT "是否是新版比賽的用戶, Y = 是 , N = 不是 ", ' +
    'publish_time DATETIME NULL COMMENT "資料新增時間", ' +
    'last_update_time DATETIME NULL COMMENT "資料最後修改時間", ' +
    'PRIMARY KEY (contest_id, user_id) ' +
    ')ENGINE=InnoDB ',
    contest_bulletion : 'CREATE TABLE IF NOT EXISTS contest_bulletin ( ' +
    'title VARCHAR(512)  NOT NULL COMMENT "公告名稱", ' +
    'link TEXT  NULL COMMENT "對應連結名稱" , ' +
    'running_time_second INT(11) UNSIGNED NULL DEFAULT 8 COMMENT "單次顯示停駐時間", ' +
    'seq INT(11) UNSIGNED NOT NULL COMMENT "顯示順序", ' +
    'start_date_time DATETIME NULL COMMENT "顯示實際開始的時間(GMT+0)", ' +
    'end_date_time DATETIME NULL COMMENT "顯示實際結束的時間(GMT+0)", ' +
    'language  varchar(20)  NOT NULL COMMENT "用戶對應的語系，譬如EN,CN,TW，如果語系匹配不到或者這個比賽不需要多語系，則可以選擇default(-)", ' +
    'publish_time DATETIME NULL COMMENT "資料新增時間", ' +
    'last_update_time DATETIME NULL COMMENT "資料最後修改時間", ' +
    'PRIMARY KEY (seq,language) ' +
    ')ENGINE=InnoDB '  ,
    contest_banner : 'CREATE TABLE IF NOT EXISTS contest_banner (' +
    'image TEXT  NULL COMMENT "比賽圖片", ' +
    'link TEXT  NULL COMMENT "對應連結名稱", ' +
    'place_type  varchar(20)  NOT NULL COMMENT "TOP = 上方圖片 , BOTTOM = 下方圖片", ' +
    'language  varchar(20)  NOT NULL COMMENT "用戶對應的語系，譬如EN,CN,TW", ' +
    'publish_time DATETIME NULL COMMENT "資料新增時間", ' +
    'last_update_time DATETIME NULL COMMENT "資料最後修改時間" ,' +
    'PRIMARY KEY (place_type , language ) ' +
    ')ENGINE=InnoDB  '
  }
};

mysqlSetup.setup = function(request, reply) {
  var msg = '';
  return new Promise(function(resolve, reject) {
    // 美化一下寫法 by Joe
    resolve();
  })
        .then(function() {
          msg += 'CREATE Global social_user_account Success\n';
          return mysqlSetup.createGlobal(social_user_account_SQL);
        })
        .then(function() {
          msg += 'CREATE Global social_coin_record Success\n';
          return mysqlSetup.createGlobal(social_coin_record_SQL);
        })
        .then(function() {
          msg += 'CREATE Center literal_group Success\n';
          return mysqlSetup.createCenter(literal_group);
        })
        .then(function() {
          msg += 'CREATE Center literal_following Success\n';
          return mysqlSetup.createCenter(literal_following);
        })
        .then(function() {
          msg += 'CREATE Center contest_social Success\n';
          return mysqlSetup.createCenter(contest_social);
        })
        .then(function() {
          msg += 'CREATE Center contest_social_join Success\n';
          return mysqlSetup.createCenter(contest_social_join);
        })
        .then(function() {
          msg += 'CREATE Center social_referral_log Success\n';
          return mysqlSetup.createCenter(social_referral_log);
        })
        .then(function() {
          msg += 'CREATE Global popular_trader_count_daily Success\n';
          return mysqlSetup.createGlobal(popular_trader_count_daily);
        })
        .then(function() {
          msg += 'CREATE Global cronjob_log Success\n';
          return mysqlSetup.createGlobal(cronjob_log);
        })
        .then(function() {
          msg += 'CREATE Center contest_banner Success\n';
          return mysqlSetup.createCenter(mysqlSetup.contestTableScheam['5.0'].contest_banner);
        })
        .then(function() {
          msg += 'INSERT contest_banner Data Success\n';

          try {
              console.log('contest_banner try');
              var listSql = [
                  'insert into contest_banner (place_type,language,publish_time) values ( "TOP","EN",now() )',
                  'insert into contest_banner (place_type,language,publish_time) values ( "TOP","CN",now() )',
                  'insert into contest_banner (place_type,language,publish_time) values ( "TOP","TW",now() )',
                  'insert into contest_banner (place_type,language,publish_time) values ( "BOTTOM","EN",now() )',
                  'insert into contest_banner (place_type,language,publish_time) values ( "BOTTOM","CN",now() )',
                  'insert into contest_banner (place_type,language,publish_time) values ( "BOTTOM","TW",now() )',
              ];

              for (var i = 0; i < listSql.length; i++) {
                  mysqlSetup.createCenter(listSql[i]);
              }
          }
          catch(err) {
          }
          finally {
              return new Promise.resolve();
          }
        })
        .then(function() {
          msg += 'CREATE Center contest_bulletion Success\n';
          return mysqlSetup.createCenter(mysqlSetup.contestTableScheam['5.0'].contest_bulletion);
        })
        .then(function() {
          msg += 'CREATE Center contest_social_center Success\n';
          return mysqlSetup.createCenter(mysqlSetup.contestTableScheam['5.0'].contest_social_center);
        })
        .then(function() {
          msg += 'CREATE Center contest_social_notice Success\n';
          return mysqlSetup.createCenter(mysqlSetup.contestTableScheam['5.0'].contest_social_notice);
        })
        .then(function() {
          msg += 'CREATE Global contest_social_join_user Success\n';
          return mysqlSetup.createCenter(mysqlSetup.contestTableScheam['5.0'].contest_social_join_user);
        })
        .then(function() {
          msg += 'CREATE Global contest_social_join_user_performance Success\n';
          return mysqlSetup.createCenter(mysqlSetup.contestTableScheam['5.0'].contest_social_join_user_performance);
        })
        .then(function() {
            msg += 'CREATE Global global_school Success\n';
            return mysqlSetup.createGlobal(global_school);
        })
        .then(function() {
          msg += 'CREATE Global global_school Success\n';
          return mysqlSetup.createGlobal(global_concentration);
        })
        .then(function() {
          msg += 'CREATE Global global_concentration Success\n';
          return mysqlSetup.createGlobal(global_school_group);
        })
        .then(function() {
          msg += 'CREATE Global global_school_group Success\n';
          return mysqlSetup.createGlobal(global_user_school_detail);
        })
        .then(function() {
          msg += 'CREATE Global global_user_school_detail Success\n';
          return mysqlSetup.createGlobal(global_user_type_list);
        }).then(function() {
          msg += 'CREATE Global global_user_school_detail Success\n';
          return mysqlSetup.createGlobal(global_user_type_list);
      }).then(function() {
        msg += 'CREATE Global global_user_school_detail Success\n';
        return mysqlSetup.createGlobal(global_group_info);
    }).then(function() {
          msg += 'CREATE Global global_group_info Success\n';
          return mysqlSetup.createGlobal(global_group_member);
      }).then(function() {
          msg += 'CREATE Global global_group_member Success\n';
          return mysqlSetup.createGlobal(global_group_invited);
      }).then(function() {
          msg += 'CREATE Global global_group_invited Success\n';
          return mysqlSetup.createGlobal(global_group_request);
      }).then(function() {
        msg += 'CREATE Global user_referral_code Success\n';
        return mysqlSetup.createGlobal(user_referral_code);
      }).then(function() {
        msg += 'CREATE Global global_group_request Success\n';
          var listSql = [
              'insert into user_type_list (type_id,name,note) values ("01", "Normal user", "一般用戶")',
              'insert into user_type_list (type_id,name,note) values ("02", "Group member", "有加入團體賽的用戶")',
              'insert into user_type_list (type_id,name,note) values ("03", "Incubatee", "孵化器選手")',
              'insert into user_type_list (type_id,name,note) values ("04", "Seed", "種子選手")',
              'insert into user_type_list (type_id,name,note) values ("05", "Recruiter", "招聘人員，FinLink使用")',
              'insert into user_type_list (type_id,name,note) values ("06", "Investor", "投資人，風投使用")',
              'insert into user_type_list (type_id,name,note) values ("07", "VIP", "VIP(有特殊權限像是進入Cafe VIP room)")',
              'insert into user_type_list (type_id,name,note) values ("08", "FDT Staff", "FDT員工")',
              'insert into user_type_list (type_id,name,note) values ("09", "BA", "校園大使")',
              'insert into user_type_list (type_id,name,note) values ("10", "TWFuturesVIP", "台灣市場種子培育計畫使用")',
              'insert into user_type_list (type_id,name,note) values ("21", "Phone Verified user", "已綁定手機的用戶")',
              'insert into user_type_list (type_id,name,note) values ("22", "School Verified user", "已認證學校的用戶")',
              'insert into user_type_list (type_id,name,note) values ("23", "Email Verified user", "已綁定信箱的用戶")',
              'insert into user_type_list (type_id,name,note) values ("24", "Social Verified user", "已綁定第三方用戶(任一)")',
              'insert into user_type_list (type_id,name,note) values ("31", "Teacher", "老師，FDT Lab使用")',
              'insert into user_type_list (type_id,name,note) values ("32", "Lab student", "生，FDT Lab使用")'
          ];

          for (var i = 0; i < listSql.length; i++) {
              mysqlSetup.createGlobal(listSql[i]);
          }

          return mysqlSetup.createGlobal(global_user_type);
        }).then(function() {
          msg += 'CREATE Global global_discover_news Success\n';
          return mysqlSetup.createGlobal(global_discover_news);
        }).then(function() {
          //insert data
          var sql = " INSERT INTO `discover_news` (`id`, `type`, `language`, `name`, `time`) " +
            " VALUES " +
            " (1, 'academy', 'CN', 'fx', '0000-00-00 00:00:00'), " +
            " (2, 'academy', 'CN', 'fc', '0000-00-00 00:00:00'), " +
            " (3, 'academy', 'CN', 'sc', '0000-00-00 00:00:00'), " +
            " (4, 'academy', 'TW', 'fx', '0000-00-00 00:00:00'), " +
            " (5, 'academy', 'TW', 'ft', '0000-00-00 00:00:00'), " +
            " (6, 'academy', 'EN', 'fx', '0000-00-00 00:00:00')  ";
          return mysqlSetup.createGlobal(sql);
        })
        .then(function() {
          msg += 'CREATE Global global_user_type Success\n';
          return reply(msg);
        })
        .catch(function(err) {
          reply(err);
        });
};

mysqlSetup.createGlobal = function(sql) {
  return new Promise(function(resolve, reject) {
    global.mysqlClient.query(sql, function(error, result) {
      var errorHandling = mysqlErrorCase(sql, error, result);
      if (errorHandling) {
        reject(error);
      }else {
        resolve();
      }
    });
  });

};

mysqlSetup.createCenter = function(sql) {
  return new Promise(function(resolve, reject) {
    global.mysqlCentralClient.query(sql, function(error, result) {
      var errorHandling = mysqlErrorCase(sql, error, result);
      if (errorHandling) {
          reject(error);
      }else {
        resolve();
      }
    });
  });
};

function mysqlErrorCase(sql, error, result) {
  if (error) {
    if (['ER_DUP_ENTRY', 'ER_SP_ALREADY_EXISTS', 'ER_DUP_FIELDNAME', 'ER_TABLE_EXISTS_ERROR'].indexOf(error.code) > -1) {
      // 資料或者欄位重複新增，一樣算過關
      return '';
    }else {
      return error;
    }
  }else {
    return '';
  }
}

module.exports = mysqlSetup;
