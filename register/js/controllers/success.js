myApp.controller('SuccessController', ['$rootScope','$scope', '$location', '$firebaseAuth','$firebaseObject', function($rootScope, $scope, $location, $firebaseAuth,$firebaseObject) {
  $scope.message = "Congratulations on joining CommunityConnect Portal!!!";

  var ref = firebase.database().ref();
  var auth = $firebaseAuth();

    $scope.PriorityList=[];
    $scope.PostList =[];
    $scope.current_user =null;
    $scope.community=null;


    //var user = $rootScope.currentUser;
  $scope.go_events_page = function(){
      $scope.save_user_community();
      $location.path('/events');

  };
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
           $scope.current_user = user;
           $scope.$apply();

        } else {
            // No user is signed in.
        }
    });

   //get community
    $scope.getCommunity = function(){
        //go through database and see if we are apart of the community
        var x = firebase.database().ref('/Community List/');
        x.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                //check if we found the community we are in
                if($scope.community == null) {
                    childSnapshot.forEach(function (item) {
                        //check if we are in the members section
                        if (item.key == "Members") {
                            //go through list and compare ID's
                            for (i = 0; i < item.val().length; i++) {
                                if (item.val()[i] == $scope.current_user.uid) {
                                    //update community key in scope and update the scope
                                    $scope.community = childSnapshot.key;
                                    $scope.$apply();
                                }
                            }
                        }
                    });
                }
                else{
                    //run populate posts
                    $scope.load_post();
                }
            });
        });
        if($scope.community == null){

        }

    };
    //post function
    $scope.load_post = function(){
        //go through database with the community name and get all post
        var refCurrentPostsRef = firebase.database().ref('/Community List/' + $scope.community + '/Post');
        refCurrentPostsRef.on('value', function(snapshot) {
            //put post in appropriate list and update page
            Object.values(snapshot.val()).forEach(function(element) {
                if (element.Priority) {
                    $scope.PriorityList.push(element);
                } else {
                    $scope.PostList.push(element);
                }
                $scope.$apply();
            });

        });
    };
    $scope.save_user_community = function(){
        try {
            // session code here
            sessionStorage.setItem("userID", $scope.current_user.uid);
            sessionStorage.setItem("community_id", $scope.community)
        }
        catch (e) {
            alert("some errror");
        }
    };
    //run get community function
    $scope.getCommunity();
}]);