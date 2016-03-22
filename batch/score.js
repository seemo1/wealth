'use strict';

var Config = require('config');
var request = require('request');
var Moment = require('moment');
var colors = require('colors');
var Lodash = require('lodash');
var format = require('string-format');
var _ = require('lodash');
var Async = require('async');
var logger = require('../utils/logger');
var mysqlCentralConnect = require('../utils/ltscentralmysql-client.js');
var mysqlGlobalConnect = require('../utils/ltsglobalmysql-client.js');
var mysqlCenterModel = require('../commonlib/mysql-center-common');
var mysqlGlobalModel = require('../commonlib/mysql-global-common');
var scorer = {};

global.Promise = require('bluebird');
global.mysqlCentralPool = {};
global.mysqlCentralClient = {};
global.mysqlPool = {};
global.mysqlClient = {};

Promise.all([
    mysqlCentralConnect.initial(),
    mysqlGlobalConnect.initial()
]).then(function (conn) {
    global.mysqlCentralPool = global.mysqlCentralClient = conn[0];
    console.info('MySQL(Central) is ready'.green);

    global.mysqlPool = global.mysqlClient = conn[1];
    console.info('MySQL(Global) is ready'.green);
}).catch(function (e) {
    console.error(e);
});

var SCORE_API = 'http://{0}/getContestScore?contest_id={1}&app_id={2}&trade_date={3}&key={4}&region={5}';
var DEFAULT_DELAY = 5 * 60 * 1000; // 5 分钟
var LAST_DELAY = 30 * 60 * 1000; // 30 分钟
var DEFAULTNIL = [];

scorer.startJob = function (_tradeDate, _contestId) {
    logger.info('Job start at ' + Moment().format('YYYY-MM-DD HH:mm:ss.SSS'));

    var forceManual = _tradeDate ? true : false; // 是否强制手工更新
    var ll; // 要更新的比赛列表长度
    var ii = 0; //记录处理的比赛数

    Async.waterfall([
        function (next) {
            // 记录cronjob启动
            scorer.recordJobStart().then(function(res) {
                global.recordId = res.insertId;
                next(null);
            });
        },

        function (next) {
            scorer.getContestTradeDate(_tradeDate).then(function (tradeDates) {
                next(null, tradeDates);
            });
        },

        function (tradeDates, next) {
            scorer.getContestList(_contestId).then(function (contestList) {
                next(null, tradeDates, contestList);
            });
        },

        function (tradeDates, contestList, next) {
            ll = contestList.length;
            if (ll == 0) {
                logger.info('There is no contest in progress...');
                next(null);
            }

            var tradeDateTod = tradeDates.tradeDateTod;
            var tradeDateYes = tradeDates.tradeDateYes;
            var publishTime = Moment().utc().format('YYYY-MM-DD HH:mm:ss'); // GMT+0
            contestList.forEach(function (contest) {
                var contestId = contest.contest_id;
                var contestLossPointRoi = contest.loss_point;
                logger.info('Begin deal contest ' + contestId + ' at ' + Moment().format('YYYY-MM-DD HH:mm:ss.SSS'));

                Async.waterfall([
                    function (next) {
                        if (forceManual) {
                            next(null);
                        } else {
                            scorer.isContestTradeDateHasData(contestId, tradeDateTod).then(function (hasData) {
                                if (hasData) {
                                    logger.info('Contest ' + contestId + ' already has user performance data...');
                                    next(true);
                                } else {
                                    next(null);
                                }
                            });
                        }
                    },

                    function (next) {
                        // 获取该比赛前一天的数据
                        scorer.getContestYestoday(contestId, tradeDateYes).then(function (contestUserList) {
                            var s, contestRankingY = {}, contestScoreSumY = {}, contestCompareScaleY = {};
                            if (contestUserList && (s = contestUserList.length) > 0) {
                                for (var i = 0; i < s; i++) {
                                    var userId = contestUserList[i].user_id;
                                    var ranking = contestUserList[i].ranking;
                                    var scoreSum = contestUserList[i].score_sum;
                                    var compareScale = contestUserList[i].compare_scale;
                                    contestRankingY[userId] = ranking;
                                    contestScoreSumY[userId] = scoreSum;
                                    contestCompareScaleY[userId] = compareScale;
                                }
                            }

                            logger.info(format('Step getContestYestoday of contest {0} ... ', contestId));
                            next(null, contestRankingY, contestScoreSumY, contestCompareScaleY);
                        });
                    },

                    function (contestRankingY, contestScoreSumY, contestCompareScaleY, next) {

                        var forTest = Config.get('Domain').indexOf('test.') != -1 ? '&test=true' : '';
                        var api = format(SCORE_API + forTest, Config.get('ScoreJob.apiIp'), contestId, Config.get('ScoreJob.appId'), tradeDateTod, Config.get('ScoreJob.apiKey'), Config.get('ScoreJob.region'));

                        // 接口获取数据
                        scorer.getScoreData(api, 0, 0, function (data) {
                            var l;
                            if (data && (l = data.length) > 0) {
                                // 根据fdt score排名
                                // data = _.sortByOrder(data, ['fdt.score'], ['desc']); // api sort it
                                // 处理数据写入
                                var preScore = 0, preRanking = 0;
                                var rankingScore = []; // 用于计算compareScale
                                var userLossList = []; // 淘汰用户列表
                                var userPerformanceList = [];
                                var userPerformance;
                                for (var i = 0; i < l; i++) {
                                    var ranking = i + 1;
                                    var userId = data[i].user_id;
                                    var scoreSum = data[i].fdt.score.toFixed(2);
                                    var profitability = data[i].profitability.score;
                                    var activity = data[i].activity.score;
                                    var consistency = data[i].consistency.score;
                                    var riskControl = data[i].riskCtrl.score;
                                    var roi = data[i].roi;

                                    // 分数一样, 排名一样
                                    if (i > 0 && preScore == scoreSum) {
                                        ranking = preRanking;
                                    } else {
                                        rankingScore.push({ranking: ranking, score_sum: scoreSum});
                                    }

                                    preScore = scoreSum;

                                    preRanking = ranking;

                                    // 淘汰机制, 亏损超过指定的N%即失去比赛资格, 设置空值代表不限制
                                    if (contestLossPointRoi && (roi < 0 && (Math.abs(roi) > Number(contestLossPointRoi)))) {
                                        userLossList.push({contestId: contestId, userId: userId});
                                    }

                                    // 组装数据用于mysql replace into
                                    userPerformance = {};
                                    userPerformance.contest_id = contestId;
                                    userPerformance.user_id = userId;
                                    userPerformance.ranking_date = tradeDateTod;

                                    // ranking 及跟昨天比变化
                                    userPerformance.ranking = ranking;
                                    var rankingY = contestRankingY[userId];
                                    var rankingUpgrade = scorer.compareYDataVal(ranking, rankingY);
                                    var rankingUpgradeStatus = scorer.compareYDataStatus(rankingUpgrade, true);
                                    userPerformance.ranking_upgrade_status = rankingUpgradeStatus;
                                    userPerformance.ranking_upgrade = rankingUpgrade;

                                    // score_sum 及跟昨天比变化
                                    userPerformance.score_sum = scoreSum;
                                    var scoreSumY = contestScoreSumY[userId];
                                    var scoreSumUpgrade = scorer.compareYDataVal(scoreSum, scoreSumY);
                                    var scoreSumUpgradeStatus = scorer.compareYDataStatus(scoreSumUpgrade, false);
                                    userPerformance.score_sum_upgrade_status = scoreSumUpgradeStatus;
                                    userPerformance.score_sum_upgrade = -scoreSumUpgrade; // 按文档要求, 此处复用方法, 故取反
                                    // compare_scale 及跟昨天比变化
                                    var compareScale = (l - ranking + 1) / l;
                                    userPerformance.competition_compare_scale = compareScale;
                                    var compareScaleY = contestCompareScaleY[userId];
                                    var compareScaleUpgrade = scorer.compareYDataVal(compareScale, compareScaleY);
                                    var compareScaleUpgradeStatus = scorer.compareYDataStatus(compareScaleUpgrade, false);
                                    userPerformance.competition_compare_scale_upgrade_status = compareScaleUpgradeStatus;

                                    // fdt score 相关
                                    userPerformance.profitability = profitability;
                                    userPerformance.activity = activity;
                                    userPerformance.consistency = consistency;
                                    userPerformance.risk_control = riskControl;
                                    userPerformance.roi = roi;
                                    userPerformance.publish_time = publishTime;
                                    userPerformanceList.push(userPerformance);

                                    //logger.info(format('{0} -> {1}. {2} {3} {4} {5} {6} {7} {8}',
                                    //    tradeDate, ranking, userId, scoreSum, profitability, activity, consistency, riskControl, publishTime));
                                }

                                logger.info(format('Step getScoreData of contest {0} ... ', contestId));
                                next(null, userPerformanceList, userLossList);
                            } else {
                                // 记录告知日期、比赛id对应的数据未能从api获取
                                logger.info('no data from api -> tradeDate: ' + tradeDateTod + ', contestId: ' + contestId);
                                next(null, [], []);
                            }
                        });
                    },

                    function(userPerformanceList, userLossList, next) {
                        var p1 = scorer.saveContestUserPerformance(userPerformanceList)
                        var p2 = scorer.saveContestUserIdentity(userLossList);
                        Promise.all([p1, p2]).then(function() {
                            logger.info('End deal contest ' + contestId + ' at ' + Moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
                            next(null);
                        });
                    }
                ], function () {
                    ii++;
                    next();
                });
            });
        },
        function () {
            if(ii == ll) { // flag to record to DB
                scorer.recordJobEnd().then(function() {
                    logger.info('Completely execute, record it to DB! At ' + Moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
                    process.exit(1);
                });
            }
        }
    ]);
};

/**
 * 批量保存比赛用户表现数据到DB
 *
 * @param userPerformanceList
 * @param rankingCompareScale
 * @param contestCompareScaleY
 */
scorer.saveContestUserPerformance = function (userPerformanceList) {
    var sql = scorer.buildContestUserPerformanceSql(userPerformanceList);
    if (!sql) {
        return;
    }

    mysqlCenterModel.insert('Job-saveContestUserPerformance', sql, [], function (err, res) {
        if (err) {
            logger.error(err);
        }
    });
};

scorer.buildContestUserPerformanceSql = function (userPerformanceList) {
    var l = userPerformanceList.length;
    if (l == 0) {
        return '';
    }

    var sql = 'replace into contest_social_join_user_performance' +
        '(contest_id, user_id, ranking_date, ranking, ranking_upgrade_status, ranking_upgrade,' +
        'score_sum, score_sum_upgrade_status, score_sum_upgrade, competition_compare_scale, competition_compare_scale_upgrade_status,' +
        'profitability, activity, consistency, risk_control, roi, publish_time) values';
    for (var i = 0; i < l; i++) {
        var userPerformance = userPerformanceList[i];
        var contestId = userPerformance.contest_id;
        var userId = userPerformance.user_id;
        var rankingDate = userPerformance.ranking_date;
        var ranking = userPerformance.ranking;
        var rankingUpgradeStatus = userPerformance.ranking_upgrade_status;
        var rankingUpgrade = userPerformance.ranking_upgrade;
        var scoreSum = userPerformance.score_sum;
        var scoreSumUpgradeStatus = userPerformance.score_sum_upgrade_status;
        var scoreSumUpgrade = userPerformance.score_sum_upgrade;
        var competitionCompareScale = userPerformance.competition_compare_scale;
        var competitionCompareScaleUpgradeStatus = userPerformance.competition_compare_scale_upgrade_status;
        var profitability = userPerformance.profitability;
        var activity = userPerformance.activity;
        var consistency = userPerformance.consistency;
        var riskControl = userPerformance.risk_control;
        var roi = userPerformance.roi;
        var publishTime = userPerformance.publish_time;
        sql += format('(\'{0}\',\'{1}\',\'{2}\',{3},\'{4}\',{5},{6},\'{7}\',{8},{9},\'{10}\',{11},{12},{13},{14},{15},\'{16}\'){17}',
            contestId, userId, rankingDate, ranking, rankingUpgradeStatus, rankingUpgrade,
            scoreSum, scoreSumUpgradeStatus, scoreSumUpgrade, competitionCompareScale, competitionCompareScaleUpgradeStatus,
            profitability, activity, consistency, riskControl, roi, publishTime, i == (l - 1) ? '' : ',');
    }

    return sql;
};

/**
 * 批量更新比赛用户身份
 *
 * @param userLossList
 */
scorer.saveContestUserIdentity = function (userLossList) {
    var sql = scorer.buildContestUserIdentitySql(userLossList);
    if (!sql) {
        return;
    }

    mysqlCenterModel.insert('Job-saveContestUserIdentity', sql, [], function (err, res) {
        if (err) {
            logger.error(err);
        }
    });
};

scorer.buildContestUserIdentitySql = function (userLossList) {
    var l = userLossList.length;
    if (l == 0) {
        return '';
    }

    var identity = 2;
    var sql = 'insert into contest_social_join_user(contest_id, user_id, identity) values';
    for (var i = 0; i < l; i++) {
        var userLoss = userLossList[i];
        var contestId = userLoss.contestId;
        var userId = userLoss.userId;
        sql += format('(\'{0}\',\'{1}\',{2}){3}', contestId, userId, identity, i == (l - 1) ? '' : ',');
    }

    sql += format(' on duplicate key update identity = {0}', identity);
    return sql;
};

/**
 * 获取比赛前一天的数据以进行对比
 *
 * @param contestId
 * @param rankingDate
 */
scorer.getContestYestoday = function (contestId, rankingDate) {
    return new Promise(function (resolve, reject) {
        var sql = 'select user_id, ranking, score_sum, competition_compare_scale as compare_scale from contest_social_join_user_performance where contest_id = ? and ranking_date = ?';
        mysqlCenterModel.select('Job-getContestYestoday', sql, [contestId, rankingDate], function (err, res) {
            if (err) {
                return reject(err);
            }

            resolve(res);
        });
    });
};

/**
 * 获取并判断交易日下比赛是否已经转档
 *
 * @param contestId
 * @param tradeDateTod
 */
scorer.isContestTradeDateHasData = function (contestId, tradeDateTod) {
    return new Promise(function (resolve, reject) {
        var sql = 'select count(*) as count from contest_social_join_user_performance where contest_id = ? and ranking_date = ?';
        mysqlCenterModel.select('Job-isContestTradeDateHasData', sql, [contestId, tradeDateTod], function (err, res) {
            if (err) {
                return reject(err);
            }

            resolve(res[0].count > 0);
        });
    });
};

/**
 * 获取交易日期
 *
 * @param tradeDate
 */
scorer.getContestTradeDate = function (tradeDate) {
    return new Promise(function (resolve, reject) {
        var sql = 'select * from TRADE_DATE order by date desc limit 2';
        if (tradeDate) {
            sql = 'select * from TRADE_DATE where date <= ? order by date desc limit 2';
        }

        mysqlCenterModel.select('Job-getContestTradeDate', sql, tradeDate ? [tradeDate] : [], function (err, res) {
            if (err) {
                return reject(err);
            }

            var tradeDates = {};
            if (res && res.length > 0) {
                tradeDates.tradeDateTod = Moment(res[0].DATE).format('YYYY-MM-DD');
                tradeDates.tradeDateYes = Moment(res[1].DATE).format('YYYY-MM-DD');
            }

            resolve(tradeDates);
        });
    });
};

/**
 * 获取正在进行中的比赛信息列表
 */
scorer.getContestList = function (contestId) {
    return new Promise(function (resolve, reject) {
        var sql = 'select contest_id, ongoing_setting_stop_loss_point as loss_point, start_date_time as st_time, end_date_time as ed_time, progress_status as status from contest_social_center ';
        if (contestId) {
            sql += ' where contest_id = ? ';
            mysqlCenterModel.select('Job-getContestList-appointed', sql, [contestId], function (err, res) {
                if (err) {
                    return reject(err);
                }

                resolve(res);
            });
        } else {
            var now = Moment().utc().format('YYYY-MM-DD HH:mm:ss'); // GMT+0
            sql += ' where start_date_time <= ? and end_date_time >= ? and is_new = \'Y\' and progress_status = \'G\'';
            mysqlCenterModel.select('Job-getContestList', sql, [now, now], function (err, res) {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        }
    });
};

/**
 * 请求大数据api获取比赛score的json数据, 针对未取到数据的情况, 尝试delay一定的时间后再获取5次
 *
 * @param api
 * @param count
 * @param delay
 * @param callback
 */
scorer.getScoreData = function (api, count, delay, callback) {
    setTimeout(function () {
        request(api, function (error, response, body) {
            var data;
            if (!error && response.statusCode == 200) {
                try {
                    data = JSON.parse(body);
                } catch (err) {
                    data = DEFAULTNIL;
                }
            } else {
                data = DEFAULTNIL;
            }

            if (data && data.length > 0) {
                callback(data);
            } else {
                if (count < 5) {
                    delay = count < 2 ? DEFAULT_DELAY : LAST_DELAY;
                    logger.info(('request again... ' + (count + 1) + ' at ' + Moment(Moment.utc().toDate()).format('YYYY-MM-DD HH:mm:ss.SSS')).red);

                    count++;
                    scorer.getScoreData(api, count, delay, callback);
                } else {
                    callback(DEFAULTNIL);
                }
            }
        });
    }, delay);
};

scorer.compareYDataVal = function (currentData, yestodayData) {
    if (!yestodayData) {
        return 0;
    }

    var val = yestodayData - currentData;
    return val;
};

scorer.compareYDataStatus = function (compareVal, isRank) {
    var status;
    if (compareVal == 0) {
        status = 'same';
    } else {
        if (compareVal < 0) {
            status = isRank ? 'down' : 'up';
        } else {
            status = isRank ? 'up' : 'down';
        }
    }

    return status;
};

scorer.recordJobStart = function() {
    return new Promise(function (resolve, reject) {
        var sql = 'insert into cronjob_log(name, date, market, start_time) values(?, ?, ?, now())';
        mysqlGlobalModel.insert('Job-recordJob-start', sql, ['scoreTransfer', Moment().format('YYYY-MM-DD'), Config.get('ScoreJob.appId').toUpperCase()], function (err, res) {
            if (err) {
                logger.error(err);
            }
            resolve(res);
        });
    });
};

scorer.recordJobEnd = function() {
    return new Promise(function (resolve, reject) {
        var sql = 'update cronjob_log set end_time = now() where id = ?';
        mysqlGlobalModel.update('Job-recordJob-end', sql, [global.recordId], function (err, res) {
            if (err) {
                logger.error(err);
            }
            resolve();
        });
    });
};

/**
 *  Job执行入口
 *  '2016-01-29', '20151201171643me'
 */
var args = process.argv.slice(2);
var exTradeDate, exContestId;
if (args.length > 0) {
    exTradeDate = args[0];
    exContestId = args[1];
    if (exTradeDate && exContestId) {
        scorer.startJob(exTradeDate, exContestId);
    } else if (exTradeDate && !exContestId) {
        scorer.startJob(exTradeDate);
    }
} else {
    scorer.startJob();
}