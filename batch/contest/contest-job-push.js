'use strict';
var fs = require('fs'); // 檔案模組
var path = require('path'); // 路徑模組
var Moment = require('moment'); // 日期模組
var _ = require('lodash'); // 工具包模組
var os = require('os'); // 系統模組
if ( typeof( global.Promise ) == 'undefined' ){
	global.Promise = require('bluebird');
}
var contestModel = require('../../modules/contest-module/v3/contest-model-v3');
var contestCommonLogic = require('../../modules/contest-module/v3/contest-logic/contest-common-logic');
var contestCronJobCommon = require('./contest-job-common');

var contestJobPushCenter = {
	/**
	 * << 將新版比賽的列表情單,從Mysql讀取出來後,篩選有效的比賽清單出來,然後發包給 contest-job-get 去處理 >>
	 * @param [非必要] contestId : 比賽ID , 有傳遞就是僅檢查該比賽的狀態 , 如果沒有就是把所有的比賽都掃瞄過一次
	 */
	init: function (contestId) {
		var contestId = contestId ? contestId : '' ;
		var databaseList = contestCommonLogic.getAllProductDatabaseDetail();
		return new Promise(function (resolve, reject) {
			contestCronJobCommon.setDataBaseConnection()
				.then(function(){
					function sendContestJob(number) {
						var marketCode = Object.keys( databaseList[number] )[0];
						var databaseName = databaseList[number][marketCode];
						console.log( databaseName.black.bgWhite );
						contestCronJobCommon.setContestStatusFactory(databaseName)
							.then(function(res){
								console.log(res);
								if ( databaseList.length != parseInt(number) + 1 ){
									sendContestJob(parseInt(number) + 1);
								}else{
									console.log('==================================');
									console.log('>> ContestJob 已完成分配完畢'.green);
									resolve('contestCronJobIsAssignDone');
								}
							})
							.catch(function (error) {
								reject(error);
							});
					}

					if (databaseList.length != 0) {
						console.log('>> ContestJob 開始進行任務分配'.green);
						console.log('==================================');
						sendContestJob(0);
					} else {
						console.log('警告：ContestJob 無偵測到數據庫資訊,因此程序終止'.red);
						console.log('==================================');
						resolve('nothingToDo');
					}

				})
		})
			.catch(function (error) {
				contestCommonLogic.showErrorDetail(error);
				return new Promise.reject(error);
			});
	},
	reset : function (){
		global.contestJobList = []; /* 初始化 */
		contestJobPushCenter.init();
	}
};

module.exports = contestJobPushCenter;

