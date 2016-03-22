(function() {

  angular.module('fdt.directive.pagination', [])
      .directive('paginationDir', paginationDir);

  function paginationDir() {
    return {
      restrict: 'E',
      scope: {data: '='},
      templateUrl: '/components/pagination/pagination.html',
      link: function(scope, element, attrs) {
        scope.pages = 1;
        scope.pageTotal = scope.data.length / scope.pages;
        console.log("scopeData=",scope.data);
        scope.selectPage = function(page) {
          scope.page = page;
          scope.pages = getPageList();
        };

        function getPageList() {
          var half    = Math.floor(pageSize / 2),
              isAlign = pageSize % 2 == 1,
              pages   = [createPage(scope.page, true)],
              flag    = scope.page,
              windows = half,
              stopPoint;

          while (flag - 1 > 0 && windows > 0) {
            pages.push(createPage(--flag, false));
            windows--;
          }

          stopPoint = flag;
          flag = scope.page;
          windows += isAlign ? half : half - 1;

          while (flag + 1 <= scope.totalPages && windows > 0) {
            pages.push(createPage(++flag, false));
            windows--;
          }

          while (windows > 0) {
            pages.push(createPage(--stopPoint, false));
            windows--;
          }

          return pages.sort(function(a, b) {
            return a.text - b.text;
          });
        }

        function createPage(page, active) {
          return {
            text: page,
            active:active,
          };
        }
      },
    };
  }

})();
