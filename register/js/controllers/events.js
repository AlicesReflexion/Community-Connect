myApp.controller('EventsController', ['$scope','$location','communityService', function($scope,$location, communityService) {
  $scope.message = "Events";

  var community_id = communityService.getCommunity_id();
  if(community_id == undefined){
      $location.path('/success');
  }
  console.log(community_id);

  
}]);