(function() {

  angular.module('fdt.directive.imageSlider', [])
      .directive('imageSliderDir', imageSliderDir);

  function imageSliderDir() {
    return {
      restrict: 'E',
      scope: {images: '='},
      templateUrl: '/components/image-slider/image-slider.html',
      link: function(scope, element, attrs) {
        var imageArray = [];
        _.forEach(scope.images, function(image) {
          if (image != '') {
            imageArray.push(image);
          }
        });

        var imageCount = imageArray.length;
        scope.imageCount = imageArray.length;
        scope.selectImage = imageArray[0];
        scope.page = 0;
        var page = 0;
        scope.left = function() {
          if (page == 0) {
            page = imageCount - 1;
            scope.page = imageCount - 1;
          }else {
            page = scope.page - 1;
            scope.page = scope.page - 1;
          }

          scope.selectImage = imageArray[page];
        };

        scope.right = function() {
          if (page == imageCount - 1) {
            page = 0;
            scope.page = 0;
          }else {
            page = scope.page + 1;
            scope.page = scope.page + 1;
          }

          scope.selectImage = imageArray[page];
        };
      },
    };
  }

})();
