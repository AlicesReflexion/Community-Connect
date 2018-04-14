//firebase config
var config = {
    apiKey: "AIzaSyB4Mpz4ECLl9RQU8kJZGg84j-EAcV7yKSA",
    authDomain: "communityconnect-3f395.firebaseapp.com",
    databaseURL: "https://communityconnect-3f395.firebaseio.com",
    storageBucket: "communityconnect-3f395.appspot.com",
};
//Firebase initializing
firebase.initializeApp(config);
//get database
var database = firebase.database();
//create events list for population later
var events_list =[];
//database reference
var Ref = database.ref('Community List');
//name of the current community
var community = "-adfweofdkdubkx";

var user = firebase.auth().currentUser;
//verify user
if (user == null) {
    //redirect user to sign in page
    console.log("No User");
}

//function to get data asych from database and save to variables
function get_events() {
    //return the promise of the database
    return Ref.once('value').then(function(snapshot) {
        //go through every item of the community list
        snapshot.forEach(function(childSnapshot) {
            //check if we are at the correct community
            if(childSnapshot.key == -adfweofdkdubkx){
                //save the json data of that community
                var childData = (childSnapshot.toJSON());
                //save the keys for the event
                var event_keys = Object.keys(childData.Events);
                //go through events and add it to the event list (global)
                for(i=0; i < event_keys.length; i++){
                    //save event
                    var current_event = childData.Events[event_keys[i]];
                    //push it to list
                    events_list.push(current_event);
                }
            }
        });
        //return the promise.
        return snapshot.val();
    });
}

angular.module('myApp', [])
    .controller('View1Ctrl', function ($scope) {
        //make the event list for the page to udpate with
        $scope.EventList =[];
        get_events().then(function(successCallback, failureCallback){
            if(successCallback){
                //since we got a result
                //save the list to the page
                $scope.EventList = events_list;
                //update the page.
                $scope.$apply();
            }
        });

    })
;