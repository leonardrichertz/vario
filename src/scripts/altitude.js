$(document).ready(function () {
    let gammaShift = 0;
    let betaShift = 0;
    let initialAltitude = 0;
    let actualAltitude = 0;
    let actualSpeed = 0;
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

    $("#requestAltitudeButton").click(function () {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                initialAltitude = position.coords.altitude;
                $("#altitudeData").text("Altitude: " + altitude);
                // Use the altitude value here
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

    function handleMotion(evt) {
        if (gammaShift != 0 || betaShift != 0) {
            evt.interval;
            let accelerationZ = evt.acceleration.z;
            let accelerationY = evt.acceleration.y;
            let accelerationX = evt.acceleration.x;
            let adjustedAccelerationAltitude;

            // gamma and beta are values between -90 and 90.
            // Todo: adjust functionality accordingly.
            switch (true) {
                case (gammaShift <= 90 && gammaShift >= 0):
                    switch (true) {
                        case (betaShift >= 0 && betaShift <= 90):
                            // In this case the acceleration for the x axis is negative if we are moving the device upwards.
                            adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) - (90 - gammaShift / 90 * accelerationX) + (betaShift / 90 * accelerationZ) + (90 - betaShift / 90 * accelerationY);
                            actualSpeed = adjustedAccelerationAltitude * evt.interval + actualSpeed;
                            break;
                        case (betaShift >= -90 && betaShift < 0):
                            // In this case the acceleration for the y-axis is negative because the top of the device is facing downwards.
                            adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) - (90 - gammaShift / 90 * accelerationX)  + (betaShift / 90 * accelerationZ) - (90 - betaShift / 90 * accelerationY); 
                            // Todo: add code here
                            break;
                        case (betaShift >= 90 && betaShift >= 0):
                            adjustedAccelerationAltitude = -(gammaShift / 90 * accelerationZ) + (90 - gammaShift / 90 * accelerationX) - (betaShift / 180 * accelerationZ) + (180 - betaShift / 180 * accelerationZ);
                            // Todo: add code here
                            break;
                        case (betaShift < 0 && betaShift >= -90):
                            adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ)  + (90- gammaShift / 90 * accelerationX)  + (betaShift / 360 * accelerationY) + (360 - betaShift / 360 * accelerationZ);
                            // Todo: add code here
                            break;
                    }
                    break;

                case (gammaShift > 90 && gammaShift <= 180):
                    switch (true) {
                        case (betaShift <= 90):
                            adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) + (90 - gammaShift / 90 * accelerationX) + (betaShift / 90 * accelerationY) + (90 - betaShift / 90 * accelerationZ);
                            actualSpeed = adjustedAccelerationAltitude * evt.interval + actualSpeed;
                            break;
                        case (betaShift > 90 && betaShift <= 180):
                            // Todo: add code here
                            break;
                        case (betaShift > 180 && betaShift <= 270):
                            // Todo: add code here
                            break;
                        case (betaShift > 270 && betaShift <= 360):
                            // Todo: add code here
                            break;
                    }
                    break;

                case (gammaShift > 180 && gammaShift <= 270):
                    switch (true) {
                        case (betaShift <= 90):
                            adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) + (90 - gammaShift / 90 * accelerationX) + (betaShift / 90 * accelerationY) + (90 - betaShift / 90 * accelerationZ);
                            actualSpeed = adjustedAccelerationAltitude * evt.interval + actualSpeed;
                            break;
                        case (betaShift > 90 && betaShift <= 180):
                            // Todo: add code here
                            break;
                        case (betaShift > 180 && betaShift <= 270):
                            // Todo: add code here
                            break;
                        case (betaShift > 270 && betaShift <= 360):
                            // Todo: add code here
                            break;
                    }
                    break;

                case (gammaShift > 270 && gammaShift <= 360):
                    switch (true) {
                        case (betaShift <= 90):
                            adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) + (90 - gammaShift / 90 * accelerationX) + (betaShift / 90 * accelerationY) + (90 - betaShift / 90 * accelerationZ);
                            actualSpeed = adjustedAccelerationAltitude * evt.interval + actualSpeed;
                            break;
                        case (betaShift > 90 && betaShift <= 180):
                            // Todo: add code here
                            break;
                        case (betaShift > 180 && betaShift <= 270):
                            // Todo: add code here
                            break;
                        case (betaShift > 270 && betaShift <= 360):
                            // Todo: add code here
                            break;
                    }
                    break;
            }
        }
    }
            // what we are trying to achieve is to get the change in altitude by using the orientation of the device as a correction for the acceleration properties.
            function handleOrientation(evt) {
                if (evt.gamma < 180) {
                    if (evt.gamma > thresholdRotation || evt.gamma - 180 < -thresholdRotation) {
                        // adjust the gammaShift value
                        gammaShift = evt.gamma;
                    }
                    else {
                        gammaShift = 0;
                    }
                }
                else if (evt.gamma >= 180) {
                    if (evt.gamma - 180 > thresholdRotation || evt.gamma - 360 < -thresholdRotation) {
                        // adjust the gammaShift value
                        gammaShift = evt.gamma;
                    }
                    else {
                        gammaShift = 0;
                    }
                }
                if (evt.beta < 180) {
                    if (evt.beta > thresholdRotation || evt.beta - 180 < -thresholdRotation) {
                        // adjust the betaShift value
                        betaShift = evt.beta;
                    }
                    else {
                        betaShift = 0;
                    }
                }
                else if (evt.beta >= 180) {
                    if (evt.beta - 180 > thresholdRotation || evt.beta - 360 < -thresholdRotation) {
                        // adjust the betaShift value
                        betaShift = evt.beta;
                    }
                    else {
                        betaShift = 0;
                    }
                }
                // We do not have to use alpha since it only represents the compass direction (rotation around z-axis)
            }

        });
