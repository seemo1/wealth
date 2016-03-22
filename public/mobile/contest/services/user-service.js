(function() {

  angular.module('fdt.contest.services.user', [])
      .factory('user', User);

  User.$inject = [];
  function User() {

    var user = {
      token: '',
      language: '',
      country: '',
    };

    user.set = function(userData) {
      for (var prop in userData) {
        user[prop] = userData[prop];
      }
    };

    return user;
  }

})();
