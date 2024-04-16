$(document).ready(function(){
    // Function to handle device orientation data
    function handleOrientation(event) {
        var absolute = Math.round(event.absolute * 100) / 100;  
        var alpha    = Math.round(event.alpha * 100) / 100; // rotation around z-axis
        var beta     = Math.round(event.beta * 100) / 100;  // rotation around x-axis
        var gamma    = Math.round(event.gamma * 100) / 100; // rotation around y-axis
        console.log($("#compass"))
        $("#compass").css("transform", "rotate(" + alpha + "deg)");

        // Display device orientation data
        $("#orientationData").html("Absolute: " + absolute + "<br>Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
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

    // Function to handle device motion data
    // function handleDeviceMotion(event) {
    //     var acceleration = event.acceleration;
    //     var accelerationIncludingGravity = event.accelerationIncludingGravity;
    //     var rotationRate = event.rotationRate;
    //     console.log(acceleration, accelerationIncludingGravity, rotationRate)

    //     // Display device motion data
    //     $("#deviceMotionData").html("Acceleration: " + JSON.stringify(acceleration) + "<br>Acceleration including gravity: " + JSON.stringify(accelerationIncludingGravity) + "<br>Rotation rate: " + JSON.stringify(rotationRate));
    // }

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

    // // Toggle device motion data display
    // $("#toggleButton").click(function(){
    //     $("#deviceMotionData").toggle();
    // });

    // // Listen for device motion events
    // window.addEventListener('devicemotion', handleDeviceMotion, false);
});