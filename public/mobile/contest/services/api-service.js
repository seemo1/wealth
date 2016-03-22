(function() {

  angular.module('fdt.mobile.contest.services.api', [])
      .factory('contestApi', ContestApi);

  ContestApi.$inject = ['$http', '$q', 'CONFIG'];

  function ContestApi($http, $q, CONFIG) {
    var baseUrl = CONFIG.host + '/contest/v3';
    var api = {
      bulletin: {},
      banner: {},
    };

    api.bulletin.get = function() {
      var url = baseUrl + '/adBulletin/';
      return $http.get(url);
    };

    api.banner.get = function() {
      var url = baseUrl + '/adBanner/';
      return $http.get(url);
    };

    api.getContestByCase = function(type) {
      var url = baseUrl + '/user/?case=' + type;
      return $http.get(url);
    };

    api.getAllContest = function(market, startRows, limit) {
      startRows = startRows || 0;
      limit = limit || 50;
      var url = baseUrl + '/user/?startRows=' + startRows + '&limit=' + limit;
      return $http.get(url);
    };

    api.getContestDetail = function(contestId) {
      var url = baseUrl + '/' + contestId + '/user/detail/';
      return $http.get(url);
    };

    api.getUserPerformance = function(contestId, userId) {
      var query = '';
      if(userId) {
        query = '?user_id=' + userId;
      }

      var url = baseUrl + '/' + contestId + '/user/performance/' + query;
      return $http.get(url);
    };

    api.getContestTopPerformers = function(contestId, startRows, limit) {
      startRows = startRows || 0;
      limit = limit || 50;
      var url = baseUrl + '/' + contestId + '/user/topScore/?startRows=' + startRows + '&limit=' + limit;
      return $http.get(url);
    };

    api.getContestDailyPerformers = function(contestId, startRows, limit) {
      startRows = startRows || 0;
      limit = limit || 50;
      var url = baseUrl + '/' + contestId + '/user/topRaise/?startRows=' + startRows + '&limit=' + limit;
      return $http.get(url);
    };

    api.getSharedData = function(contestId, market) {
      var url = baseUrl + '/' + contestId + '/shared/' + market + '/';
      return $http.get(url);
    };

    api.getParticipant = function(contestId) {
      var url = baseUrl + '/' + contestId + '/contestants/?startRows=0&limit=50';
      return $http.get(url);
    };

    return api;
  }

})();
