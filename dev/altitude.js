$(document).ready(function () {
    // TODO add code that gets the orientation data and the accelaration data and uses it to get the change in altitude.
    const thresholdRotation = 2.5; // Define threshold for rotation
    function handleError() {
        $("#altitudeData").text("Error getting altitude.");
    }
    const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
    };
    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(function (position) {
            var altitude = position.coords.altitude;
            $("#altitudeData").text("Altitude: " + altitude);
            // Use the altitude value here
        }, handleError, options);
    }
    else {
        $("#altitudeData").text("Geolocation not supported.");
    }
    function handleMotion(evt){
        evt.interval;
        // Handle motion data here

    }

    function handleOrientation(evt){
        if (evt.gamma > thresholdRotation || evt.gamma < -thresholdRotation){
            // Handle rotation here
        }
        if (evt.beta > thresholdRotation || evt.beta < -thresholdRotation){
            // Handle rotation here
        }
        // We do not have to use alpha since it only represents the compass direction (rotation around z-axis)
    }

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

    $("#requestOrientationPermissionButton").click(function () {
        // Check if the device supports DeviceOrientationEvent
        if (window.DeviceOrientationEvent) {
            $("#orientation").text("Device orientation supported.");
            // Check if we need to request permission (iOS 13+)
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                $("#orientationInfo").text("Requesting permission for DeviceOrientation");
                // The request permission is only needed for iOS 13+ devices and it is only available in Safari.
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            $("#permission").text("Permission granted for DeviceOrientation");
                            // Permission granted, add event listener
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            $("#permission").text("Permission not granted for DeviceOrientation");
                            // Permission not granted
                            alert('Permission not granted for DeviceOrientation');
                        }
                    })
                    .catch(console.error);
            } else {
                $("#orientationInfo").text("No need to request permission for DeviceOrientation");
                // No need to request permission, add event listener directly
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } else {
            $("#orientation").text("Device orientation not supported.");
        }
    });

});
