$(document).ready(function () {
    var map = L.map('map').setView([0, 0], 13);
    var marker;
    var startMarker
    var watchId;
    var velocity = { x: 0, y: 0, z: 0 }; // Initialize velocity
    var displacement = { x: 0, y: 0, z: 0 }; // Initialize displacement
    var previousTimestamp = null; // Variable to store the previous timestamp
    var stationaryThreshold = 0.1; // Define stationary threshold (adjust as needed)
    var greenIcon = L.icon({
        iconUrl: 'assets/marker.png',
    
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [19, 50], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
    };

    // Add Tile layer for map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([0, 0]).addTo(map).bindPopup("You are here");

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
        $("#orientationData").html("<br>heading: " + heading + "<br>Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }


    async function handleMotion(event) {
        if (previousTimestamp === null) {
            previousTimestamp = event.timeStamp; // Set initial timestamp
        }
        var acceleration = event.acceleration;
        var currentTimestamp = event.timeStamp; // Get current timestamp
        var deltaTime = (currentTimestamp - previousTimestamp) / 1000; // Convert milliseconds to seconds
    
        // Calculate acceleration magnitude
        var accelerationMagnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);
    
        if (accelerationMagnitude < stationaryThreshold) {
            // Reset velocity to zero if device is stationary
            velocity.x = 0;
            velocity.y = 0;
            velocity.z = 0;
        } else {
            // Integrate acceleration to calculate velocity, accounting for negative acceleration
            velocity.x += acceleration.x * deltaTime;
            velocity.y += acceleration.y * deltaTime;
            velocity.z += acceleration.z * deltaTime;
            
            // Ensure velocity does not go below zero
            velocity.x = Math.max(velocity.x, 0);
            velocity.y = Math.max(velocity.y, 0);
            velocity.z = Math.max(velocity.z, 0);
    
            // Calculate displacement
            displacement.x += velocity.x * deltaTime;
            displacement.y += velocity.y * deltaTime;
            displacement.z += velocity.z * deltaTime;
        }
    
        var speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2); // Calculate speed
    
        previousTimestamp = currentTimestamp; // Update previous timestamp
    
        $("#motionSpeed").html("Motion Data Speed: " + speed.toFixed(2) + " m/s");
        // Display acceleration data
        $("#motionData").html("Acceleration: <br>x: " + acceleration.x + "<br>y: " + acceleration.y +
         "<br>z: " + acceleration.z + "<br>Velocity x: " + velocity.x + "<br>Velocity y: " + velocity.y + "<br>Velocity z: " +
          velocity.z + "<br>Displacement x: " + displacement.x + "<br>Displacement y: " + displacement.y + "<br>Displacement z: " + displacement.z + "<br>Delta time: " + deltaTime + "<br>Current timestamp: " + currentTimestamp + "<br>Previous timestamp: " + previousTimestamp); 
    }
    

    function handleMotionError(event) {
        $("#motionData").html("Error: " + event.error.message);
    }

    // Function to handle geolocation data
    function handleGeolocation(position) {
        var speed = position.coords.speed;
        var latlng = [position.coords.latitude, position.coords.longitude];
        marker.setLatLng(latlng).update();
        map.setView(latlng);
        if(typeof startMarker == 'undefined'){
            startMarker = L.marker([position.coords.latitude, position.coords.longitude], {icon: greenIcon}).addTo(map);
        }  

        

        // Display geolocation data
        $("#geolocationData").html("<br>Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);

        // Display current speed
        if (speed !== null && !isNaN(speed)) {
            var speed = position.coords.speed;
            console.log("Current speed:", speed, "m/s");
            $("#speed").html("<br>Speed: " + speed.toFixed(2) + " m/s");
        } else {
            console.log("Current speed:", speed, "m/s");
            $("#speed").html("Current speed not available, but it is: " + speed);
        }
    }

    // Function to handle geolocation errors
    function handleError(error) {
        // Handle error
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    $("#requestOrientationPermissionButton").click(function () {
        // Check if the device supports DeviceOrientationEvent
        if (window.DeviceOrientationEvent) {
            $("#orientation").text("Device orientation supported.");
            // Check if we need to request permission (iOS 13+)
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                $("#orientationInfo").text("Requesting permission for DeviceOrientation");
                console.log("Requesting permission for DeviceOrientation");
                // Request permission
                // The request permission is only needed for iOS 13+ devices and it is only available in Safari.
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            $("#permission").text("Permission granted for DeviceOrientation");
                            // Permission granted, add event listener
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            $("#permission").text("Permission not granted for DeviceOrientation");
                            console.log("Permission not granted for DeviceOrientation");
                            // Permission not granted
                            alert('Permission not granted for DeviceOrientation');
                        }
                    })
                    .catch(console.error);
            } else {
                $("#orientationInfo").text("No need to request permission for DeviceOrientation");
                console.log("No need to request permission for DeviceOrientation");
                // No need to request permission, add event listener directly
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } else {
            $("#orientation").text("Device orientation not supported.");
        }
    });

    // Request permission for DeviceMotion
    $("#requestMotionPermissionButton").click(function () {
        if (window.DeviceMotionEvent) {
            $("#motion").text("Device motion supported.");
            if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleMotion, handleMotionError);
                    }
                    else {
                        alert('Permission not granted for DeviceMotion');
                    }
                }).catch(console.error);
            }
            else {
                $("#motionInfo").text("No need to request permission for DeviceMotion");
                window.addEventListener('devicemotion', handleMotion, handleMotionError);
            }
        }
        else {
            $("#motionInfo").text("Device motion not supported.");
        }
    });


    // Stops trtackiing the users geolocation
    $("#stopGeolocation").click(function () {
        navigator.geolocation.clearWatch(watchId);
        $("#geolocationData").text("Geolocation data stopped.");
        $("#startGeolocation").prop("disabled", false);
    });

    // Starts tracking the users geolocation
    $("#startGeolocation").click(function () {
        startGeolocation();
    });

    // Function to start geolocation
    function startGeolocation() {
        // Get geolocation data once
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
            
        } else {
            // Geolocation not supported
            $("#geolocationData").text("Geolocation not supported.");
        }
    }

    // Get geolocation data continuously
    if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
        $("#startGeolocation").prop("disabled", true);
    } else {
        // Geolocation not supported
        $("#geolocationData").text("Geolocation not supported.");
    }
});
