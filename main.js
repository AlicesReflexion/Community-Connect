var config = {
  apiKey: "AIzaSyB4Mpz4ECLl9RQU8kJZGg84j-EAcV7yKSA",
  authDomain: "communityconnect-3f395.firebaseapp.com",
  databaseURL: "https://communityconnect-3f395.firebaseio.com",
  storageBucket: "communityconnect-3f395.appspot.com",
};
firebase.initializeApp(config);
 

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

function signOut() {
  firebase.auth().signOut().then(function() {
      console.log("Signed Out");
  });
}

function populateCommunities(userId) {
  var communityList;
  var communityNames = [];
  var template = "";
  firebase.database().ref('/User List/' + userId + "/Communities").once('value').then(function(snapshot) {
    communityList = Object.values(snapshot.toJSON());
    communityList.forEach(function(element) {
      firebase.database().ref('/Community List/' + element + '/Name').once('value').then(function(snapshot) {
        communityNames.push(snapshot.val());
        template += genFromTemplate("communitylist.html", [{"find": "CommunityID", "replace": element},{"find": "communityName", "replace": snapshot.val()}]);
        if (communityNames.length == communityList.length) {
          insertCommunities(template);
        }
      });
    });
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
