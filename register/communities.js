function currentCommunity() {
  return sessionStorage.getItem('community');
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

function insertCommunities(template) {
  document.getElementsByClassName("communitiesBox")[0].innerHTML = template;
}

var completetemplate = "";
var communityList = "";
/* function populateCommunities(userId) {
  var communityNames = [];
  var template = "";
  firebase.database().ref('/users/' + userId + "/Communities").once('value').then(function(snapshot) {
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
  } */

function populateCommunities(userId) {
  var completetemplate = "";
  firebase.database().ref('/Community List').once('value').then(function(snapshot) {
    communityList = snapshot.toJSON();
    for (var community in communityList) {
      var obj = communityList[community];
      if (!Object.values(obj.Members).includes(userId)) {
        delete communityList[community];
      }
    }
    for (var community in communityList) {
      var obj = communityList[community]
      var template = genFromTemplate("communitylist.html", [{"find": "CommunityID", "replace": "\'" + community + "\'"},{"find": "communityName", "replace": obj.Name}]);
      completetemplate += template;
    }
    insertCommunities(completetemplate);
    });
}

function toggleCommunities(e) {
  e.preventDefault();
  var communityBox = document.getElementsByClassName("communitiesBox")[0];
  if (communityBox.style.transform == "scaleY(1)") {
    communityBox.style.transform = "scaleY(0)"
  } else communityBox.style.transform = "scaleY(1)";
}

function setCommunity(e, communityId) {
  e.preventDefault();
  sessionStorage['community'] = communityId;
  location.reload();
}
