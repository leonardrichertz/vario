$(document).ready(function(){
    // Function to handle device orientation data
    function handleOrientation(event) {
        var absolute = event.absolute;
        var alpha    = event.alpha; // rotation around z-axis
        var beta     = event.beta;  // rotation around x-axis
        var gamma    = event.gamma; // rotation around y-axis

        // Display device orientation data
        $("#orientationData").html("Absolute: " + absolute + "<br>Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }

    // Check if the device supports DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
        // Add event listener for device orientation
        window.addEventListener('deviceorientation', handleOrientation, false);
    } else {
        // Device orientation not supported
        $("#orientationData").html("Device orientation not supported.");
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

    // Get geolocation data continuously
    if (navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError);
    } else {
        // Geolocation not supported
        $("#geolocationData").html("Geolocation not supported.");
    }

    // Hide paragraph with id="test" when button is clicked
    $("button").click(function(){
        $("#test").hide();
    });
});