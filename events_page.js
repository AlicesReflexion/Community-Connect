var config = {
    apiKey: "AIzaSyB4Mpz4ECLl9RQU8kJZGg84j-EAcV7yKSA",
    authDomain: "communityconnect-3f395.firebaseapp.com",
    databaseURL: "https://communityconnect-3f395.firebaseio.com",
    storageBucket: "communityconnect-3f395.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

var events_list =[];

var Ref = database.ref('Community List');

function get_events() {
    return Ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = (childSnapshot.toJSON());
            var event_keys = Object.keys(childData.Events);
            for(i=0; i < event_keys.length; i++){
                var current_event = childData.Events[event_keys[i]];
                events_list.push(current_event);
            }
        });
        return snapshot.val();
    });
}

angular.module('myApp', [])

    .controller('View1Ctrl', function ($scope) {
        $scope.EventList =[];
        get_events().then(function(successCallback, failureCallback){
            if(successCallback){
                $scope.EventList = events_list;

                $scope.$apply();
            }
        });

    })
;