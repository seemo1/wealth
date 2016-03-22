(function() {

  angular.module('fdt.directive.uploadFile', [])
      .directive('uploadFile', UploadFileDirective);

  function UploadFileDirective($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.uploadFile);
        var modelSetter = model.assign;

        element.bind('change', function() {
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  }

})();
