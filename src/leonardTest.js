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
    });

    function handleOrientation(event) {
        var alpha = event.alpha;
        var beta = event.beta;
        var gamma = event.gamma;
        $("#orientationData").html("Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }
});
