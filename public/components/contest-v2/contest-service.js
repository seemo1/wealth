(function () {
	angular.module('fdt.contestV2.service', [])
		.factory('contestService', contestService);

	function contestService() {
		var contestService = {
			contestCoreDataMerge: function (contestId, formData, data , type ) {
				var obj = {};
				if ( type == 'create'){
					obj.contest_id = contestId;
					obj.apply_user_total = 0;
					obj.progress_status = 'W';
					obj.is_new = 'Y';
					obj.create_type = '1'; // 1: 後台建立 , 2: FDT lab
					obj.guest_user_visible = 'Y';
					obj.can_join_user_visible = 'Y';
				}
				// 預期用戶輸入的時間就是GMT+0
				obj.start_date_time = data.start_date_time ;
				obj.end_date_time = data.end_date_time


				if (data.award_item == 'A') { // 浮動獎金制
					obj.award_item = 'A'; // 浮動獎金制
					obj.dynamic_reward_base_money = data.dynamic_reward_base_money;
					obj.dynamic_reward_rise_money = data.dynamic_reward_rise_money;
					obj.dynamic_reward_max_money = data.dynamic_reward_max_money;
				} else if (data.award_item == 'B') {
					obj.award_item = 'B'; // 固定獎金制
					obj.fixed_reward_total_money = data.fixed_reward_total_money;
					obj.current_money = data.fixed_reward_total_money;
				}

				if (data.join_cond_enable == 'Y') { /* join_cond_has_school 跟著 join_cond_enable 連動 */
					obj.join_cond_enable = 'Y';
					obj.join_cond_has_school = 'Y';
					obj.join_cond_school_checking_before = ( data.join_cond_school_checking_before == 'Y' ) ? 'Y' : 'N';
					obj.join_cond_school_key = ( data.join_cond_school_key ) ? data.join_cond_school_key : '';
					obj.join_cond_school_region = ( data.join_cond_school_region ) ? data.join_cond_school_region : '';
					obj.join_cond_group = '';
				} else {
					obj.join_cond_enable = 'N';
					obj.join_cond_has_school = 'N';
					obj.join_cond_school_checking_before = 'N';
				}
				obj.join_cond_has_phone = 'Y' ; /* 目前為固定要檢查的條件 */
				obj.join_cond_least_money = ( data.join_cond_least_money ) ? data.join_cond_least_money : '';
				obj.join_cond_max_money = ( data.join_cond_max_money ) ? data.join_cond_max_money : '';
				obj.join_cond_before_the_end_day_can_not_join = ( data.join_cond_before_the_end_day_can_not_join ) ? data.join_cond_before_the_end_day_can_not_join : '';

				obj.ongoing_setting_stop_loss_point = ( data.ongoing_setting_stop_loss_point != '' ) ? data.ongoing_setting_stop_loss_point : '';
				obj.upcoming_setting_activation_user_total = ( data.upcoming_setting_activation_user_total != '' ) ? data.upcoming_setting_activation_user_total : '';
				obj.default_language = data.default_language;
				for (var key in obj) {
					formData.append(key, obj[key]);
				}
				return formData;
			},
			contestNoticeDataMerge: function (contestId, formData, data , type) {
				var obj = {};
				obj['en'] = {
					name: data.en_name,
					title: data.en_title,
					coin_mark: data.en_coin_mark,
					reward_description: data.en_reward,
					content_description: data.en_content,
					language: 'EN',
					icon_image: ''
				};
				if (type == 'create' ){
					obj['en']['contest_id'] = contestId;
				}
				formData.append('en[]', JSON.stringify(obj['en']));

				obj['cn'] = {
					name: data.cn_name,
					title: data.cn_title,
					coin_mark: data.cn_coin_mark,
					reward_description: data.cn_reward,
					content_description: data.cn_content,
					language: 'CN',
					icon_image: ''
				};
				if (type == 'create' ){
					obj['cn']['contest_id'] = contestId;
				}
				formData.append('cn[]', JSON.stringify(obj['cn']));

				obj['tw'] = {
					name: data.tw_name,
					title: data.tw_title,
					coin_mark: data.tw_coin_mark,
					reward_description: data.tw_reward,
					content_description: data.tw_content,
					language: 'TW',
					icon_image: ''
				};
				if (type == 'create' ){
					obj['tw']['contest_id'] = contestId;
				}
				formData.append('tw[]', JSON.stringify(obj['tw']));
				return formData;
			},
			getFile: function (imageActionName, formData, uploadFile) {
				if (uploadFile) {
					if (uploadFile.files.length == 1) {
						formData.append(imageActionName, uploadFile.files[0]);
					} else {
						formData.append(imageActionName, '');
					}
				}
				return formData;
			},
			contestCondCheck: function (obj) {
				console.log('edit_obj', obj);
				// 比賽日期設置
				if (obj.start_date_time == '') {
					return alert('請填寫比賽[開始日期]');
				} else if (obj.end_date_time == '') {
					return alert('請填寫比賽[結束日期]');
				} else if (!moment(obj.start_date_time).isValid()) {
					return alert('比賽[開始日期]格式不正確');
				} else if (!moment(obj.end_date_time).isValid()) {
					return alert('比賽[結束日期]格式不正確');
				} else if ( obj.start_date_time > obj.end_date_time ) {
					return alert('比賽[開始日期] 不能大於 比賽[結束日期]喔！');
				} else if (obj.default_language == '') {
					return alert('比賽公開資訊相關的[預設語系設定]，至少選擇一項');
				} else {
					// 比賽公開資訊相關
					if (obj.default_language == 'EN') {
						if (obj.en_name == '') {
							return alert('請填寫[比賽名稱](英文版本)');
						} else if (obj.en_title == '') {
							return alert('請填寫[比賽標題](英文版本)');
						} else if (obj.en_content == '') {
							return alert('請填寫[比賽敘述](英文版本)');
						} else if (obj.en_reward == '') {
							return alert('請填寫[獎金敘述](英文版本)');
						} else if (obj.en_coin_mark == '') {
							return alert('請填寫[比赛獎金符號](英文版本)');
						}
					} else if (obj.default_language == 'TW') {
						if (obj.tw_name == '') {
							return alert('請填寫[比賽名稱](繁中版本)');
						} else if (obj.tw_title == '') {
							return alert('請填寫[比賽標題](繁中版本)');
						} else if (obj.tw_content == '') {
							return alert('請填寫[比賽敘述](繁中版本)');
						} else if (obj.tw_reward == '') {
							return alert('請填寫[獎金敘述](繁中版本)');
						} else if (obj.tw_coin_mark == '') {
							return alert('請填寫[比赛獎金符號](繁中版本)');
						}
					} else if (obj.default_language == 'CN') {
						if (obj.cn_name == '') {
							return alert('請填寫[比賽名稱](簡中版本)');
						} else if (obj.cn_title == '') {
							return alert('請填寫[比賽標題](簡中版本)');
						} else if (obj.cn_content == '') {
							return alert('請填寫[比賽敘述](簡中版本)');
						} else if (obj.cn_reward == '') {
							return alert('請填寫[獎金敘述](簡中版本)');
						} else if (obj.cn_coin_mark == '') {
							return alert('請填寫[比赛獎金符號](簡中版本)');
						}
					} else {
						return alert('比賽公開資訊相關的[預設語系設定]無法辨識，建議重新刷新網頁後再重新新增一次');
					}
				}
				// 比賽獎金設定
				if (obj.award_item == 'A') {
					if (obj.dynamic_reward_base_money === '' || obj.dynamic_reward_rise_money === '' || obj.dynamic_reward_max_money === '') {
						return alert('你選擇的是[浮動獎金制]. 請填寫完畢[獎金基礎值][每當一人加入時會增加的金額][獎金成長最大值]等欄位 ');
					} else if (!isPositiveInteger(obj.dynamic_reward_rise_money)) {
						return alert('[浮動獎金制][獎金基礎值] 必須為正整數');
					} else if (!isPositiveInteger(obj.dynamic_reward_base_money)) {
						return alert('[浮動獎金制][每當一人加入時會增加的金額] 必須為正整數');
					} else if (!isPositiveInteger(obj.dynamic_reward_max_money)) {
						return alert('[浮動獎金制][獎金成長最大值] 必須為正整數');
					}
				} else if (obj.award_item == 'B') {
					if (obj.fixed_reward_total_money === '') {
						return alert('你選擇的是[固定獎金制]. 請填寫[獎金總金額]');
					} else if (!isPositiveInteger(obj.fixed_reward_total_money)) {
						return alert('[固定獎金制][獎金總金額] 必須為正整數');
					}
				} else {
					return alert('請選擇一種獎金計算方式');
				}

				// 比賽門檻設置
				if (obj.join_cond_enable == 'Y') {
					if (obj.join_cond_before_the_end_day_can_not_join != '') {
						if (!isPositiveInteger(obj.join_cond_before_the_end_day_can_not_join)) {
							return alert('比賽門檻設置 的 比賽結束前的N天不能再加入，其中N必須為正整數');
						}
					} else if (obj.join_cond_least_money != '') {
						if (!isPositiveInteger(obj.join_cond_least_money)) {
							return alert('比賽門檻設置 的 Account value限制(最大值)，參數必須為正整數');
						}
					} else if (obj.join_cond_max_money != '') {
						if (!isPositiveInteger(obj.join_cond_max_money)) {
							return alert('比賽門檻設置 的 Account value限制(最小值)，參數必須為正整數');
						}
					}
				}
				// 競賽條件設置
				if (obj.ongoing_setting_stop_loss_point != '') {
					if (!isPositiveInteger(obj.ongoing_setting_stop_loss_point)) {
						return alert('競賽條件設置 的 虧損超過N%後喪失比賽資格，其中N必須為正整數');
					}
				} else if (obj.upcoming_setting_activation_user_total != '') {
					if (!isPositiveInteger(obj.upcoming_setting_activation_user_total)) {
						return alert('競賽條件設置 的 比賽至少有滿足N人參賽後才算有效，其中N必須為正整數');
					}
				}

				return true;
			},
			getContestRandomId: function () {
				var wordList = 'abcdefghijklmnopqrstuvwxwz123456789';
				var oneChar = parseInt(Math.random() * parseInt(wordList.length));
				var twoChar = parseInt(Math.random() * parseInt(wordList.length));
				return moment().format('YYYYMMDDHHmmss') + wordList[oneChar] + wordList[twoChar];
			},
			justHttp: function ($http, tag, method, url, formData, callback) {
				var httpObject = null;
				if (method == 'PUT') {
					httpObject = $http({
						method: method,
						url: url,
						data: formData,
						headers: {'Content-Type': undefined}
					})
				} else {
					httpObject = $http({
						method: method,
						url: url,
						data: formData,
						headers: {'Content-Type': undefined}
					})
				}

				httpObject
					.then(
					function (response) { // 成功
						console.log('[success]' + tag);
						callback(response);
					},
					function (response) { // 失敗
						console.log('[fail]' + tag);
						callback(response);
					});
			},
			marketSortName: function (marketCode) {
				var name = marketCode;
				/* 匹配不到就僅返回 marketCode */
				switch (marketCode) {
					case 'FX' :
						name = '外匯';
						break;
					case 'FC' :
						name = '期貨';
						break;
					case 'SC' :
						name = '股市';
						break;
					case 'FT' :
						name = '期貨';
						break;
				}
				return name;
			},
			marketFullName: function (marketCode) {
				var name = marketCode;
				/* 匹配不到就僅返回 marketCode */
				switch (marketCode) {
					case 'FX' :
						name = '外匯操盤手';
						break;
					case 'FC' :
						name = '期貨操盤手';
						break;
					case 'FC' :
						name = '股市操盤手';
						break;
					case 'FT' :
						name = '期貨操盤手(台灣)';
						break;
				}
				return name;
			}
		};
		return contestService;
	}

	function isPositiveInteger(str) {
		// 必須為數值格式
		return Number.isInteger(parseInt(str));
	}
})();
