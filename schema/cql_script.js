'use strict';

var Config = require('config');
var keyspace = Config.get('Cassandra.keyspace');
var cqlScript = [
    {
      do: 'create keyspace',
      cql: ['create keyspace IF NOT EXISTS ',
          keyspace,
          ' WITH replication = { \'class\':\'SimpleStrategy\', \'replication_factor\': 3 };', ].join(''),
    },

    //ip detect
    {
      do: 'create table ip_nation_country',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.ip_nation_country (',
          '   code text,',
          '   country text,',
          '   iso_code_2 text,',
          '   iso_code_3 text,',
          '   iso_country text,',
          '   lat float,',
          '   lon float,',
          '   PRIMARY KEY (code));',
      ].join(''),
    },
    {
      do: 'create table ip_nation',
      cql: 'CREATE TABLE IF NOT EXISTS ' + keyspace + '.ip_nation (ip_key int, ip bigint, country text, PRIMARY KEY (ip_key, ip)) WITH CLUSTERING ORDER BY (ip DESC);',
    },

    {
      do: 'create index ip_nation(ip)',
      cql: 'CREATE INDEX IF NOT EXISTS on ' + keyspace + '.ip_nation (ip);',
    },
/*
    // bundle+ file
    {
        do: 'create table bundle_appid',
        cql: ['CREATE TABLE IF NOT EXISTS ', keyspace, '.bundle_appid (',
            'product text,',
            'platform text,',
            'appid text,',
            'on_service text,',
            'publish_time timestamp,',
            'PRIMARY KEY (product,platform,appid)',
            ');'].join('')
    },
    {
        do: 'create table bundle_product',
        cql: ['CREATE TABLE IF NOT EXISTS ', keyspace, '.bundle_file (',
            'product text,',
            'platform text,',
            'language text,',
            'environment text,',
            'file_content text,',
            'file_name text,',
            'last_update_time timestamp,',
            'PRIMARY KEY (product,platform,language,environment));'].join('')
    },
    {
        do: 'create table bundle_common',
        cql: ['CREATE TABLE IF NOT EXISTS ', keyspace, '.bundle_common (',
            'product text,',
            'language text,',
            'environment text,',
            'file_content text,',
            'file_name text,',
            'last_update_time timestamp,',
            'PRIMARY KEY (product,language,environment));'].join('')
    },
    {
        do: 'create table bundle_version',
        cql: ['CREATE TABLE IF NOT EXISTS ', keyspace, '.bundle_version (',
            'product text,',
            'platform text,',
            'language text,',
            'environment text,',
            'file_content text,',
            'file_name text,',
            'version text,',
            'last_update_time timestamp,',
            'PRIMARY KEY (product,language,environment));'].join('')
    },
    {
        do: 'create table bundle_version_ctrl',
        cql: ['CREATE TABLE IF NOT EXISTS ', keyspace, '.bundle_version (',
            'product text,',
            'platform text,',
            'language text,',
            'environment text,',
            'is_version_check text,',
            'version text,',
            'last_update_time timestamp,',
            'PRIMARY KEY (product,platform,language,environment));'].join('')
    },
*/

    //bundle file
    {
      do: 'create table bundle_category',
      cql: ['CREATE TABLE IF NOT EXISTS ', keyspace, '.bundle_category (',
          'project text,',
          'device text,',
          'market text,',
          'environment text,',
          'is_version_check text,',
          'last_update_time timestamp,',
          'on_service text,',
          'publish_time timestamp,',
          'version text,',
          'PRIMARY KEY (project,device,market,environment)',
          ');', ].join(''),
    },
    {
      do: 'create table bundle_file',
      cql: ['CREATE TABLE IF NOT EXISTS ', keyspace, '.bundle_file (',
          'project text,',
          'device text,',
          'market text,',
          'version text,',
          'comment_message text,',
          'environment text,',
          'file_content text,',
          'file_name text,',
          'file_type text,',
          'last_update_time timestamp,',
          'publish_time timestamp,',
          'PRIMARY KEY (project,device,market,version));', ].join(''),
    },

    //system setting
    {
      do: 'create table system_settings',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.system_settings (',
          '   key_code text,',
          '   type text,',
          '   created_time timestamp,',
          '   memo text,',
          '   update_time timestamp,',
          '   value text,',
          '   PRIMARY KEY (key_code,type)',
          ');', ].join(''),
    },

    //system account
    {
      do: 'create table system_account',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.system_account (',
          '   user_id text,',
          '   language text,',
          '   PRIMARY KEY (user_id, language)',
          ');', ].join(''),
    },
    {
      do: 'insert system_account fxmen001',
      cql: [
          'INSERT INTO ', keyspace, '.system_account (language, user_id) values (\'EN\', \'fxmen001\')',
          ].join(''),
    },
    {
      do: 'insert system_account fxmen002',
      cql: [
          'INSERT INTO ', keyspace, '.system_account (language, user_id) values (\'EN\', \'fxmen002\')',
      ].join(''),
    },

    {
      do: 'insert system_account fxmcn001',
      cql: [
          'INSERT INTO ', keyspace, '.system_account (language, user_id) values (\'CN\', \'fxmcn001\')',
      ].join(''),
    },
    {
      do: 'insert system_account fxmcn002',
      cql: [
          'INSERT INTO ', keyspace, '.system_account (language, user_id) values (\'CN\', \'fxmcn002\')',
      ].join(''),
    },
    {
      do: 'insert system_account fxmcn003',
      cql: [
          'INSERT INTO ', keyspace, '.system_account (language, user_id) values (\'CN\', \'fxmcn003\')',
      ].join(''),
    },

    {
      do: 'insert system_account fxmtw001',
      cql: [
          'INSERT INTO ', keyspace, '.system_account (language, user_id) values (\'TW\', \'fxmtw001\')',
      ].join(''),
    },
    {
      do: 'insert system_account fxmtw002',
      cql: [
          'INSERT INTO ', keyspace, '.system_account (language, user_id) values (\'TW\', \'fxmtw002\')',
      ].join(''),
    },
    {
      do: 'insert system_account fxmtw003',
      cql: [
          'INSERT INTO ', keyspace, '.system_account (language, user_id) values (\'TW\', \'fxmtw003\')',
      ].join(''),
    },
    /*
    {
        do: 'insert system_account',
        cql: [
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('EN', 'fxmen001');",
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('EN', 'fxmen002');",
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('EN', 'fxmen003');",
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('CN', 'fxmcn001');",
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('CN', 'fxmcn002');",
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('CN', 'fxmcn003');",
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('TW', 'fxmtw001');",
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('TW', 'fxmtw002');",
            "INSERT INTO ", keyspace, ".system_account (language, user_id) values ('TW', 'fxmtw003');"
        ].join('')
    },
    */

    //refferal code
    {
      do: 'create table user_referral',
      cql: ['create table if not exists ', keyspace, '.user_referral  (',
          'referral_code text,',
          'user_id text,',
          'referral_member set<text>,',
          'referral_by text,',
          'PRIMARY KEY (referral_code)',
          ');', ].join(''),
    },

    {
      do: 'create index on user_referral (user_id);',
      cql: 'create index IF NOT EXISTS on ' + keyspace + '.user_referral (user_id);',
    },
    {
      do: 'create index on user_referral (referral_by);',
      cql: 'create index IF NOT EXISTS on ' + keyspace + '.user_referral (referral_by);',
    },

    //user
    {
      do: 'create table user',
      cql: ['CREATE TABLE if not exists ', keyspace, '.user (',
          'user_id text,',
          'account_value float,',
          'app_server_region text,',
          'background_url text,',
          'biggest_loss float,',
          'biggest_win float,',
          'bio text,',
          'birthday timestamp,',
          'black_list_ranking text,',
          'bp text,',
          'cash float,',
          'country text,',
          'd1 float,',
          'd5 float,',
          'daily_pnl float,',
          'derby_id text,',
          'email text,',
          'firstname text,',
          'forget_password text,',
          'image_height text,',
          'image_width text,',
          'is_active text,',
          'is_blocked text,',
          'language text,',
          'last_update_time timestamp,',
          'lastname text,',
          'level int,',
          'location text,',
          'margin float,',
          'mtd float,',
          'num_trade text,',
          'object_id text,',
          'org text,',
          'ossbackground_url text,',
          'ossserving_url text,',
          'over_all_pnl_rate float,',
          'phone text,',
          'pnl float,',
          'position float,',
          'publish_time timestamp,',
          'qtd float,',
          'ranking float,',
          'ranking_per float,',
          'roll_price float,',
          'school_key text,',
          'school_name text,',
          'school_region text,',
          'serving_url text,',
          'sex text,',
          'total_pl float,',
          'unit_price float,',
          'ur_pnl float,',
          'username text,',
          'win_ratio float,',
          'ytd float,',
          'has_login text,',
          'PRIMARY KEY (user_id));', ].join(''),
    },
    {
      do: 'create index user (language)',
      cql: 'CREATE INDEX IF NOT EXISTS on  ' + keyspace + '.user (language);',
    },
    {
      do: 'create table by_user_count',
      cql: ['create table if not exists ', keyspace, '.by_user_count  (',
          'user_id text,',
          'follower_count counter,',
          'following_count counter,',
          'referral_count counter,',
          'group_count counter,',
          'PRIMARY KEY (user_id));', ].join(''),
    },

    //follow
    {
      do: 'create table following',
      cql: ['CREATE TABLE IF NOT EXISTS ', keyspace, '.following (',
          'follower_userid text,',
          'following_userid text,',
          'last_update_time timestamp,',
          'publish_time timestamp,',
          'type int,',
          'PRIMARY KEY (follower_userid,following_userid));', ].join(''),
    },

    //group
    {
      do: 'create table group',
      cql: ['CREATE TABLE if not exists ', keyspace, '.group (',
          'group_id uuid,',
          'background_url text,',
          'create_userid text,',
          'description text,',
          'gae_group_id text,',
          'image_height int,',
          'image_width int,',
          'last_update_time timestamp,',
          'name text,',
          'ossserving_url text,',
          'publish_time timestamp,',
          'serving_url text,',
          'type text,',
          'PRIMARY KEY (group_id));', ].join(''),
    },
    {
      do: 'create index group (gae_group_id)',
      cql: 'CREATE INDEX IF NOT EXISTS on  ' + keyspace + '.group (gae_group_id);',
    },
    {
      do: 'create table by_group_count',
      cql: ['create table if not exists ', keyspace, '.by_group_count(',
          'group_id uuid,',
          'member_user_count counter,',
          'invited_user_count counter,',
          'requested_user_count counter,',
          'primary key(group_id)',
          ');', ].join(''),
    },
    {
      do: 'create table group_member',
      cql: ['create table if not exists ', keyspace, '.group_member(',
          'group_id uuid,',
          'user_id text,',
          'publish_time timestamp,',
          'primary key(group_id,user_id));', ].join(''),

    },
    {
      do: 'create table group_invited',
      cql: ['create table if not exists ', keyspace, '.group_invited(',
          'group_id uuid,',
          'user_id text,',
          'publish_time timestamp,',
          'primary key(group_id,user_id));', ].join(''),

    },
    {
      do: 'create table group_requested',
      cql: ['create table if not exists ', keyspace, '.group_requested(',
          'group_id uuid,',
          'user_id text,',
          'publish_time timestamp,',
          'primary key(group_id,user_id));', ].join(''),
    },

    //school
    {
      do: 'create table school',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.school (',
          'school_key text, ',
          'name text, ',
          'cname text, ',
          'tname text, ',
          'display text, ',
          'domains set<text>, ',
          'group_id text, ',
          'is_del text, ',
          'flag_url text, ',
          'oss_flag_url text, ',
          'region text, ',
          'device_language text, ',
          'publish_time timestamp, ',
          'last_update_time timestamp, ',
          'PRIMARY KEY (school_key));',
      ].join(''),

    },

    {
      do: 'create index school (region)',
      cql: 'CREATE INDEX IF NOT EXISTS on  ' + keyspace + '.school (region);',
    },

    {
      do: 'create index school (device_language)',
      cql: 'CREATE INDEX IF NOT EXISTS on  ' + keyspace + '.school (device_language);',
    },

    {
      do: 'create index school (display)',
      cql: 'CREATE INDEX IF NOT EXISTS on  ' + keyspace + '.school (display);',
    },

    {
      do: 'create table by_school_count',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.by_school_count (',
          'school_key text, ',
          'user_count counter,',
          'PRIMARY KEY(school_key));',
      ].join(''),
    },

    //storage
    {
      do: 'create table storage',
      cql: [
          'create table if not exists ', keyspace, '.storage (',
          'storage_key text, ',
          'publish_time timestamp, ',
          'primary key(storage_key));',
      ].join(''),
    },

    //contest
    {
      do: 'create table contest',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.contest(',
          'contest_id text,',
          'name text,',
          'title text,',
          'icon_image text,',
          'description text,',
          'cn_name text,',
          'cn_title text,',
          'cn_icon_image text,',
          'cn_description text,',
          'tw_name text,',
          'tw_title text,',
          'tw_icon_image text,',
          'tw_description text,',
          'start_date_time timestamp,',
          'end_date_time timestamp,',
          'status text,',
          'region text,',
          'join_cond_free text,',
          'join_cond_school_key list<text>,',
          'join_cond_school_region list<text>,',
          'join_cond_user_country list<text>,',
          'join_cond_mail list<text>,',
          'reward_max_money float,',
          'reward_base_money float,',
          'reward_rise_money float,',
          'reward_coin_mark text,',
          'reward_coin_name text,',
          'reward_bonus_ratio list<int>,',
          'reward_stop_rise_date_time timestamp,',
          'reward_base_join_total int,',
          'user_join_sum int,',
          'current_money int,',
          'version text,',
          'reward_money_list text,',
          'reward_item_list text,',
          'reward_complex_list text,',
          'publish_time timestamp,',
          'last_update_time timestamp,',
          'PRIMARY KEY(contest_id))',
      ].join(''),
    },

    //social post
    {
      do: 'create table post',
      cql: ['create table if not exists ', keyspace, '.post(',
          'gae_post_id text,',
          'post_id timeuuid,',
          'group_id uuid,',
          'img_size text,',
          'img_url text,',
          'msg text,',
          'gae_parent_post_id text,',
          'parent_post_id timeuuid,',
          'parent_user_id text,',
          'status text,',
          'tag text,',
          'user_id text,',
          'user_img text,',
          'username text,',
          'mention_user_id set<text>,',
          'mention_cur set<text>,',
          'publish_time timestamp,',
          'last_update_time timestamp,',
          'primary key(post_id) ',
          ');', ].join(''),
    },
    {
      do: 'create index post (user_id)',
      cql: ['create index if not exists on ', keyspace, '.post (user_id);'].join(''),
    },
    {
      do: 'create index gae_post_id in post',
      cql: ['CREATE INDEX IF NOT EXISTS ON ' + keyspace + '.post (gae_post_id);'].join(''),
    },
    {
      do: 'create index post(parent_post_id)',
      cql: ['create index if not exists on ', keyspace, '.post (parent_post_id);'].join(''),
    },
    {
      do: 'create index post(gae_parent_post_id)',
      cql: ['create index if not exists on ', keyspace, '.post (gae_parent_post_id);'].join(''),
    },
    {
      do: 'create table post_user_wall',
      cql: ['create table if not exists ', keyspace, '.post_user_wall(',
          'user_id text,',
          'post_id timeuuid,',
          'primary key(user_id, post_id)',
          ')with clustering order by (post_id desc);', ].join(''),
    },
    {
      do: 'create index post_id on post_user_wall',
      cql: ['CREATE INDEX IF NOT EXISTS ON ' + keyspace + '.post_user_wall (post_id);'].join(''),
    },
    {
      do: 'create table post_user_feed',
      cql: ['create table if not exists ', keyspace, '.post_user_feed(',
          'user_id text,',
          'post_id timeuuid,',
          'primary key(user_id, post_id)',
          ')with clustering order by (post_id desc);', ].join(''),
    },
    {
      do: 'create index post_id on post_user_feed',
      cql: ['CREATE INDEX IF NOT EXISTS ON ' + keyspace + '.post_user_feed (post_id);'].join(''),
    },
    {
      do: 'create table post_group',
      cql: ['create table if not exists ', keyspace, '.post_group(',
          'group_id uuid,',
          'post_id timeuuid,',
          'primary key (group_id, post_id)',
          ')with clustering order by (post_id desc);', ].join(''),
    },
    {
      do: 'create index post_id on post_group',
      cql: ['CREATE INDEX IF NOT EXISTS ON ' + keyspace + '.post_group (post_id);'].join(''),
    },
    {
      do: 'create table post_symbol',
      cql: ['create table if not exists ', keyspace, '.post_symbol(',
          'symbol text,',
          'post_id timeuuid,',
          'primary key(symbol, post_id)',
          ')with clustering order by (post_id desc);', ].join(''),
    },
    {
      do: 'create index post_id on post_symbol',
      cql: ['CREATE INDEX IF NOT EXISTS ON ' + keyspace + '.post_symbol (post_id)'].join(''),
    },
    {
      do: 'create table post_rel_users',
      cql: ['create table if not exists ', keyspace, '.post_rel_users(',
          'post_id timeuuid,',
          'kind text,',
          'user_id text,',
          'primary key(post_id,kind,user_id));', ].join(''),
    },
    {
      do: 'create table by_post_count',
      cql: ['create table if not exists ', keyspace, '.by_post_count(',
          'post_id timeuuid,',
          'like_count counter,',
          'repost_count counter,',
          'comment_count counter,',
          'share_count counter,',
          'abusive_count counter,',
          'dislike_count counter,',
          'harmful_count counter,',
          'spam_count counter,',
          'primary key(post_id));', ].join(''),
    },
    {
      do: 'create table post_comment',
      cql: ['create table if not exists ', keyspace, '.post_comment(',
          'post_id timeuuid,',
          'comment_id uuid,',
          'comment text,',
          'gae_post_id text,',
          'gae_comment_id text,',
          'reply_user_id text,',
          'user_id text,',
          'mention_user_id set<text>,',
          'mention_cur set<text>,',
          'last_update_time timestamp,',
          'publish_time timestamp,',
          'primary key(post_id,publish_time,comment_id)',
          ');', ].join(''),
    },
    {
      do: 'create index comment_id on post_comment',
      cql: ['CREATE INDEX IF NOT EXISTS ON ' + keyspace + '.post_comment(comment_id);'].join(''),
    },
    {
      do: 'create index user_id on post_comment',
      cql: ['CREATE INDEX IF NOT EXISTS ON ' + keyspace + '.post_comment(user_id)'].join(''),
    },
    {
      do: 'create index gae_comment_id on post_comment',
      cql: ['CREATE INDEX IF NOT EXISTS ON ' + keyspace + '.post_comment(gae_comment_id);'].join(''),
    },
    {
      do: 'create table comment_rel_users',
      cql: ['create table if not exists ', keyspace, '.comment_rel_users(',
          'comment_id uuid,',
          'kind text,',
          'user_id text,',
          'primary key(comment_id,kind,user_id));', ].join(''),
    },
    {
      do: 'create table by_comment_count',
      cql: ['create table if not exists ', keyspace, '.by_comment_count(',
          'comment_id uuid,',
          'like_count counter,',
          'primary key(comment_id));', ].join(''),
    },
    {
      do: 'create table school_ranking',
      cql: ['create table if not exists ', keyspace, '.school_ranking(',
          'kind text,',
          'school_key text,',
          'pnl float,',
          'user_id text,',
          'trade_date text,',
          'primary key(kind,school_key,pnl,user_id)',
          ')WITH CLUSTERING ORDER BY (school_key DESC,pnl DESC, user_id DESC);', ].join(''),
    },
    {
      do: 'create table group_ranking',
      cql: ['create table if not exists ', keyspace, '.group_ranking(',
          'kind text,',
          'group_id text,',
          'pnl float,',
          'user_id text,',
          'trade_date text,',
          'primary key(kind,group_id,pnl,user_id)',
          ')WITH CLUSTERING ORDER BY (group_id DESC,pnl DESC, user_id DESC);', ].join(''),
    },
    {
      do: 'create table inbox_msg',
      cql: ['create table if not exists ', keyspace, '.inbox_msg(',
          'inbox_id text,',
          'user_id text,',
          'publish_time timestamp,',
          'action text,',
          'comment text,',
          'comment_id text,',
          'contest_id text,',
          'country text,',
          'currency text,',
          'from_user_id text,',
          'group_id uuid,',
          'group_name text,',
          'hasread text,',
          'htmlmsg text,',
          'lastupdatetime timestamp,',
          'newstime text,',
          'post_id timeuuid,',
          'primary key(user_id, publish_time, inbox_id)',
          ')WITH CLUSTERING ORDER BY (publish_time DESC);', ].join(''),
    },
    {
      do: 'create index inbox_msg inbox_id',
      cql: ['create index if not exists on ', keyspace, '.inbox_msg (inbox_id);'].join(''),
    },
    {
      do: 'create index inbox_msg group_id',
      cql: ['create index if not exists on ', keyspace, '.inbox_msg (group_id);'].join(''),
    },
    {
      do: 'create index inbox_msg post_id',
      cql: ['create index if not exists on ', keyspace, '.inbox_msg (post_id);'].join(''),
    },
    {
      do: 'create contest_join_log table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.contest_join_log(',
          'join_log_id uuid,',
          'contest_id text,',
          'contest_user_total int,',
          'contest_version text,',
          'contest_amount int,',
          'PRIMARY KEY(join_log_id))',
      ].join(''),
    },

    {
      do: 'create by_contest_count table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.by_contest_count(',
          'contest_id text,',
          'user_join_count counter,',
          'PRIMARY KEY(contest_id))',
      ].join(''),
    },

    {
      do: 'create group index',
      cql: ['create index if not exists on ', keyspace, '.group (type);'].join(''),
    },

    {
      do: 'create group index',
      cql: ['create index if not exists on ', keyspace, '.group (name);'].join(''),
    },

    {
      do: 'create school index',
      cql: ['create index if not exists on ', keyspace, '.school (region);'].join(''),
    },

    {
      do: 'create symbol_vote_user table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.symbol_vote_user(',
          'symbol text,',
          'user_id text,',
          'vote text,',
          'PRIMARY KEY(symbol, user_id))',
      ].join(''),
    },
    {
      do: 'create symbol_vote_count table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.symbol_vote_count(',
          'symbol text,',
          'bullish counter,',
          'bearish counter,',
          'PRIMARY KEY(symbol))',
      ].join(''),
    },

    {
      do: 'create temp_user_feeds table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.temp_user_feeds(',
          'id text,',
          'object_id text,',
          'object_type text,',
          'user_id text,',
          'publish_time timestamp,',
          'PRIMARY KEY(id))',
      ].join(''),
    },
    {
      do: 'create user index',
      cql: ['create index if not exists on ', keyspace, '.user (school_key);'].join(''),
    },
    {
      do: 'create user index',
      cql: ['create index if not exists on ', keyspace, '.user (forget_password);'].join(''),
    },
    {
      do: 'create deep_link table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.deep_link(',
          'link text,',
          'ios_path text,',
          'android_path text,',
          'publish_time timestamp,',
          'last_update_time timestamp,',
          'PRIMARY KEY(link))',
      ].join(''),
    },
    {
      do: 'create deep_link_count table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.deep_link_count(',
          'count counter,',
          'link text,',
          'PRIMARY KEY (link))',
      ].join(''),
    },
    {
      do: 'create banner table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.banner(',
          'banner_id uuid,',
          'market text,',
          'language text,',
          'ios_link text,',
          'android_link text,',
          'display boolean,',
          'display_until timestamp,',
          'ordering int,',
          'serving_url text,',
          'publish_time timestamp,',
          'last_update_time timestamp,',
          'PRIMARY KEY (banner_id))',
      ].join(''),
    },
    {
      do: 'create banner index',
      cql: ['create index if not exists on ', keyspace, '.banner (market);'].join(''),
    },
    {
      do: 'create banner index',
      cql: ['create index if not exists on ', keyspace, '.banner (language);'].join(''),
    },
    {
      do: 'create banner index',
      cql: ['create index if not exists on ', keyspace, '.banner (display);'].join(''),
    },
    {
      do: 'create coin_transaction table',
      cql: [
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.coin_transaction(',
          'user_id text,',
          'tx_id text,',
          'market text,',
          'feature int,',
          'coins_before int,',
          'coins_change int,',
          'coins_after int,',
          'date_start timestamp,',
          'date_end timestamp,',
          'added_cash double,',
          'used_fuel int,',
          'client_id text,',
          'ip text,',
          'publish_time timestamp,',
          'PRIMARY KEY(user_id, tx_id)',
          ')',
      ].join(''),
    },
    {
      do: 'create coin_transaction index',
      cql: ['create index if not exists on ', keyspace, '.coin_transaction (market)'].join(''),
    },
    {
      do: 'create post_comment_feed table',
      cql:[
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.post_comment_feed(',
          'enable int,',
          'publish_time timestamp,',
          'post_id timeuuid,',
          'comment_id uuid,',
          'is_self_post_reply text,',
          'user_id text,',
          'PRIMARY KEY (enable, publish_time, post_id, comment_id)',
          ') WITH CLUSTERING ORDER BY (publish_time DESC, post_id DESC, comment_id ASC)',
      ].join(''),
    },
    {
      do: 'create post_comment_feed index',
      cql: ['create index if not exists on ', keyspace, '.post_comment_feed (post_id)'].join(''),
    },
    {
      do: 'create post_comment_feed index',
      cql: ['create index if not exists on ', keyspace, '.post_comment_feed (comment_id)'].join(''),
    },
    {
      do: 'create post_comment_feed index',
      cql: ['create index if not exists on ', keyspace, '.post_comment_feed (is_self_post_reply)'].join(''),
    },
    {
      do: 'create post_comment_feed index',
      cql: ['create index if not exists on ', keyspace, '.post_comment_feed (user_id)'].join(''),
    },
    {
      do: 'create post_feed table',
      cql:[
          'CREATE TABLE IF NOT EXISTS ', keyspace, '.post_feed(',
          'enable int,',
          'publish_time timestamp,',
          'post_id timeuuid,',
          'user_id text,',
          'PRIMARY KEY (enable, publish_time, post_id)',
          ') WITH CLUSTERING ORDER BY (publish_time DESC, post_id DESC)',
      ].join(''),
    },
    {
      do: 'create post_feed index',
      cql: ['create index if not exists on ', keyspace, '.post_feed (post_id)'].join(''),
    },
    {
      do: 'create post_feed index',
      cql: ['create index if not exists on ', keyspace, '.post_feed (user_id)'].join(''),
    },
    {
      do: 'extend column to post ',
      cql: ['ALTER TABLE ', keyspace, '.post ADD mention_symbols list<text>'].join(''),
    },
    {
      do: 'extend column to comment',
      cql: ['ALTER TABLE ', keyspace, '.post_comment ADD mention_symbols list<text>'].join(''),
    },
    {
      do: 'extend column to post ',
      cql: ['ALTER TABLE ', keyspace, '.post ADD mention_cur_l list<text>'].join(''),
    },
    {
      do: 'extend column to comment',
      cql: ['ALTER TABLE ', keyspace, '.post_comment ADD mention_cur_l list<text>'].join(''),
    },
];

module.exports = cqlScript;
