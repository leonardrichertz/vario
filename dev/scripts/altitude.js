import {getOS} from '../utils/operatingSystem.js'; // Import getOS function from operatingSystem.js

$(document).ready(function () {
    const os = getOS(); // Get the operating system
    let gammaShift = 0;
    let betaShift = 0;
    let initialAltitude = 0;
    let currentAltitude = 0;
    let verticalSpeed = 0;
    // This is the acceleration of the previous time interval
    let acceleration0X = 0;
    let acceleration0Y = 0;
    let acceleration0Z = 0;
    let acceleration0Altitude = 0;
    let isFirstCall= true;
    // v0 is the speed at time t0
    let v0 = 0;
    // v1 is the speed at time t1
    let v1 = 0;
    // TODO add code that gets the orientation data and the accelaration data and uses it to get the change in altitude.
    const thresholdRotation = 1.5; // Define threshold for rotation
    // Todo: set threshold value for significant acceleration.
    // set threshold value for significant acceleration.

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

    function handleMotion(evt) {
        let interval = null;
        // For IOS we already have it in seconds
        if(os == 'iOS' || os =='MacOS'){
            interval = evt.interval;
            console.log("IOS interval: ", interval);
        }
        // For Android we have it in milliseconds
        else{
            interval = evt.interval / 1000;
            console.log("Android interval: ", interval);
        }
        console.log(interval);
        let accelerationZ1 = evt.acceleration.z;
        let accelerationY1 = evt.acceleration.y;
        let accelerationX1 = evt.acceleration.x;
        let adjustedAccelerationZ1 = 0;
        let adjustedAccelerationY1 = 0;
        let adjustedAccelerationX1 = 0;
        let adjustedAccelerationAltitude1 = 0;

        // Check if this is the first call
        if (isFirstCall) {
            // Calculate the initial acceleration, which is the same as the acceleration at time t1 now, but since we get the average acceleration it should be fine.
            acceleration0Z = (gammaShift / 90 * accelerationZ1) + (betaShift / 90 * accelerationZ1);
            acceleration0Y = (betaShift / 90 * accelerationY1);
            acceleration0X = - (gammaShift / 90 * accelerationX1);
            acceleration0Altitude = acceleration0Z + acceleration0Y + acceleration0X;
            currentAltitude = initialAltitude;
            isFirstCall = false;	
        }
        // Check if the device is not rotated
        if (Math.abs(gammaShift) <= thresholdRotation && Math.abs(betaShift) <= thresholdRotation) {
            // No rotation
            v1 = v0 + ((accelerationZ1 + acceleration0Z)/2) * interval;
            console.log("v0: " + v0);
            console.log("v1: " + v1);
        }
        // Check if initial altitude is set
        else {
            // gamma are values between -90 and 90.
            // beta are values between -180 and 180.
            // Todo: adjust functionality accordingly.
            switch (true) {
                case (gammaShift <= 90 && gammaShift >= 0):
                    switch (true) {
                        case (betaShift >= 0 && betaShift <= 90):
                            // In this case the acceleration for the x axis is negative if we are moving the device upwards.
                            // Maybe we actually only need to adjust the acceleration for the z-axis with the gammaShift value and not the beta value. I am however unsure about this. We would take parts of 90 from each rotation value and thus et a weighted average of the acceleration values.
                            // This is the old code that I am not sure about:
                            // adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) + (betaShift / 90 * accelerationZ) - (90 - gammaShift / 90 * accelerationX) + (90 - betaShift / 90 * accelerationY);
                            // Do we need to adjust the value of the acceleration by signing it? Does that make sense since a negative sum of accelerations would mean we lose speed. If there isn't any acceleration we would stay at the same speed.
                            adjustedAccelerationZ1 = (gammaShift / 90 * accelerationZ1) + (betaShift / 90 * accelerationZ1);
                            adjustedAccelerationY1 = (betaShift / 90 * accelerationY1)
                            adjustedAccelerationX1 = - (gammaShift / 90 * accelerationX1)
                            console.log("Adjusted Acceleration X: " + adjustedAccelerationX1 + "  ,Y:   " + adjustedAccelerationY1 + "  ,Z:   " + adjustedAccelerationZ1)
                            adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                            actualSpeed = v0 + ((acceleration0Altitude + adjustedAccelerationAltitude1)/2) * evt.interval;
                            console.log("actualSpeed: " + actualSpeed);
                            currentAltitude = currentAltitude + actualSpeed * evt.interval;
                            console.log("currentAltitude: " + currentAltitude);
                            $("#altitudeData").text("Altitude: " + currentAltitude);
                            break;
                        case (betaShift >= -90 && betaShift < 0):
                            // In this case the acceleration for the y-axis is negative because the top of the device is facing downwards.
                            adjustedAccelerationZ1 = (gammaShift / 90 * accelerationZ1) - (betaShift / 90 * accelerationZ1);
                            adjustedAccelerationY1 = -(betaShift / 90 * accelerationY1)
                            adjustedAccelerationX1 = - (gammaShift / 90 * accelerationX1)
                            adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                            actualSpeed = v0 + ((acceleration0Altitude + adjustedAccelerationAltitude1)/2) * evt.interval;
                            console.log("actualSpeed: " + actualSpeed);
                            currentAltitude = currentAltitude + actualSpeed * evt.interval;
                            console.log("currentAltitude: " + currentAltitude);
                            $("#altitudeData").text("Altitude: " + currentAltitude);
                            break;
                            // Old code that I am unsure about:
                            // adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) - (90 - gammaShift / 90 * accelerationX)  + (betaShift / 90 * accelerationZ) - (90 - betaShift / 90 * accelerationY); 
                        case (betaShift >= 90):
                            //z-negative, y-positive, x-positive
                            adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) + (betaShift / 180 * accelerationZ1);
                            adjustedAccelerationY1 = -(betaShift / 180 * accelerationY1)
                            adjustedAccelerationX1 = - (gammaShift / 90 * accelerationX1)
                            adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                            actualSpeed = v0 + ((acceleration0Altitude + adjustedAccelerationAltitude1)/2) * evt.interval;
                            console.log("actualSpeed: " + actualSpeed);
                            currentAltitude = currentAltitude + actualSpeed * evt.interval;
                            console.log("currentAltitude: " + currentAltitude);
                            $("#altitudeData").text("Altitude: " + currentAltitude);
                            break;
                            // adjustedAccelerationAltitude = -(gammaShift / 90 * accelerationZ) + (90 - gammaShift / 90 * accelerationX) - (betaShift / 180 * accelerationZ) + (180 - betaShift / 180 * accelerationZ);
                        case (betaShift < 0 && betaShift <= -90):
                            adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) - (betaShift / 180 * accelerationZ1);
                            adjustedAccelerationY1 = -(betaShift / 180 * accelerationY1);
                            adjustedAccelerationX1 = - (gammaShift / 90 * accelerationX1);
                            adjustedAccelerationAltitude = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                            actualSpeed = v0 + ((acceleration0Altitude + adjustedAccelerationAltitude1)/2) * evt.interval;
                            console.log("actualSpeed: " + actualSpeed);
                            currentAltitude = currentAltitude + actualSpeed * evt.interval;
                            console.log("currentAltitude: " + currentAltitude);
                            $("#altitudeData").text("Altitude: " + currentAltitude);
                            // Todo: add code here
                            break;
                    }
                    break;

                case (gammaShift < 0 && gammaShift >= -90):
                    switch (true) {
                        case (betaShift >= 0 && betaShift <= 90):
                            adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) + (betaShift / 90 * accelerationZ1);
                            adjustedAccelerationY1 = (betaShift / 90 * accelerationY1)
                            adjustedAccelerationX1 = -(gammaShift / 90 * accelerationX1)
                            console.log("Adjusted Acceleration X: " + adjustedAccelerationX1 + "  ,Y:   " + adjustedAccelerationY1 + "  ,Z:   " + adjustedAccelerationZ1)
                            adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                            actualSpeed = v0 + ((acceleration0Altitude + adjustedAccelerationAltitude1)/2) * evt.interval;
                            console.log("actualSpeed: " + actualSpeed);
                            currentAltitude = currentAltitude + actualSpeed * evt.interval;
                            console.log("currentAltitude: " + currentAltitude);
                            $("#altitudeData").text("Altitude: " + currentAltitude);
                            break;
                            // adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) + (90 - gammaShift / 90 * accelerationX) + (betaShift / 90 * accelerationY) + (90 - betaShift / 90 * accelerationZ);
                        case (betaShift >= -90 && betaShift < 0):
                            adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) - (betaShift / 90 * accelerationZ1);
                            adjustedAccelerationY1 = -(betaShift / 90 * accelerationY1)
                            adjustedAccelerationX1 = -(gammaShift / 90 * accelerationX1)
                            console.log("Adjusted Acceleration X: " + adjustedAccelerationX1 + "  ,Y:   " + adjustedAccelerationY1 + "  ,Z:   " + adjustedAccelerationZ1)
                            adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                            actualSpeed = v0 + ((acceleration0Altitude + adjustedAccelerationAltitude1)/2) * evt.interval;
                            console.log("actualSpeed: " + actualSpeed);
                            currentAltitude = currentAltitude + actualSpeed * evt.interval;
                            console.log("currentAltitude: " + currentAltitude);
                            $("#altitudeData").text("Altitude: " + currentAltitude);
                            break;
                                // Todo: add code here
                        case (betaShift >= 90):
                                // Todo: add code here
                                adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) + (betaShift / 90 * accelerationZ1);
                                adjustedAccelerationY1 = (betaShift / 90 * accelerationY1)
                                adjustedAccelerationX1 = -(gammaShift / 90 * accelerationX1)
                                console.log("Adjusted Acceleration X: " + adjustedAccelerationX1 + "  ,Y:   " + adjustedAccelerationY1 + "  ,Z:   " + adjustedAccelerationZ1)
                                adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                                actualSpeed = v0 + ((acceleration0Altitude + adjustedAccelerationAltitude1)/2) * evt.interval;
                                console.log("actualSpeed: " + actualSpeed);
                                currentAltitude = currentAltitude + actualSpeed * evt.interval;
                                console.log("currentAltitude: " + currentAltitude);
                                $("#altitudeData").text("Altitude: " + currentAltitude);
                                break;
                        case (betaShift < 0 && betaShift <= -90):
                            adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) - (betaShift / 90 * accelerationZ1);
                            adjustedAccelerationY1 = -(betaShift / 90 * accelerationY1)
                            adjustedAccelerationX1 = -(gammaShift / 90 * accelerationX1)
                            console.log("Adjusted Acceleration X: " + adjustedAccelerationX1 + "  ,Y:   " + adjustedAccelerationY1 + "  ,Z:   " + adjustedAccelerationZ1)
                            adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                            actualSpeed = v0 + ((acceleration0Altitude + adjustedAccelerationAltitude1)/2) * evt.interval;
                            console.log("actualSpeed: " + actualSpeed);
                            currentAltitude = currentAltitude + actualSpeed * evt.interval;
                            console.log("currentAltitude: " + currentAltitude);
                            $("#altitudeData").text("Altitude: " + currentAltitude);
                            break;
                    }
                    break;
            }
    }
}
            // what we are trying to achieve is to get the change in altitude by using the orientation of the device as a correction for the acceleration properties.
            function handleOrientation(evt) {
                if (evt.gamma < 90 && evt.gamma >= 0) {
                    if (evt.gamma > thresholdRotation || evt.gamma - 90 < -thresholdRotation) {
                        // adjust the gammaShift value
                        gammaShift = evt.gamma;
                    }
                    else {
                        gammaShift = 0;
                    }
                }
                else if (evt.gamma >= -90 && evt.gamma < 0) {
                    if (evt.gamma < -thresholdRotation || evt.gamma + 90 > thresholdRotation) {
                        // adjust the gammaShift value
                        gammaShift = evt.gamma;
                    }
                    else {
                        gammaShift = 0;
                    }
                }
                if (evt.beta < 180  && evt.beta >= 0) {
                    if (evt.beta > thresholdRotation || evt.beta - 180 < -thresholdRotation) {
                        // adjust the betaShift value
                        betaShift = evt.beta;
                    }
                    else {
                        betaShift = 0;
                    }
                }
                else if (evt.beta >= -180 && evt.beta < 0) {
                    if (evt.beta < -thresholdRotation || evt.beta + 180 > thresholdRotation) {
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
