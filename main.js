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
    return Ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var childData = (childSnapshot.toJSON());
          console.log(childData);
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
            //var event_keys = Object.keys(childData.Events);
            //for(i=0; i < event_keys.length; i++){
                //var current_event = childData.Events[event_keys[i]];
                //console.log(current_event);
            //}
        });
        return snapshot.val();
    });
}

function get_posts() {
  var currentPostsRef = firebase.database().ref('/Community List/' + currentCommunity() + '/Post');
  currentPostsRef.on('value', function(snapshot) {

  });
}



function currentCommunity() {
  return sessionStorage.getItem('community');
}


function signin(e) {
  e.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    alert("Incorrect email or password!");
  });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.replace("dashboard.html");
  }
});
}
  
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
    });

function signOut() {
  firebase.auth().signOut().then(function() {
      console.log("Signed Out");
  });
}

function setCommunity(e, communityId) {
  e.preventDefault();
  sessionStorage['community'] = communityId;
  location.reload();
}


var completetemplate = "";
var communityList = "";
function populateCommunities(userId) {
  var communityNames = [];
  var template = "";
  firebase.database().ref('/User List/' + userId + "/Communities").once('value').then(function(snapshot) {
    communityList = Object.values(snapshot.toJSON());
    communityList.forEach(function(element) {
      firebase.database().ref('/Community List/' + element + '/Name').once('value').then(function(snapshot) {
        communityNames.push(snapshot.val());
        template += genFromTemplate("communitylist.html", [{"find": "CommunityID", "replace": "\'" + element + "\'"},{"find": "communityName", "replace": snapshot.val()}]);
        completetemplate += template;
        if (communityNames.length == communityList.length) {
          insertCommunities(completetemplate);
        }
      });
    });
  });
  firebase.database().ref('/User List/' + userId + "/Name").once('value').then(function(snapshot) {
    var header = document.getElementsByClassName("header")[0].innerHTML;
    header = header.replace("{{User Name}}", snapshot.val());
    document.getElementsByClassName("header")[0].innerHTML = header;
  });
  firebase.database().ref('/Community List/' + currentCommunity() + "/Name").once('value').then(function(snapshot) {
    var header = document.getElementsByClassName("header")[0].innerHTML;
    header = header.replace("{{Community Name}}", snapshot.val());
    document.getElementsByClassName("header")[0].innerHTML = header;
  });
}

function insertCommunities(template) {
  document.getElementsByClassName("communitylist")[0].innerHTML = template;
}

function genFromTemplate(template, FindAndReplaceArr) {
  var request = new XMLHttpRequest();
  request.open('GET', template, false);
  var template = ""; 
  request.onload = function() {
    template = request.responseText;
    FindAndReplaceArr.forEach(function(element) {
      template = template.replace("{{" + element.find + "}}", element.replace);
    });
  }
  request.send();
  return template;
}

function toggleCommunities() {
  if (document.getElementsByClassName("communitylist")[0].style.display == "block") {
    document.getElementsByClassName("communitylist")[0].style.display = "none"; } else {
    document.getElementsByClassName("communitylist")[0].style.display = "block"; }
}
