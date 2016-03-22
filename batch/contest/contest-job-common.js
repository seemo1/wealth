'use strict';
if ( typeof( global.Promise ) == 'undefined' ){
	global.Promise = require('bluebird');
}
var contestModel = require('../../modules/contest-module/v3/contest-model-v3');
var contestCommon = require('../../modules/contest-module/v3/contest-logic/contest-common-logic');
var contestCronJob = require('./contest-job-center');
var oldContest = require('../../modules/contest-module/v3/contest-integration-controller-v3');
var contestCronJobCommon = {
	/**
	 * << 分析比賽的狀態,並決定其排程的時間 >>
	 * @param databaseName : contest 的 table schema 名稱
	 */
	setContestStatusFactory : function (databaseName){
		return new Promise(function(resolve,reject){
			oldContest.integration.syncAll(databaseName) /* 先進行同步作業 */
				.then(function(syncResponse){
					console.log('舊版同步完畢！');
					//console.log(syncResponse);
					return contestModel.select.effectiveContestList(databaseName)
				})
				.then(function (contestList) {
					if (contestList.error) {
						return new Promise.reject(contestList.error);
					}
					var obj = contestList.result;
					if (obj.length == 0) {
						console.log(('>> 提醒：' + databaseName + ' 無比賽資料可以處理').green);
						resolve('done,but no data');
					}
					var currentDateTime = contestCommon.getDateTime('UTC');
					var setCronJobList = [];
					var contestNewStatus = '';

					for (var i = 0; i < obj.length; i++) { /* 僅有 R , G 狀態會進來 */
						console.log( obj[i].progress_status + ' : ' + obj[i].contest_id );
						if (obj[i].end_date_time < obj[i].start_date_time) { /* 結束時間 小於 開始時間,有問題！ */
							contestNewStatus = 'C';
						}else{
							if ( currentDateTime > obj[i].start_date_time ) {
								if (obj[i].end_date_time == obj[i].start_date_time) { /* 結束時間 跟 開始時間相同  */
									contestNewStatus = 'P';
									contestNewStatus = checkLeastJoinCond( (obj[i]) , contestNewStatus );
								} else { /* 結束時間 小於 開始時間 */
									if (currentDateTime >= obj[i].start_date_time) { /* 狀態應該要變成進行中 */
										if (currentDateTime >= obj[i].end_date_time) { /* 已結束 */
											contestNewStatus = 'P';
										} else {
											contestNewStatus = 'G';
										}
										contestNewStatus = checkLeastJoinCond( (obj[i]) , contestNewStatus );
									} else {
										contestNewStatus = 'R';
									}
								}
							} else { /* 比賽開始時間還沒到,就是準備中 */
								contestNewStatus = 'R' ;
							}
						}
						console.log( obj[i].contest_id + ' ' + contestNewStatus );
						setCronJobList.push( contestCronJob.set( databaseName , (obj[i].contest_id) , contestNewStatus ) );
					}
					return new Promise.resolve(setCronJobList);
				})
				.then(function(taskList){
					Promise.all(taskList)
						.then(function(res){
							resolve(res);
						})
				});
		});

	},
	/**
	 * << 初始化資料庫連線 >>
	 */
	setDataBaseConnection : function (){
		return new Promise(function (resolve, reject) {
			/* 連線防呆設置 */
			if (typeof(global.mysqlClient) == 'undefined') {
				global.mysqlClient = {};
				global.mysqlPool = {};
				var mysqlConnect = require('../../utils/ltsglobalmysql-client.js');
				return mysqlConnect.initial(1)
					.then(function (conn) {
						/* 連線物件初始化完成 */
						if (_.size(conn == 0)) {
							reject('MySQL connection fail');
						} else {
							global.mysqlClient = conn;
							resolve();
						}
					})
					.catch(function (error) {
						reject(error);
					})
			} else {
				resolve();
			}
		})
	},
};
function checkLeastJoinCond (contest,newStatus){
	var status = newStatus ;
	if ( contest.upcoming_setting_activation_user_total != '' ) {
		if (parseInt(contest.apply_user_total) < parseInt(contest.upcoming_setting_activation_user_total)) {
			status = 'C';
		}
	}
	return status;
}

module.exports = contestCronJobCommon ;
