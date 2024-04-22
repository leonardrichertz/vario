

$(document).ready(function () {
    var map = L.map('map').setView([0, 0], 13);

    // Add Tile layer for map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

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

    function updateLocationOnMap(position) {
        var latlng = [position.coords.latitude, position.coords.longitude];
        map.setView(latlng);
        L.marker(latlng).addTo(map)
    }

    function handleMotion(event) {
        // Display acceleration data
        $("#motionData").html("Acceleration: <br>x: " + event.acceleration.x + "<br>y: " + event.acceleration.y + "<br>z: " + event.acceleration.z);
    }

    // Function to handle geolocation data
    function handleGeolocation(position) {

        updateLocationOnMap(position);
        // Display geolocation data
        $("#geolocationData").html("<br>Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    }

    // Function to handle geolocation errors
    function handleError(error) {
        // Handle error
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    $("#requestPermissionButton").click(function() {
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
        if (window.DeviceMotionEvent) {
            $("#motion").text("Device motion supported.");
            if (typeof(DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function'){
                DeviceMotionEvent.requestPermission().then(response => {
                    if (response == 'granted') {
                        window.addEventListener('devicemotion', (e) => {
                            // Display acceleration data
                            $("#motionData").html("Acceleration: <br>x: " + e.acceleration.x + "<br>y: " + e.acceleration.y + "<br>z: " + e.acceleration.z);
                        });
                    }
                }).catch(console.error);
            }
            else {
                $("#motionInfo").text("No need to request permission for DeviceMotion");
                window.addEventListener('devicemotion', handleMotion);
                
            }
        }

    });

    // Get geolocation data continuously
    if (navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError);
    } else {
        // Geolocation not supported
        $("#geolocationData").text("Geolocation not supported.");
    }

});



