(function() {

  'use strict';

  var Animation = function (frameSize) {
    var frameSize = frameSize || 30;
    var frameTime = 1000/frameSize;
    var frames = [];
    var item = document.querySelector('.marquee-item');

    var addFrames = function(frame) {
      frames.push(frame);
    };

    var run = function(callback) {
      if (frames.length <= 0) {
        if (callback && typeof callback === "function") {
          callback();
        }
        return ;
      }
      var frame = frames.shift();
      setTimeout(function(){
        item.style.left = frame + "%";
        run(callback);
      }, frameTime);
    };

    return {
      addFrames: addFrames,
      run: run
    };
  };

  var Marquee = function(messages, wait) {
    var wait = wait || 3000;
    var data = messages || [];

    var frameSize = 60;
    var animation = new Animation(frameSize);

    var index = -1;
    var marquee = document.querySelector('.marquee');
    var item = marquee.querySelector('.marquee-item');

    var next = function() {
      changeData();
      left(100, 0);
      animation.run(function() {
        setTimeout(function() {
          left(0, -100);
          animation.run(function(){
            setTimeout(function(){
              next()
            }, 1000)
          });
        }, wait);
      });
    };

    var changeData = function() {
      var msg = data[getIndex()];
      item.innerHTML = msg.title
      item.addEventListener("click", function() {
        fdt.callAPP('fdt/gapagetracking', ['screen_name=Contest_Notice_Detail'], window.appProtocol);
        top.location = msg.link;
      });
    };

    var getIndex = function() {
      if (++index >= data.length) index = 0;
      return index;
    };

    var left = function(start, end) {
      var frames = frameSize/2;
      var shift = (start-end)/frames;
      for(var i=1; i<=frames; i++) {
        start -= shift;
        if (i >= frames) start = end;
        animation.addFrames(start);
      }
    };
    next();
  };


  angular.module('fdt.mobile.contest.bulletin.directive', [])
    .directive('bulletinListDir', BulletinListDir);

  BulletinListDir.$inject = ['$timeout'];

  function BulletinListDir($timeout) {
    return {
      restrict: 'EA',
      scope: { bulletins: '=' },
      templateUrl: '/mobile/contest/bulletin/bulletin-list.html',
      link: function(scope, elements, attrs, ctrl) {
      },
      controller: BuletinListCtrl,
      controllerAs: 'bulletinDir',
      bindToController: true
    };
  }


  BuletinListCtrl.$inject = ['$scope', '$timeout', '$cookies'];

  function BuletinListCtrl($scope, $timeout, $cookies) {
    var vm = this;
    if(vm.bulletins && vm.bulletins.length < 1) {
      return;
    }
    vm.goLink = function(link) {
      fdt.callAPP('fdt/gapagetracking', ['screen_name=Contest_Notice_Detail'], window.appProtocol);
      top.location = link;
    }
    /*
      使用 timeout 才能抓到 templateUrl 的 DOM
      因為 templateUrl 是使用 ajax async 後才 render，故使用 timeout 讓其在 ajax 後取得
    */
    $timeout(function() {
      var marquee = new Marquee(vm.bulletins, 8000);
    }, 1000);
  }
})();
