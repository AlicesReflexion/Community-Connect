var myApp = angular.module('myApp', 
  ['ngRoute', 'firebase']);

myApp.run(['$rootScope', '$location', function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
    if (error == 'AUTH_REQUIRED') {
      $rootScope.message = 'Sorry, you must log in to access that page';
      $location.path('/login');
    }//Auth Required
  }); //$routeChangeError
}]); //run

myApp.service('communityService', function() {
    var community_id;

    var setID = function(ID) {
        community_id = ID;
    };

    var getCommunity_id = function(){
        return community_id;
    };

    return {
        setID: setID,
        getCommunity_id: getCommunity_id
    };

});

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'RegistrationController'
    }).
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationController'
    }).
    when('/events', {
      templateUrl: 'views/events.html',
      controller: 'EventsController'
    }).
    when('/success', {
      templateUrl: 'views/success.html',
      controller: 'SuccessController',
      resolve: {
        currentAuth: function(Authentication) {
          return Authentication.requireAuth();
        } //currentAuth
      }//resolve
    }).
    otherwise({
      redirectTo: '/login'
    });
}]);