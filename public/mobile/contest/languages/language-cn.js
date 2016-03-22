
(function() {

  angular.module('fdt.mobile.contest.language.cn', [])
      .factory('langCn', Lang);

  Lang.$inject = [];

  function Lang() {

    var language = {
      NAV_TITLE: '投资大赛',
      ALL_CONTEST: '全部比赛',
      ALL_ANNOUNCEMENTS: '全部公告',
      MY_CONTEST: '我的比赛',
      NO_MY_CONTEST: '暂未参加过比赛',
      CAMPUS_CONTEST_RULES: '投资大赛规则详解',
      STATUS_UPCOMING: '即将开始',
      STATUS_APPLYING: '报名中',
      BUTTON_APPLIED: '比赛中',
      APPLIED: '已报名',
      STATUS_ONGOING: '进行中',
      STATUS_PAST: '已结束',
      STATUS_JOINED: '已参赛',
      JOINED_CONTEST: '正在参加的比赛',
      MORE_CONTEST: '更多比赛',
      STATS_SCORE: '比赛得分',
      STATS_RANKING: '排名',
      STATS_GLOBAL_RANKING: '超过对手',
      INFO_APPLY: '报名',
      INFO_JOIN: '参赛',
      INFO_TOTAL_PRIZE: '奖金池',
      INFO_START: '距开始(天)',
      INFO_END: '距结束(天)',
      INFO_FINISHED: '已结束',
      INFO_NO_RANKING: '暂无排名',
      CONTEST_DETAILS: '比赛详情',
      SHARE: '分享',
      TOP_PERFORMER: '高手榜',
      DAILY_PERFORMER: '今日上升最快',
      PEOPLE_APPLIED: '人参赛',
      VIEW_ALL: '查看全部',
      JOIN_NOW: '立即参赛',
      SCORING_CRITERIA: '了解评价标准',
      MY_CONTEST_SCORE: '我的比赛得分',
      RANKING: '排名',
      PRIZE_SCHEME: '獎項設置',
      PRIZE_1: '第一名: 奖金 50% + 凭证',
      PRIZE_2: '第二名: 奖金 30% + 凭证',
      PRIZE_3: '第三名: 奖金 20% + 凭证',
      WEEKLY_PRIZE: '每週都有XX獎品',
      CONTEST_SCORE: '比賽得分',
      NOTE_PERFORMANCE_CHART: '每天早上6:00后更新',
      VIEW_PROFILE: '查看个人资料',
      CONTEST_UPCOMING: '已报名的比赛',
      CONTEST_ONGOING: '正在参加的比赛',
      CONTEST_SUGGESTED: '推荐的比赛',
      CONTEST_PAST: '历史比赛',
      PROFITABILITY: '盈利能力',
      RISK_MANAGEMENT: '风险控制',
      LEVEL_OF_FOCUS: '专注程度',
      EXECUTION_STRATEGY: '策略执行',
      TOP_TRADER_LIST: '高手榜',
      TOP_TRADER_RAISE: '今日上升最快',
      POINTS: '分',
      PEOPLE: '人',
      DAYS_LEFT: '天后',
      FX: '外汇',
      FT: '期货',
      FC: '期货',
      SC: '股票',
      CONTEST_RULES: '赛事说明',
      ACTIVATION_NUMBER: '最低人数限制',
      CONTEST_DURATION: '参赛限制',
      HAVE_APPLIED: '人报名',
      PARTICIPANT: '已有',
      TO: '至',
      DAYS_LEFT_2: '天后结束',
      DONE: '完成',
      REGISTRATION_SUCCESS: '报名成功',
      CONTEST_WELCOME: '欢迎参赛！送上获胜三字诀',
      CONTEST_LEARN_MORE: '了解更多比赛获胜法宝',
      CASH_POOL_TITLE: '奖金池',
      CASH_POOL_DESCRIPTION: '奖金池如何计算:<br>每增加<span class="custom-text-color">1</span>人参赛，助学金增加 <span class="custom-text-color">{0}</span>元，最高 <span class="custom-text-color">{1}</span>元',
      CONTEST_JOIN_APPLIED: '已参加/报名的比赛',
      PRIZE_SCHEME: '奖项设置',
      NO_SCORES_YET: '暂无评分',
      ROI: '投资回报(ROI)'
    };

    return language;
  }

})();

