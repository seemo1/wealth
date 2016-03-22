(function() {

  'use strict';

  angular.module('fdt.mobile.contest.participant.directive', [])
      .directive('participantDir', ParticipantDir);

  function ParticipantDir() {
    return {
      restrict: 'EA',
      scope: { participant: '=', mode: '@', rank: '@'},
      controller: 'ParticipantCtrl as participantCtrl',
      templateUrl: '/mobile/contest/participant/participant.html',
      link: function(scope, elements, attrs, ctrl) {
        scope.participantCtrl.rankClass = (scope.mode != 'applied') ? 'rank-padding' : '';
        scope.participantCtrl.bodyClass = (scope.mode != 'applied') ? 'body-padding' : '';
        scope.participantCtrl.underLineClass = (scope.rank != '1') ? 'participant-list' : '';
        scope.participantCtrl.underLineClass += (scope.mode != 'applied') ? ' line-padding' : '';
        scope.participantCtrl.rank = scope.rank;
        scope.participantCtrl.dotClass = (parseInt(scope.rank) > 3) ? 'dot-other' : 'dot-' + scope.rank;
        scope.participantCtrl.mode = scope.mode;
        switch (scope.mode) {
          case 'top':
            scope.participantCtrl.score = true;
            scope.participantCtrl.updown = false;
            break;
          case 'dailyTop':
            scope.participantCtrl.score = false;
            scope.participantCtrl.updown = true;
            break;
          //mode = 'applied'
          default:
            scope.participantCtrl.score = false;
            scope.participantCtrl.updown = false;
        }
      }
    };
  }

})();
