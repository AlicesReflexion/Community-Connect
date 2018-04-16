myApp.controller('SuccessController', ['$rootScope','$scope', '$location', '$firebaseAuth','$firebaseObject', function($rootScope, $scope, $location, $firebaseAuth,$firebaseObject) {
  $scope.message = "Congratulations on joining CommunityConnect Portal!!!";

  var ref = firebase.database().ref();
  var auth = $firebaseAuth();
  var user = firebase.auth().currentUser;

    $scope.PriorityList=[];
    $scope.PostList = [];
    $scope.community = sessionStorage.getItem("community");
    $scope.userid = user.uid;
    $scope.UEmail = user.email;

    $scope.Admin = false;
    $scope.Member = false;
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

  $scope.go_admin_page = function(){
      $scope.save_user_data();
      $location.path('/admin');
      //$scope.$apply();

  };
    $scope.go_to_Maintain = function(){
        $scope.save_user_data();
        $location.path('/Maintain');
        $scope.$apply();
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
        $scope.load_post();
      };

      var send = {"idToken": idToken, "postText": postText, "communityId": $scope.community, "priority": e.target.parentElement.children[0].children[1].children[1].checked};
      request.send(JSON.stringify(send));
    });
  };

  $scope.go_to_request = function(){
      console.log("Requesting");
      $scope.save_user_data();
      $location.path('/request_page');
      //$scope.$apply();
  }


    $scope.new_community = function(){
        $scope.save_user_data();
        $location.path('/community_create');
        $scope.$apply();
    }

   //get community
    $scope.getCommunity = function(community){
        console.log("Started", community !== null);
        //go through database and see if we are apart of the community
        if(community === null || community === undefined){
            var x = firebase.database().ref('/Community List/');
            x.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    //check if we found the community we are in
                    if($scope.community === "null" || $scope.community == null) {
                        try{
                            var adminlist = Object.keys(childSnapshot.val().Admin);
                            for(i = 0; i< adminlist.length; i++){
                                if (childSnapshot.val().Admin[adminlist[i]] === $scope.userid) {
                                    console.log("checking admin", childSnapshot.val().Admin);
                                    //update community key in scope and update the scope
                                    $scope.community = childSnapshot.key;
                                    $scope.Admin = true;
                                    $scope.Member =true;
                                    $scope.$apply();
                                    console.log("Admin!");
                                }
                            }
                            if(!$scope.Admin){
                                console.log("checking members", childSnapshot.val().Members);
                                var memberlist = Object.keys(childSnapshot.val().Members);
                                for(i = 0; i< memberlist.length; i++){
                                    console.log(childSnapshot.val().Members[memberlist[i]] === $scope.userid);
                                    if (childSnapshot.val().Members[memberlist[i]] === $scope.userid) {
                                        //update community key in scope and update the scope
                                        $scope.community = childSnapshot.key;
                                        $scope.Member = true;
                                        $scope.$apply();
                                        console.log("Member!", $scope.community);
                                    }
                                }
                            }
                        }
                        catch(e){
                            console.log("Error when checking membership" + e);
                            //$scope.member=true;
                        }

                    }
                    else {
                    }
                });
                console.log("checking rediriect", $scope.community);
                if($scope.community === "null" || $scope.community == null){

                }
                else{
                    console.log("Running Get Post");

                    $scope.load_post();
                }
            });
        }
        else{
            console.log("Community is already set");
            var x = firebase.database().ref('/Community List/' + community +"/Admin");
            x.once('value').then(function(snapshot){
                console.log(snapshot.val());
                try{
                    var adminlist = snapshot.val();
                    for(i = 0; i< adminlist.length; i++){
                        if (adminlist[i] === $scope.userid) {
                            //update community key in scope and update the scope
                            $scope.community = community;
                            $scope.Admin = true;
                            $scope.Member =true;
                            $scope.$apply();
                            console.log("Admin!");
                        }
                    }
                }catch(e){
                    console.log("Error");
                    $scope.getCommunity();
                }
            });
            $scope.load_post();
        }


    };
    //post function
    $scope.load_post = function(){
        $scope.PriorityList = [];
        $scope.PostList = [];
        //$scope.$apply();
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
                      console.log(element.Creator.UserID);
                      firebase.database().ref('/users/' + element.Creator.UserID + '/firstname').once('value').then(function(usernameshot) {
                        console.log(usernameshot.val());
                        element.Creator.UserID = usernameshot.val();
                        if (element.Priority) {
                            $scope.PriorityList.push(element);
                        } else {
                            $scope.PostList.push(element);
                        }
                        $scope.$apply();
                      });
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
            sessionStorage.setItem("UEamil", $scope.UEmail);
            sessionStorage.setItem("userID", $scope.userid);
            sessionStorage.setItem("community", $scope.community);
        }
        catch (e) {
            sessionStorage.clear();
        }
    };

    if($scope.userid !== "null" && $scope.userid !== null){
        //run get community function
        console.log("getting community", $scope.community);
        sessionStorage.setItem('community', "null");
        $scope.getCommunity($scope.community);
    }
    else{
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $scope.userid = user.uid;
                $scope.UEmail = user.email;
                $scope.$apply();
                console.log("Community is set to: " +$scope.community);
                sessionStorage.setItem('community', "null");
                $scope.getCommunity($scope.community);

            } else {
                // No user is signed in.
                console.log("waiting for user...");
            }
        });
    }
}]);
