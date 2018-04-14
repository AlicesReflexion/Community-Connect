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

myApp.service('StorageService', function() {
    var userID =" ocampossoto1@gmail.com";
    var community_id;

    //setuser ID
    var setUser = function(UID){
        console.log(UID);
        userID = UID;
    }
    //get user ID
    var getUser = function(){
        return userID;
    }
    //Setter
    var setID = function(ID) {
        community_id = ID;
    };
    //getter
    var getCommunity_id = function(){
        return community_id;
    };
    //return fucntions
    return {
        setUser: setID,
        setID: setID,
        getUser: getUser,
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