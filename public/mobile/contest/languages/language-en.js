
(function() {

  angular.module('fdt.mobile.contest.language.en', [])
      .factory('langEn', Lang);

  Lang.$inject = [];

  function Lang() {

    var language = {
      NAV_TITLE: 'Contest',
      ALL_CONTEST: 'All Contests',
      ALL_ANNOUNCEMENTS: 'All Announcements',
      MY_CONTEST: 'My Contest',
      NO_MY_CONTEST: 'You haven\'t join any contest yet.',
      CAMPUS_CONTEST_RULES: 'Campus Contest Rules',
      STATUS_UPCOMING: 'Upcoming',
      STATUS_APPLYING: 'Applying',
      BUTTON_APPLIED: 'On-Going Contest',
      APPLIED: 'Applied',
      STATUS_ONGOING: 'On-Going',
      STATUS_PAST: 'Concluded',
      STATUS_JOINED: 'Joined',
      JOINED_CONTEST: 'Joined Contest',
      MORE_CONTEST: 'More Contest',
      STATS_SCORE: 'Score',
      STATS_RANKING: 'Ranking',
      STATS_GLOBAL_RANKING: 'Surpassed Opponents',
      INFO_APPLY: 'Apply',
      INFO_JOIN: 'Join',
      INFO_TOTAL_PRIZE: 'Cash Pool',
      INFO_START: 'Days To Start',
      INFO_END: 'Days To End',
      INFO_FINISHED: 'Finished',
      INFO_NO_RANKING: 'No Ranking Information Now',
      CONTEST_DETAILS: 'Contest Details',
      SHARE: 'Share',
      TOP_PERFORMER: 'Top traders',
      DAILY_PERFORMER: 'Today\'s top risers',
      PEOPLE_APPLIED: 'People Applied',
      VIEW_ALL: 'View All',
      JOIN_NOW: 'Join Now',
      SCORING_CRITERIA: 'View Scoring Standards',
      MY_CONTEST_SCORE: 'My Contest Score',
      RANKING: 'Ranking',
      PRIZE_SCHEME: 'Prize Scheme',
      PRIZE_1: 'First: Bonus 50% + Certification',
      PRIZE_2: 'Second: Bonus 30% + Certification',
      PRIZE_3: 'Third: Bonus 20% + Certification',
      WEEKLY_PRIZE: 'XX weekly prizes',
      CONTEST_SCORE: 'Contest Score',
      NOTE_PERFORMANCE_CHART: 'Updates daily at 6:00 AM',
      VIEW_PROFILE: 'View Profile',
      CONTEST_UPCOMING: 'Upcoming Contest',
      CONTEST_ONGOING: 'On-going Contest',
      CONTEST_SUGGESTED: 'Suggested Contest',
      CONTEST_PAST: 'Past Contest',
      PROFITABILITY: 'Profitability',
      RISK_MANAGEMENT: 'Risk Management',
      LEVEL_OF_FOCUS: 'Level of your focus',
      EXECUTION_STRATEGY: 'Execution of Strategy',
      TOP_TRADER_LIST: 'Top Trader List',
      TOP_TRADER_RAISE: 'Today\'s Top Risers',
      POINTS: 'PTS',
      PEOPLE: 'people(s)',
      DAYS_LEFT: 'day(s) left',
      FX: 'Forex',
      FT: 'Futures',
      FC: 'Futures',
      SC: 'Stock',
      CONTEST_RULES: 'Contest Rules',
      ACTIVATION_NUMBER: 'Activation Number',
      CONTEST_DURATION: 'Contest Duration',
      HAVE_APPLIED: 'have applied',
      PARTICIPANT: 'participant',
      TO: 'to',
      DAYS_LEFT_2: 'day(s) left',
      DONE: 'Done',
      REGISTRATION_SUCCESS: 'Registration Success',
      CONTEST_WELCOME: 'Welcome to the contest! Give you three trading tips',
      CONTEST_LEARN_MORE: 'Learn more contest strategies',
      CASH_POOL_TITLE: 'Cash Pool',
      CASH_POOL_DESCRIPTION: 'How the dynamic cash pool works:<br>The cash pool increases by <span class="custom-text-color">{0}</span> USD each time a new participant joins this contest. No more money will be added to the pot after the cash pool hits <span class="custom-text-color">{1}</span> USD.',
      CONTEST_JOIN_APPLIED: 'Contests joined/applied for',
      PRIZE_SCHEME: 'Prize Scheme',
      NO_SCORES_YET: 'No scores yet',
      ROI: ''
    };

    return language;
  }

})();

