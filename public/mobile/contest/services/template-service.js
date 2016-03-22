//(function(){
//
//  angular.module('fdt.mobile.contest.services.templateCache', [])
//      .factory('$templateCache', templateCache);
//
//  templateCache.$inject = ['$cacheFactory', '$http', '$injector'];
//  function templateCache ($cacheFactory, $http, $injector) {
//    var cache = $cacheFactory('templates');
//    var allTplPromise;
//
//    return {
//      get: function(url) {
//        var fromCache = cache.get(url);
//
//        // already have required template in the cache
//        if (fromCache) {
//          return fromCache;
//        }
//
//        // first template request ever - get the all tpl file
//        if (!allTplPromise) {
//          allTplPromise = $http.get('/mobile/contest/all-templates').then(function(response) {
//            // compile the response, which will put stuff into the cache
//            $injector.get('$compile')(response.data);
//            return response;
//          });
//        }
//
//        // return the all-tpl promise to all template requests
//        return allTplPromise.then(function(response) {
//          return {
//            status: response.status,
//            data: cache.get(url)
//          };
//        });
//      },
//
//      put: function(key, value) {
//        cache.put(key, value);
//      }
//    };
//  }
//
//})