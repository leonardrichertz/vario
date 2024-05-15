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

    function handleMotion(event) {
        var acceleration = event.acceleration;
        var x = event.acceleration.x;
        var y = event.acceleration.y;
        var z = event.acceleration.z;
        console.log("Acceleration: " + acceleration);
        console.log("Acceleration X: " + x);
        console.log("Acceleration Y: " + y);
        console.log("Acceleration Z: " + z);
        $("#motionData").html("Acceleration: " + acceleration + "<br> Acceleration X: " + x + "<br> Acceleration Y: " + y + "<br>Acceleration Z: " + z);
    }

    function handleOrientation(event) {
        var alpha = event.alpha;
        var beta = event.beta;
        var gamma = event.gamma;
        $("#orientationData").html("Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }
});
