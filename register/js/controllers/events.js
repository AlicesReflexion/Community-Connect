myApp.controller('EventsController', ['$scope','$location', function($scope,$location,) {
  $scope.EventList =[];

  var community_id = sessionStorage.getItem("community");
  if(community == undefined){
      $location.path('/success');
  }

  var currentPostsRef = firebase.database().ref('/Community List/' + community_id + '/Events');
  currentPostsRef.on('value', function(snapshot) {
      Object.values(snapshot.val()).forEach(function(element) {
         $scope.EventList.push(element);
          $scope.$apply();
      });
  });
}]);