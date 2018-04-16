myApp.controller('AdminController', ['$scope','$firebaseObject','$location', function($scope, $firebaseObject, $location,$compile) {

    try{
        $scope.community = sessionStorage.getItem("community");
        console.log($scope.community);
    }
    catch(e){
        $scope.community = "null";
    }

    $scope.RequestList = [];

    $scope.AcceptUser = function(item){
        var add_member = firebase.database().ref('/Community List/' + $scope.community +"/Members/");
        add_member.push(item.UID);
        var x = firebase.database().ref('/Community List/' + $scope.community +"/RequestList/"+item.key);
        x.remove();
        $scope.RequestList.splice(item.id, 1);
        console.log(item.id);
    };
    $scope.DeclineUser= function(item){
        var x = firebase.database().ref('/Community List/' + $scope.community +"/RequestList/"+item.key);
        x.remove();
        $scope.RequestList.splice(item.id, 1);
    };

    $scope.get_items =function(){
        var x = firebase.database().ref('/Community List/' + $scope.community +"/RequestList");
        x.once('value').then(function(snapshot) {
            console.log(Object.keys(snapshot.val()));
            var item_keys = Object.keys(snapshot.val());
            console.log(item_keys);
            for(i = 0; i < item_keys.length; i++){
                var item = snapshot.val()[item_keys[i]];
                item.key = item_keys[i];
                item.id = i;
                console.log(item);
               $scope.RequestList.push(item);
               $scope.$apply();
            }

        });
    };
    $scope.get_items();


}]);
