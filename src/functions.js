$(document).ready(function () {
    $("#start").text("Device orientation and geolocation data");
    // Function to handle device orientation data
    function handleOrientation(event) {
        var alpha;
        if (typeof event.webkitCompassHeading !== "undefined") {
            alpha = event.webkitCompassHeading; //iOS non-standard
            var heading = alpha
            $("#webkit").text(heading.toFixed([0]));
            $("#orientationData").html("Supported webkitCompassHeading");
        }
        else {
            var heading = 360 - alpha; //heading [0, 360)
            $("#orientationData").html("Not supported webkitCompassHeading");
        }

        alpha = Math.round(alpha * 100) / 100; // Normalize value

        var beta = Math.round(event.beta * 100) / 100;  // rotation around x-axis
        var gamma = Math.round(event.gamma * 100) / 100; // rotation around y-axis

        $("#compass").css("transform", "rotate(" + alpha + "deg)");

        // Display device orientation data
        $("#orientationData").html( "<br>heading: " + heading + "<br>Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
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
        $("#orientation").text("Device orientation supported.");
        // Check if we need to request permission (iOS 13+)
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            console.log("Requesting permission for DeviceOrientation");
            // Request permission
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        console.log("Permission granted for DeviceOrientation");
                        // Permission granted, add event listener
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        console.log("Permission not granted for DeviceOrientation");
                        // Permission not granted
                        alert('Permission not granted for DeviceOrientation');
                    }
                })
                .catch(console.error);
        } else {
            console.log("No need to request permission for DeviceOrientation");
            // No need to request permission, add event listener directly
            window.addEventListener('deviceorientation', handleOrientation);
        }
    } else {
        $("#orientation").text("Device orientation not supported.");
        alert('Your device does not support DeviceOrientation');
    }

    // Get geolocation data continuously
    if (navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError);
    } else {
        // Geolocation not supported
        $("#geolocationData").text("Geolocation not supported.");
    }
});
