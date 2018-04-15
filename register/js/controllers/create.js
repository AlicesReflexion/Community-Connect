myApp.controller('CreateController', ['$scope','$firebaseObject','$location', function($scope, $firebaseObject, $location) {

    $scope.back_suc = function(){
        try {
            // session code here
            sessionStorage.setItem("community_id", $scope.community)
        }
        catch (e) {
            sessionStorage.clear();
        }
        $location.path('/success');
    };

    try{
        $scope.userid = sessionStorage.getItem("userID");
    }
    catch(e){
        $scope.back_suc();
    }
    if($scope.userid === null){
        $scope.back_suc();
    }
    $scope.create_community = function() {
        if($scope.userid !== null){
            //console.log("Creatng!", $scope.Community.Community_Desciption);
            firebase.database().ref('Community List/').push({
                Name: $scope.Community.Name,
                Description: $scope.Community.Community_Desciption,
                Admin: [$scope.userid],
                Members: [$scope.userid]
            });
            $scope.back_suc();
        }
    }


}]);
