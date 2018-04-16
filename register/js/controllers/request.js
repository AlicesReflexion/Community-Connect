myApp.controller('RequestController', ['$scope','$firebaseObject','$location', function($scope, $firebaseObject, $location) {
    $scope.found = false;
    try{
        $scope.userid = sessionStorage.getItem("userID");
        $scope.UEmail = sessionStorage.getItem("UEamil");
        console.log($scope.UEmail);
    }
    catch(e){
        //$scope.back_suc();
    }
    $scope.added =function () {
        //redirect back to home;
        console.log("going back");
        $location.path("/success");
        $scope.$apply();
    }

    $scope.join_community = function(){
        if($scope.userid === null || $scope.userid ===undefined){
            console.log("Not logged in!");
        }
        var name = $scope.Community.Name;

        var x = firebase.database().ref('/Community List/');
        x.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if(childSnapshot.val().Name == name){
                    $scope.found = true;
                    firebase.database().ref('Community List/'+childSnapshot.key+"/RequestList").push(
                        {
                            Email: $scope.UEmail,
                            UID: $scope.userid
                        }
                    );
                    console.log("Requesting done");
                    $scope.added();
                }
                //console.log(childSnapshot.val().Name);

            });
        });
    }

}]);
