'use strict';
var contestJobCenter = {};
var contestBankEndModel = require('../../modules/backend-module/contest/contest-model');
/**
 * << 接收到來自於 contest-job-push.js 的比賽資訊 >>
 * @param databaseName : contest 的 table schema 名稱
 * @param contestId : 比賽ID
 * @param newStatus : 新的比賽狀態
 */
contestJobCenter.set = function (databaseName,contestId,newStatus){
	var coreTableFullName = databaseName + '.' + 'contest_social_center';
	return contestBankEndModel.update.publishContest(contestId, newStatus, coreTableFullName);
};
module.exports = contestJobCenter ;
