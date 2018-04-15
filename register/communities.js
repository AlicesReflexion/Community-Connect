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
  }

function toggleCommunities(e) {
  e.preventDefault();
  var communityBox = document.getElementsByClassName("communitiesBox")[0];
  if (communityBox.style.transform == "scaleY(1)") {
    communityBox.style.transform = "scaleY(0)"
  } else communityBox.style.transform = "scaleY(1)";
}
