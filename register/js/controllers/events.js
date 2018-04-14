myApp.controller('EventsController', ['$scope','$location','communityService', function($scope,$location, communityService) {
  $scope.EventList =[];

  var community_id = communityService.getCommunity_id();
  if(community_id == undefined){
      $location.path('/success');
  }
  console.log(community_id);
  var currentPostsRef = firebase.database().ref('/Community List/' + community_id + '/Events');
  currentPostsRef.on('value', function(snapshot) {
      Object.values(snapshot.val()).forEach(function(element) {
        console.log(element);
         $scope.EventList.push(element);
          $scope.$apply();
      });
  });

}]);