$(document).ready(function () {

    $("#requestPermission").on("click", function () {
        console.log("Requesting permission for Orientation");
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
        }
        if (window.DeviceMotionEvent) {
            $("#motion").text("Device motion supported.");
            if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
                $("#motionInfo").text("Requesting permission for DeviceMotion");
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        $("#motionInfo").text("Permission granted for DeviceMotion");
                        window.addEventListener('devicemotion', handleMotion);
                    }
                    else {
                        alert('Permission not granted for DeviceMotion');
                    }
                }).catch(console.error);
            }
            else {
                $("#motionInfo").text("No need to request permission for DeviceMotion");
                window.addEventListener('devicemotion', handleMotion);
            }
        }
        else {
            $("#motionInfo").text("Device motion not supported.");
        }

    });

    var prevX = 0;
    var prevY = 0;
    var prevZ = 0;
    
    function handleMotion(event) {
        // Set the filter constant (adjust as needed)
        var filterConstant = 0.5;
    
        // Apply the low-pass filter to smooth out the acceleration data
        var x = prevX + filterConstant * (event.acceleration.x - prevX);
        var y = prevY + filterConstant * (event.acceleration.y - prevY);
        var z = prevZ + filterConstant * (event.acceleration.z - prevZ);
    
        // Update the previous acceleration values
        prevX = x;
        prevY = y;
        prevZ = z;
        $("#motionData").html("Acceleration: " + acceleration + "<br> Acceleration X: " + x + "<br> Acceleration Y: " + y + "<br>Acceleration Z: " + z);
    }

    function handleOrientation(event) {
        var alpha = event.alpha;
        var beta = event.beta;
        var gamma = event.gamma;
        $("#orientationData").html("Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }
});
