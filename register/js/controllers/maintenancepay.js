myApp.controller('MaintController', ['$scope','$location', function($scope,$location) {
  $scope.TransList =[];

    try{
        $scope.community = sessionStorage.getItem("community");
        console.log($scope.community);
    }
    catch(e){
        $scope.community = "null";
    }

  $scope.get_data = function(){
     var bill_amount = document.getElementById("bill_amount").value;
     var dat = document.getElementById("date").value;
      var desc = document.getElementById("description").value;
      var fully_payed = document.getElementById("fully").value;

      if(true){
          firebase.database().ref('Community List/' + $scope.community + '/Maintenance').push({
              bill_amount: bill_amount,
              Description: desc,
              date: dat,
              payed: fully_payed
          });
          $scope.TransList = [];
          $scope.get_trans();
      }


  }
  $scope.get_trans = function(){
      var x = firebase.database().ref('/Community List/' + $scope.community +"/Maintenance");
      x.once('value').then(function(snapshot){
          var items = snapshot.val();
          Object.values(snapshot.val()).forEach(function(item){
              $scope.TransList.push(item);
              console.log(item.Description);
              $scope.$apply();
          })
      });
  }
    $scope.get_trans();
}]);