var config = {
  apiKey: "AIzaSyB4Mpz4ECLl9RQU8kJZGg84j-EAcV7yKSA",
  authDomain: "communityconnect-3f395.firebaseapp.com",
  databaseURL: "https://communityconnect-3f395.firebaseio.com",
  storageBucket: "communityconnect-3f395.appspot.com",
};


var priority_list =[];

firebase.initializeApp(config);

//get_database_data();

function get_database_data(){

}
function save_to_list(item){
  priority_list.push(item);
}



function signin(e) {
  e.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    alert("Incorrect email or password!");
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  console.log(user)
});

angular.module('myApp', [])

    .controller('View1Ctrl', function ($scope, $http) {
        //priority List
        $scope.PriorityList = [];
        $scope.PostList = [];
        //$scope.PostList.push({name:"something"});
        //$scope.PriorityList = (get_database_data());
        var database = firebase.database();
        var The_Data = null;
        var dbRef = database.ref('Community List');
        dbRef.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                //console.log(childSnapshot.key); //gets community ID
                var childData = (childSnapshot.toJSON()); //converts data to json
                //change title of the page

                The_Data = childData;
                var post_keys = Object.keys(childData.Post);
                for(i=0; i < post_keys.length; i++){
                    var current_post = childData.Post[post_keys[i]];
                    //console.log(current_post);
                    if(current_post.Priority){
                        console.log("saving: " + current_post);
                        $scope.PriorityList.push(current_post);
                    }
                }

                var event_keys = Object.keys(childData.Events);
                for(i=0; i < event_keys.length; i++){
                    var current_event = childData.Events[event_keys[i]];
                    //console.log(current_event);
                }
                console.log(PriorityList);
            });

        });


    })
;
