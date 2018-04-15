myApp.controller('RequestController', ['$scope','$firebaseObject','$location', function($scope, $firebaseObject, $location) {

    try{
        $scope.userid = sessionStorage.getItem("userID");
    }
    catch(e){
        $scope.back_suc();
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
                    firebase.database().ref('Community List/'+childSnapshot.key+"/RequestList/").push($scope.userid);
                }
                console.log(childSnapshot.val().Name);

            });
        });
    }

}]);
