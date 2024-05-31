$(document).ready(function () {

  let initialAltitude = 0;
  let currentAltitude = 0;


  function handleError() {
    $("#altitudeData").text("Error getting altitude.");
}

function handleMotionError(){
    $("#motionInfo").text("Error in deviceMotion.");
}

const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
};

$("#requestAltitudeButton").click(function () {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialAltitude = position.coords.altitude;
            $("#altitudeData").text("Altitude: " + initialAltitude);
        }, handleError, options);
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
            if (window.DeviceMotionEvent) {
                $("#motion").text("Device motion supported.");
                if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
                    $("#motionInfo").text("Requesting permission for DeviceMotion");
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

        } else {
            $("#orientation").text("Device orientation not supported.");
        }
    }
    else {
        $("#altitudeData").text("Geolocation not supported.");
    }
});
});