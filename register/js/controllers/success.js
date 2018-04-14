myApp.controller('SuccessController', ['$scope', '$location', 'communityService', function($scope, $location, communityService) {
  $scope.message = "Congratulations on joining CommunityConnect Portal!!!";
  $scope.go_events_page = function(){
      //$scope.community_id = "SomeID";
     communityService.setID("-adfweofdkdubkx");

      $location.path('/events');

    }
}]);