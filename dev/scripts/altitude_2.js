$(document).ready(function () {
    let gammaShift = 0;
    let betaShift = 0;
    let initialAltitude = 0;
    let currentAltitude = 0;
    let verticalSpeed = 0;
    let isFirstCall = true;
    let v0 = 0; // Initial speed
    let v1 = 0; // Speed at the next interval
    const thresholdRotation = 1.5;
    let counter = 0;

    function handleError() {
        $("#altitudeData").text("Error getting altitude.");
    }

    function handleMotionError() {
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
                initialAltitude = position.coords.altitude || 0; // Fallback to 0 if altitude is not available
                currentAltitude = initialAltitude;
                $("#altitudeData").text("Altitude: " + initialAltitude);
            }, handleError, options);

            if (window.DeviceOrientationEvent) {
                $("#orientation").text("Device orientation supported.");
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission().then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            alert('Permission not granted for DeviceOrientation');
                        }
                    }).catch(console.error);
                } else {
                    window.addEventListener('deviceorientation', handleOrientation);
                }

                if (window.DeviceMotionEvent) {
                    if (typeof DeviceMotionEvent.requestPermission === 'function') {
                        DeviceMotionEvent.requestPermission().then(permissionState => {
                            if (permissionState === 'granted') {
                                window.addEventListener('devicemotion', handleMotion, handleMotionError);
                            } else {
                                alert('Permission not granted for DeviceMotion');
                            }
                        }).catch(console.error);
                    } else {
                        window.addEventListener('devicemotion', handleMotion, handleMotionError);
                    }
                } else {
                    $("#motionInfo").text("Device motion not supported.");
                }
            } else {
                $("#orientation").text("Device orientation not supported.");
            }
        } else {
            $("#altitudeData").text("Geolocation not supported.");
        }
    });

    function handleMotion(evt) {
        counter++;
        console.log(counter)
        let interval = evt.interval / 1000; // Convert milliseconds to seconds
        let accelerationZ1 = evt.accelerationIncludingGravity.z;
        let accelerationY1 = evt.accelerationIncludingGravity.y;
        let accelerationX1 = evt.accelerationIncludingGravity.x;

        if (isFirstCall) {
            isFirstCall = false;
            return; // Skip the first call as we need an initial reference
        }

        // Correct accelerations based on orientation
        let adjustedAccelerationZ1 = accelerationZ1 * Math.cos(gammaShift * Math.PI / 180) + accelerationY1 * Math.sin(betaShift * Math.PI / 180);
        let adjustedAccelerationY1 = accelerationY1 * Math.cos(betaShift * Math.PI / 180);
        let adjustedAccelerationX1 = accelerationX1 * Math.cos(gammaShift * Math.PI / 180);
        console.log("Adjusted Z: " + adjustedAccelerationZ1);
        console.log("Adjusted Y: " + adjustedAccelerationY1);
        console.log("Adjusted X: " + adjustedAccelerationX1);

        // Calculate average acceleration for this interval
        let averageAcceleration = (adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1) / 3;
        console.log("Average acceleration: " + averageAcceleration);

        // Update vertical speed and altitude
        v1 = v0 + averageAcceleration * interval;
        currentAltitude += v1 * interval;
        console.log("Current altitude: " + currentAltitude);
        v0 = v1; // Update v0 for the next interval

        $("#altitudeData").text("Altitude: " + currentAltitude.toFixed(2));
    }

    function handleOrientation(evt) {
        gammaShift = evt.gamma || 0;
        betaShift = evt.beta || 0;
    }
});
