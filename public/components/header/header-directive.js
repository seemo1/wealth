(function() {

  angular.module('fdt.header', [])
      .directive('header', Header);

  function Header() {
    var header = {};
    header.restrict = 'E';
    header.templateUrl = '/components/header/header.html';
    return header;
  }

})();
