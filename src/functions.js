$(document).ready(function(){
    $("#start").html("Device orientation and geolocation data");
    // Function to handle device orientation data
    function handleOrientation(event) {
        var alpha;
        if (event.webkitCompassHeading !== undefined) {
            alpha = event.webkitCompassHeading; // iOS
        } else {
            alpha = event.alpha; // non-iOS
        }
        
        alpha = Math.round(alpha * 100) / 100; // Normalize value
        
        var beta     = Math.round(event.beta * 100) / 100;  // rotation around x-axis
        var gamma    = Math.round(event.gamma * 100) / 100; // rotation around y-axis

        $("#compass").css("transform", "rotate(" + alpha + "deg)");

        // Display device orientation data
        $("#orientationData").html("Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }

    // Function to handle geolocation data
    function handleGeolocation(position) {
        // Display geolocation data
        $("#geolocationData").html("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    }

    // Function to handle geolocation errors
    function handleError(error) {
        // Handle error
        $("#geolocationData").html("Geolocation error: " + error.message);
    }

    // Check if the device supports DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
        // Add event listener for device orientation
        console.log("Device orientation supported.");
        window.addEventListener('deviceorientation', handleOrientation, false);
    } else {
        // Device orientation not supported
        console.log("Device orientation not supported.");
        $("#orientationData").html("Device orientation not supported.");
    }

    // Get geolocation data continuously
    if (navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError);
    } else {
        // Geolocation not supported
        $("#geolocationData").html("Geolocation not supported.");
    }
});
