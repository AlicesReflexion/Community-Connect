myApp.controller('CreateController', ['$scope','$firebaseObject','$location', function($scope, $firebaseObject, $location) {


    $scope.back_suc = function(){
        // try {
        //     sessionStorage.setItem("community", $scope.community)
        // }
        // catch (e) {
        //     sessionStorage.clear();
        // }
        $location.path('/success');
    };

    try{
        $scope.userid = sessionStorage.getItem("userID");
    }
    catch(e){
        $scope.back_suc();
    }

    if($scope.userid === null || $scope.userid === undefined){
        $scope.back_suc();
    }

    $scope.create_community = function() {
        if($scope.userid !== null || $scope.userid === undefined){
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
