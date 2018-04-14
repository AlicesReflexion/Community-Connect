myApp.controller('SuccessController', ['$scope', '$location', 'Authentication', 'StorageService', function($scope, $location, Authentication, StorageService) {
  $scope.message = "Congratulations on joining CommunityConnect Portal!!!";


  $scope.go_events_page = function(){
      //$scope.community_id = "SomeID";
      StorageService.setID("-adfweofdkdubkx");

      $location.path('/events');

  };
  $scope.logout = function(){
      Authentication.logout();
  };
  $scope.PriorityList=[];
  $scope.PostList =[];

  var refCurrentPostsRef = firebase.database().ref('/Community List/' + "-adfweofdkdubkx" + '/Post');
    refCurrentPostsRef.on('value', function(snapshot) {
        Object.values(snapshot.val()).forEach(function(element) {
            if (element.Priority) {
                $scope.PriorityList.push(element);
            } else {
                $scope.PostList.push(element);
            }
            $scope.$apply();
        });

    });

}]);