(function () {

  'use strict';

  angular.module('fdt.mobile.contest', [
        'ui.router',
        'mgcrea.ngStrap',
        'ngAnimate',
        'ngCookies',
        'angularMoment',
        'tc.chartjs',
        'ngSanitize',
        'lazy-scroll',
        'fdt.mobile.contest.nav',
        'fdt.contest.services.user',
        'fdt.mobile.contest.controller',
        'fdt.mobile.contest.head.directive',
        'fdt.mobile.contest.bulletin.controller',
        'fdt.mobile.contest.list.all.controller',
        'fdt.mobile.contest.list.user.controller',
        'fdt.mobile.contest.rules.controller',
        'fdt.mobile.contest.bulletin.directive',
        'fdt.mobile.contest.banner.directive',
        'fdt.mobile.contest.subhead.nav.directive',
        'fdt.mobile.contest.details.head.directive',
        'fdt.mobile.contest.details.upcoming.controller',
        'fdt.mobile.contest.details.ongoing.controller',
        'fdt.mobile.contest.details.past.controller',
        'fdt.mobile.contest.contestRule.directive',
        'fdt.mobile.contest.performanceChart.directive',
        'fdt.mobile.contest.prize.directive',
        'fdt.mobile.contest.services.api',
        'fdt.mobile.contest.share',
        'fdt.mobile.contest.topPerformer.directive',
        'fdt.mobile.contest.participant.controller',
        'fdt.mobile.contest.participant.directive',
        'fdt.mobile.contest.list.directive',
        'fdt.mobile.contest.dynamic.reward.directive',
        'fdt.mobile.contest.performer.list.controller',
        'fdt.mobile.contest.popup.controller',
        'fdt.mobile.contest.services.utility',
        'fdt.mobile.contest.error.controller',
        'fdt.mobile.contest.details.proxy.controller'
      ])
      .run(Run)
      .config(Config)
      .constant('CONFIG', Constant())
      .constant('_', _);

  Config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$compileProvider', '$urlMatcherFactoryProvider'];
  function Config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $compileProvider, $urlMatcherFactoryProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/(.*?):/);
    $urlRouterProvider.otherwise('/mobile/contest/');
    $urlMatcherFactoryProvider.strictMode(false)
    $stateProvider.state('contest', {
      controller: 'ContestCtrl as contestCtrl',
      url: '/mobile/contest/?protocol&platform&token&language&country&contest_id',
      templateUrl: '/mobile/contest/main/main.html',
      resolve: {
        contestDetail: ['contestApi', '$stateParams', '$state', function (contestApi, $stateParams, $state) {
          if (!$stateParams.contest_id) {
            return undefined
          };
          return contestApi.getContestDetail($stateParams.contest_id)
        },],

        bulletins: ['contestApi', function (contestApi) {
          return contestApi.bulletin.get();
        },],

        banner: ['contestApi', function (contestApi) {
          return contestApi.banner.get();
        },],

        joinedContest: ['contestApi', function (contestApi) {
          return contestApi.getContestByCase('quickView');
        },],

        suggestedContest: ['contestApi', function (contestApi) {
          return contestApi.getContestByCase('suggest');
        },],
      },
    });

    $stateProvider.state('list', {
      controller: 'ListAllCtrl as listAllCtrl',
      resolve: {
        contests: ['contestApi', function (contestApi) {
          var market = 'FX';
          if (sessionStorage.getItem('market')) {
            market = sessionStorage.getItem('market');
          } else {
            localStorage.setItem('market', 'FX'); //default market
            sessionStorage.setItem('market', 'FX');
          }
          return contestApi.getAllContest(market);
        },],
      },
      url: '/mobile/contest/list/?protocol&platform&token&language&country',
      templateUrl: '/mobile/contest/all-contest/all-contest.html',
    });

    $stateProvider.state('user', {
      controller: 'ListUserCtrl as listUserCtrl',
      resolve: {
        upcomingContest: ['contestApi', function (contestApi) {
          return contestApi.getContestByCase('upcoming');
        },],

        ongoingContest: ['contestApi', function (contestApi) {
          return contestApi.getContestByCase('ongoing');
        },],

        pastContest: ['contestApi', function (contestApi) {
          return contestApi.getContestByCase('past');
        },],
      },
      url: '/mobile/contest/user/?protocol&platform&token&language&country',
      templateUrl: '/mobile/contest/user-contest/user-contest.html',
    });

    $stateProvider.state('bulletin', {
      controller: 'ContestBulletinCtrl as bulletinCtrl',
      url: '/mobile/contest/bulletin/',
      templateUrl: '/mobile/contest/bulletin/bulletin.html',
      resolve: {
        bulletins: ['contestApi', function (contestApi) {
          return contestApi.bulletin.get();
        },],
      },
    });

    $stateProvider.state('rules', {
      url: '/mobile/contest/rules/?protocol&platform&token&language&country',
      templateUrl: '/mobile/contest/rules/rules.html',
      controller: 'ContestRulesCtrl as rulesCtrl',
    });

    $stateProvider.state('ongoing', {
      controller: 'OngoingCtrl as ongoingCtrl',
      params: {id: null},
      url: '/mobile/contest/ongoing/:id/?join&token',
      templateUrl: '/mobile/contest/details/ongoing/ongoing.html',
      resolve: {
        contestDetail: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getContestDetail($stateParams.id);
        },],

        topPerformers: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getContestTopPerformers($stateParams.id, 0, 3);
        },],

        dailyTopPerformers: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getContestDailyPerformers($stateParams.id, 0, 3);
        },],

        userPerformance: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getUserPerformance($stateParams.id);
        },],
      },
    });

    $stateProvider.state('upcoming', {
      controller: 'UpcomingCtrl as upcomingCtrl',
      params: {id: null},
      url: '/mobile/contest/upcoming/:id/?join&token',
      templateUrl: '/mobile/contest/details/upcoming/upcoming.html',
      resolve: {
        contestDetail: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getContestDetail($stateParams.id);
        },],
      },
    });

    $stateProvider.state('past', {
      controller: 'PastCtrl as pastCtrl',
      params: {id: null},
      url: '/mobile/contest/past/:id/',
      templateUrl: '/mobile/contest/details/past/past.html',
      resolve: {
        contestDetail: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getContestDetail($stateParams.id);
        },],

        userPerformance: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getUserPerformance($stateParams.id);
        },],

        topPerformers: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getContestTopPerformers($stateParams.id, 0, 3);
        },],
      },
    });

    $stateProvider.state('share', {
      controller: 'ShareCtrl as shareCtrl',
      url: '/mobile/contest/share?contest_id&language&userId&type&market',
      templateUrl: '/mobile/contest/share/share.html',
      resolve: {
        contestDetail: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          //why contest_id not contestId? it's client side request
          return contestApi.getSharedData($stateParams.contest_id, $stateParams.market);
        },],
      },
    });

    $stateProvider.state('topPerformers', {
      controller: 'PerformerListCtrl as performerListCtrl',
      url: '/mobile/contest/:id/topPerformers',
      templateUrl: '/mobile/contest/performer-list/performer-list.html',
      resolve: {
        topPerformers: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getContestTopPerformers($stateParams.id);
        },],
      },
    });

    $stateProvider.state('dailyTopPerformers', {
      controller: 'PerformerListCtrl as performerListCtrl',
      url: '/mobile/contest/:id/dailyTopPerformers',
      templateUrl: '/mobile/contest/performer-list/performer-list.html',
      resolve: {
        topPerformers: ['contestApi', '$stateParams', function (contestApi, $stateParams) {
          return contestApi.getContestDailyPerformers($stateParams.id);
        },],
      },
    });

    $stateProvider.state('participantList', {
      controller: 'PerformerListCtrl as performerListCtrl',
      url: '/mobile/contest/:id/participantList',
      templateUrl: '/mobile/contest/performer-list/performer-list.html',
      resolve: {
        topPerformers: ['contestApi', '$stateParams', function (contestApi, $stateParams) {          
          return contestApi.getParticipant($stateParams.id);
        },],
      },
    });

    $stateProvider.state('error', {
      controller: 'ContestErrorCtrl as contestErrorCtrl',
      url: '/mobile/contest/error/',
      templateUrl: '/mobile/contest/error/error.html'
    });

    $stateProvider.state('details', {
      controller: 'DetailProxyController as detailProxyController',
      url: '/mobile/contest/details/?protocol&platform&token&language&country&market&contest_id',
      templateUrl: '/mobile/contest/details/proxy/details-proxy.html'
    });

    $locationProvider.html5Mode({enabled: true});

    //global http interceptors
    //used to inject user token
    //TODO: remote logging
    $httpProvider.interceptors.push(['$q', 'user', '$cookies', function ($q, user, $cookies) {
      return {
        request: function (config) {
          //injecting headers with user authentication
          var userData = $cookies.getObject('user');
          if (userData) {
            config.headers['x-language'] = userData.language;
            config.headers['x-token'] = localStorage.getItem('token');
            config.headers['x-country'] = userData.country;
            config.headers['x-market'] = localStorage.getItem('market') || 'FX';
          }

          return config || $q.when(config);
        },

        response: function (response) {
          return response || $q.when(response);
        },

        requestError: function (rejection) {
          console.error('[REQUEST ERROR]', rejection.config);
          return $q.reject(rejection);
        },

        responseError: function (rejection) {
          console.error('[RESPONSE ERROR]');
          return $q.reject(rejection);
        },
      };
    },]);
  }

  Run.$inject = ['$rootScope', 'user', '$cookies', '$state'];
  function Run($rootScope, user, $cookies, $state) {
    //set user basic data here
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      //在 loading 時讓按上一頁失效
      if ($rootScope.stateIsLoading == true) {
        event.preventDefault();
        return;
      }
      $rootScope.stateIsLoading = true;
      $cookies.putObject('toState', toState);
      $cookies.putObject('toParams', toParams);
      $cookies.putObject('fromState', fromState);
      $cookies.putObject('fromParams', fromParams);

      //handling initial user data
      //if something is broken (page not loading / cannot make any request)
      //this is the first place you have to check
      //there are different handler here because there are some deeplink that will open the page directly
      var deepLinkState = ['contest', 'rules', 'list', 'bulletin', 'user', 'details'];
      if (deepLinkState.indexOf(toState.name) > -1 && toParams.token) {
        var userData = {
          token: toParams.token,
          language: toParams.language || 'EN', //set default
          country: toParams.country || 'EN', //set default
          protocol: toParams.protocol,
          platform: toParams.platform,
        };
        localStorage.setItem('token', userData.token.replace(/ /g, '+'));
        user.set(userData);
        $cookies.putObject('user', userData);
        $cookies.put('userId', userData.id);
      }

      if (toParams.token) {
        localStorage.setItem('token', toParams.token.replace(/ /g, '+'));
      }

    });
    var trackingList = {
      'contest': 'Contest_Main',
      'bulletin': 'Contest_Notice',
      'list': 'Contest_All',
      'user': 'Contest_My',
      'rules': 'Contest_Rule',
      'ongoing': 'Contest_Detail',
      'upcoming': 'Contest_Detail',
      'past': 'Contest_Detail',
      'participantList': 'Contest_Detail_Applied',
      'topPerformers': 'Contest_Detail_Top',
      'dailyTopPerformers': 'Contest_Detail_Riser'
    };
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

      $rootScope.stateIsLoading = false;
      var trackingName = trackingList[toState.name];
      if (trackingName && window.appProtocol) {
        fdt.callAPP('fdt/gapagetracking', ['screen_name=' + trackingName], window.appProtocol);
      }
      
      //ios 抓不到 webViewDidFinishLoad event，故需改成 deeplink 呼叫 ios 更新 title
      if (window.platform == 'ios') {
        window.location = window.appProtocol + "://fdt/webview/changeTitle";
      }
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
      //TODO: error handler, logging
      $rootScope.stateIsLoading = false;
      //$state.go('error');
    });

    $rootScope.$on('$viewContentLoaded', function (event) {
      //TODO: what to do on view content loaded? logging?
    });

    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
      //TODO: error handler, logging
      $rootScope.stateIsLoading = false;
      //$state.go('error');
    });

  }

  function Constant() {

    //init radar chart color based on market type
    var chartColor = {
      fillColor: 'rgba(88,161,242,0.8)',
      strokeColor: 'rgba(0,122,255,1)',
      pointColor: 'rgba(0,122,255,1)',
      pointHighlightStroke: 'rgba(0,122,255,1)',
    };

    if (window.market !== 'global') {
      chartColor = {
        fillColor: 'rgba(255,96,96,0.8)',
        strokeColor: 'rgba(233,48,48,1)',
        pointColor: 'rgba(233,48,48,1)',
        pointHighlightStroke: 'rgba(233,48,48,1)',
      };
    }

    return {
      host: window.location.protocol + '//' + window.location.host,
      shareLink: window.location.protocol + '//' + window.location.host + '/mobile/contest/share/',
      chartColor: chartColor,
      testing: ''
    };
  }

})();