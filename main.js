var config = {
  apiKey: "AIzaSyB4Mpz4ECLl9RQU8kJZGg84j-EAcV7yKSA",
  authDomain: "communityconnect-3f395.firebaseapp.com",
  databaseURL: "https://communityconnect-3f395.firebaseio.com",
  storageBucket: "communityconnect-3f395.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();
var priority_list=[];
var normal_list=[];

var Ref = database.ref('Community List');


function get_data() {
    console.log(Date.now());
    return Ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var childData = (childSnapshot.toJSON());
            var post_keys = Object.keys(childData.Post);
            for(i=0; i < post_keys.length; i++){
                var current_post = childData.Post[post_keys[i]];
                //console.log(current_post);
                if(current_post.Priority){
                    priority_list.push(current_post);
                }
                else{
                    normal_list.push(current_post);
                }
            }
            var event_keys = Object.keys(childData.Events);
            for(i=0; i < event_keys.length; i++){
                var current_event = childData.Events[event_keys[i]];
                //console.log(current_event);
            }
        });
        return snapshot.val();
    });
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

    .controller('View1Ctrl', function ($scope) {
        $scope.PriorityList=[];
        get_data().then(function(successCallback, failureCallback){
            if(successCallback){
                $scope.PriorityList = priority_list;
                $scope.PostList = normal_list;

                $scope.$apply();
            }
        });

function grabPosts(community) {
  var posts = firebase.database().ref('/Community List/' + community + "/Post");
  posts.on('value', function(snapshot) {
    snapshot.forEach(function (element) {
      var text = element.toJSON().Title;
      var username = element.toJSON().Creator.Name;
      var template = genFromTemplate("posts.html", [{"find": "Post Text", "replace": text},{"find": "User Name", "replace": username}]);
      console.log(template); 
    });
    });
}
