$(document).ready(function() {
  // initialize the database
  var config = {
    apiKey: "AIzaSyDl3XzwDijfsqFMchoEqe-rBCqVfgbggIs",
    authDomain: "nuchibootcamper.firebaseapp.com",
    databaseURL: "https://nuchibootcamper.firebaseio.com",
    projectId: "nuchibootcamper",
    storageBucket: "nuchibootcamper.appspot.com",
    messagingSenderId: "348555228882"
  };
  firebase.initializeApp(config);
  var dB = firebase.database();
  // update time every 10 seconds
  updateTime();
  let updateinterval = setInterval(updateTime, 10000);
  function updateTime() {
    $("#trainList").empty();
    dB.ref("trainTime").on("child_added", function(snap) {
      let name = snap.val().name;
      let destination = snap.val().destination;
      let initialTrip = snap.val().initialTrip;
      let tripFrequency = snap.val().tripFrequency;
      let track = snap.val().track;
      let now = moment().format("h:mm a");
      $("#now").text(`The time is now ${now}`);
      let initialTripPastTense = moment(initialTrip, "HH:mm").subtract(
        1,
        "years"
      );
      let deltaTime = moment().diff(moment(initialTripPastTense), "minutes");
      let moduloTime = deltaTime % tripFrequency;
      let minutesAway = tripFrequency - moduloTime;
      let nextArrival = moment()
        .add(minutesAway, "minutes")
        .format("h:mm a");

      let postTrain = $("<tr>")
        .append($("<td>").text(name))
        .append($("<td>").text(destination))
        .append($("<td>").text(tripFrequency))
        .append($("<td>").text(nextArrival))
        .append($("<td>").text(minutesAway))
        .append($("<td>").text(track));
      $("#trainList").append(postTrain);
    });
  }

  $(document).on("click", "#makeItSo", function(e) {
    e.preventDefault();
    let newTrain = {};
    let name = $("#trainName")
      .val()
      .trim();
    let destination = $("#destination")
      .val()
      .trim();
    let initialTrip = $("#firstTrain")
      .val()
      .trim();
    let tripFrequency = $("#arrivalFrequency")
      .val()
      .trim();
    let track = Math.ciel(Math.random * 12);
    newTrain = {
      name: name,
      destination: destination,
      initialTrip: initialTrip,
      tripFrequency: tripFrequency,
      track: track
    };
    dB.ref("trainTime").push({
      name: name,
      destination: destination,
      initialTrip: initialTrip,
      tripFrequency: tripFrequency
    });
  });
});
