myApp.controller('SuccessController', ['$rootScope','$scope', '$location', '$firebaseAuth','$firebaseObject', function($rootScope, $scope, $location, $firebaseAuth,$firebaseObject) {
  $scope.message = "Congratulations on joining CommunityConnect Portal!!!";

  var ref = firebase.database().ref();
  var auth = $firebaseAuth();
  var user = firebase.auth().currentUser;

    $scope.PriorityList=[];
    $scope.PostList =[];
    $scope.current_user =null;
    $scope.community=null;
    $scope.community = sessionStorage.getItem("community");
    $scope.userid = user.uid;
    $scope.current_user = "null";
    firebase.database().ref('/Community List/' + $scope.community + '/Name/').once('value').then(function(snapshot) {
    $scope.communityName = snapshot.val();
    });

    try{
        $scope.community = sessionStorage.getItem("community");
        console.log($scope.community);
    }
    catch(e){
        $scope.community = "null";
    }

    try{
        $scope.userid = sessionStorage.getItem("userID");
        console.log($scope.userid);
    }
    catch(e){
        $scope.userid = "null";
    }


    //var user = $rootScope.currentUser;
  $scope.go_events_page = function(){
      $scope.save_user_data();
      $location.path('/events');

  };

  $scope.publishPost = function(e) {
    var postText = e.target.parentElement.children[0].children[0].value;
    console.log(postText);
    user.getIdToken(true).then(function(idToken) {
      var request = new XMLHttpRequest();

      request.open('POST', 'https://us-central1-communityconnect-3f395.cloudfunctions.net/helloWorld', true);
      request.setRequestHeader('Content-Type', 'application/json');
      request.onload = function() {
        console.log(request.responseText);
      }
      var send = {"idToken": idToken, "postText": postText, "communityId": $scope.community};
      request.send(JSON.stringify(send));
  });
  };

    $scope.new_community = function(){
        $scope.save_user_data();
        $location.path('/community_create');
    }

   //get community
    $scope.getCommunity = function(){
        console.log("Started", $scope.community == null);
        //go through database and see if we are apart of the community
        var x = firebase.database().ref('/Community List/');
        x.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                //check if we found the community we are in
                if($scope.community === "null" || $scope.community == null) {
                    childSnapshot.forEach(function (item) {
                        //check if we are in the members section
                        if (item.key === "Members") {
                            //go through list and compare ID's
                            for (i = 0; i < item.val().length; i++) {
                                if (item.val()[i] === $scope.userid) {
                                    //update community key in scope and update the scope
                                    $scope.community = childSnapshot.key;
                                    $scope.$apply();
                                    console.log("Member!");
                                    break;
                                }
                            }
                        }
                    });
                }
                else{
                    console.log("Running Get Post");
                    //run populate posts
                    $scope.load_post();
                }
            });
            console.log("checking rediriect", $scope.community);
            if($scope.community === "null" || $scope.community == null){
                console.log("redirecting");
                $scope.new_community();
                $scope.$apply();
            }
        });


    };
    //post function
    $scope.load_post = function(){
        //go through database with the community name and get all post
        if($scope.community == null){
            //console.log($scope.community);
            return;
        }
        else{
            var refCurrentPostsRef = firebase.database().ref('/Community List/' + $scope.community + '/Post');
            refCurrentPostsRef.once('value').then(function(snapshot) {
                //put post in appropriate list and update page
                try{
                    Object.values(snapshot.val()).forEach(function(element) {
                        if (element.Priority) {
                            $scope.PriorityList.push(element);
                        } else {
                            $scope.PostList.push(element);
                        }
                        $scope.$apply();
                    });
                }
                catch(e){
                    console.log("No Post");
                }


            });
        }

    };
    $scope.save_user_data = function(){
        try {
            // session code here
            sessionStorage.setItem("userID", $scope.current_user.uid);
            sessionStorage.setItem("community", $scope.community);
        }
        catch (e) {
            sessionStorage.clear();
        }
    };

    if($scope.userid !== "null" && $scope.userid !== null){
        //run get community function
        console.log("getting community", $scope.userid);
        sessionStorage.setItem('community', "null");
        $scope.getCommunity();
    }
    else{
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $scope.current_user = user;
                $scope.userid = user.uid;
                $scope.$apply();
                sessionStorage.setItem('community', "null");
                $scope.getCommunity();

            } else {
                // No user is signed in.
                console.log("waiting for user...");
            }
        });
    }
}]);
