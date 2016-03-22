(function() {

  angular.module('fdt.directive.leftMenu', [])
      .directive('leftMenu', leftMenu);

  function leftMenu() {
    var leftMenu = {};
    leftMenu.restrict = 'E';
    leftMenu.templateUrl = '/components/left-menu/left-menu.html';
    leftMenu.link = function(scope, elem, attrs) {
      scope.selectedList = localStorage.getItem('currentView');
      elem.bind('click', function(e) {
        scope.selectedList = e.target.id;

        //INFO: for fxxx firefox
        if (!e.srcElement) {
          return scope.$broadcast('switchView', e.target.id);
        }

        scope.$broadcast('switchView', e.srcElement.id);
        scope.$apply();
      });
    };

    return leftMenu;
  }

})();
