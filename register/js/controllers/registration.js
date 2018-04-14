myApp.controller('RegistrationController', 
  ['$scope', 'Authentication',
  function($scope, Authentication) {

  $scope.login = function() {
    Authentication.login($scope.user);
  };

  $scope.logout = function() {
    sessionStorage.setItem("userID", null);
    sessionStorage.setItem("community_id", null)
    Authentication.logout();
  };

  $scope.register = function() {
    Authentication.register($scope.user);
  }; //register

}]); //Controller