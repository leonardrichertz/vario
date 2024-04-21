$(document).ready(function(){
    $("#start").text("Device orientation and geolocation data");
    // Function to handle device orientation data
    function handleOrientation(event) {
        var alpha;
        if (typeof event.webkitCompassHeading !== "undefined") {
            alpha = event.webkitCompassHeading; //iOS non-standard
            var heading = alpha
            $("#webkit").text(heading.toFixed([0]));
          }
          else {
            alert("Your device is reporting relative alpha values, so this compass won't point north! ");
            var heading = 360 - alpha; //heading [0, 360)
            $("#webkit").text(heading.toFixed([0]));
          }
        
        alpha = Math.round(alpha * 100) / 100; // Normalize value
        
        var beta     = Math.round(event.beta * 100) / 100;  // rotation around x-axis
        var gamma    = Math.round(event.gamma * 100) / 100; // rotation around y-axis
        var heading  = 360 - alpha; //calculates the relation to north

        $("#compass").css("transform", "rotate(" + alpha + "deg)");

        // Display device orientation data
        $("#orientationData").html("<br>Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }

    // Function to handle geolocation data
    function handleGeolocation(position) {
        // Display geolocation data
        $("#geolocationData").html("<br>Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    }

    // Function to handle geolocation errors
    function handleError(error) {
        // Handle error
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    // Check if the device supports DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
        // Add event listener for device orientation
        console.log("Device orientation supported.");
        $("#orientation").text("Device orientation supported.");
        window.addEventListener('deviceorientation', handleOrientation, false);
    } else {
        // Device orientation not supported
        console.log("Device orientation not supported.");
        $("#orientation").text("Device orientation not supported.");
    }

    // Get geolocation data continuously
    if (navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError);
    } else {
        // Geolocation not supported
        $("#geolocationData").text("Geolocation not supported.");
    }
});
