const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//
const cors = require('cors')({origin: true});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

exports.helloWorld = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    var idToken = request.body.idToken;
    var community = request.body.communityId;
    var time = Math.floor(Date.now()/1000);
    var postNum = 'post' + Math.random().toString(36).substring(7);
    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {
      admin.database().ref('/Community List/' + community + '/Members').once('value').then(function(snapshot) {
        var members = snapshot.val();
        var post = {
          Creator: {
            UserID: decodedToken.uid
          },
          Priority: request.body.priority,
          Timestamp: time,
          Title: request.body.postText
        }
        if (members.includes(decodedToken.uid)) {
          if (request.body.priority == false) {
          admin.database().ref('/Community List/' + community + '/Post/' + postNum).set(post); 
          response.status(200).send("success");
          } else {
            admin.database().ref('/Community List/' + community + '/Admin').once('value').then(function(snapshot) {
              var admins = snapshot.val();
              if (admins.includes(decodedToken.uid)) {
                admin.database().ref('/Community List/' + community + '/Post/' + postNum).set(post);
                response.status(200).send("success");
              } else {
                response.status(400).send("Only admins can post priority posts!")
        }
            });
          }
        } else {
          response.status(400).send("Not a member of this community!");
        }
      });
    });
  });
});
