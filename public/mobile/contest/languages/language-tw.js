
(function() {

  angular.module('fdt.mobile.contest.language.tw', [])
      .factory('langTw', Lang);

  Lang.$inject = [];

  function Lang() {

    var language = {
      NAV_TITLE: '投資大賽',
      ALL_CONTEST: '全部比賽',
      ALL_ANNOUNCEMENTS: '全部公告',
      MY_CONTEST: '我的比賽',
      NO_MY_CONTEST: '暫無參加過的比賽',
      CAMPUS_CONTEST_RULES: '投資大賽規則說明',
      STATUS_UPCOMING: '即將開始',
      STATUS_APPLYING: '報名中',
      BUTTON_APPLIED: '比賽中',
      APPLIED: '已報名',
      STATUS_ONGOING: '進行中',
      STATUS_PAST: '已結束',
      STATUS_JOINED: '已參加',
      JOINED_CONTEST: '正在參加的比賽',
      MORE_CONTEST: '更多比賽',
      STATS_SCORE: '比賽得分',
      STATS_RANKING: '排名',
      STATS_GLOBAL_RANKING: '贏過對手',
      INFO_APPLY: '報名',
      INFO_JOIN: '參賽',
      INFO_TOTAL_PRIZE: '總獎金',
      INFO_START: '距開始(天)',
      INFO_END: '距結束(天)',
      INFO_FINISHED: '已結束',
      INFO_NO_RANKING: '暫無排名',
      CONTEST_DETAILS: '比賽詳情',
      SHARE: '分享',
      TOP_PERFORMER: '高手榜',
      DAILY_PERFORMER: '今日上升最快',
      PEOPLE_APPLIED: '人參賽',
      VIEW_ALL: '查看全部',
      JOIN_NOW: '立即參加',
      SCORING_CRITERIA: '了解評分標準',
      MY_CONTEST_SCORE: '比賽得分',
      RANKING: '排名',
      PRIZE_SCHEME: '獎項設置',
      PRIZE_1: '第一名: 獎金 50% + 憑證',
      PRIZE_2: '第二名: 獎金 30% + 憑證',
      PRIZE_3: '第三名: 獎金 20% + 憑證',
      WEEKLY_PRIZE: '每週都有XX獎品',
      CONTEST_SCORE: '比賽得分',
      NOTE_PERFORMANCE_CHART: '每日早上6:00後更新',
      VIEW_PROFILE: '查看個人資料',
      CONTEST_UPCOMING: '已報名的比賽',
      CONTEST_ONGOING: '正在參加的比賽',
      CONTEST_SUGGESTED: '推薦的比賽',
      CONTEST_PAST: '歷史比賽',
      PROFITABILITY: '盈利能力',
      RISK_MANAGEMENT: '風險控制',
      LEVEL_OF_FOCUS: '專注程度',
      EXECUTION_STRATEGY: '策略執行',
      TOP_TRADER_LIST: '高手榜',
      TOP_TRADER_RAISE: '今日上升最快',
      POINTS: '分',
      PEOPLE: '人',
      DAYS_LEFT: '天後',
      FX: '外匯',
      FT: '期貨',
      FC: '期貨',
      SC: '股票',
      CONTEST_RULES: '比賽規則',
      ACTIVATION_NUMBER: '最低人數限制',
      CONTEST_DURATION: '参賽限制',
      HAVE_APPLIED: '人報名',
      PARTICIPANT: '已有',
      TO: '至',
      DAYS_LEFT_2: '天後結束',
      DONE: '完成',
      REGISTRATION_SUCCESS: '報名成功',
      CONTEST_WELCOME: '歡迎參賽！給你三個交易小技巧',
      CONTEST_LEARN_MORE: '瞭解更多競賽訣竅',
      CASH_POOL_TITLE: '總獎金',
      CASH_POOL_DESCRIPTION: '總獎金如何計算:<br>每增加<span class="custom-text-color">1</span>人參賽，獎學金增加 <span class="custom-text-color">{0}</span>元，最高 <span class="custom-text-color">{1}</span>元',
      CONTEST_JOIN_APPLIED: '已參加/報名的比賽',
      PRIZE_SCHEME: '獎項設定',
      NO_SCORES_YET: '暫無評分',
      ROI: '投報率(ROI)'
    };

    return language;
  }

})();

