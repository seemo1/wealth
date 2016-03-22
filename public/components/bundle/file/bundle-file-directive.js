(function() {

  angular.module('fdt.directive.bundleFile', [])
      .directive('bundleFile', BundleFile);

  function BundleFile() {
    var bundleFile = {};
    bundleFile.restrict = 'E';
    bundleFile.templateUrl = '/components/bundle/file/bundle-file.html';
    return bundleFile;
  }

})();
