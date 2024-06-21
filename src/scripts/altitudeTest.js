$(document).ready(function () {
    function getOS() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) return "Windows Phone";
        if (/android/i.test(userAgent)) return "Android";
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
        if (/Win/i.test(userAgent)) return "Windows";
        if (/Mac/i.test(userAgent)) return "MacOS";
        if (/Linux/i.test(userAgent)) return "Linux";
        return "unknown";
    }
    let lastUpdateTime = 0;
    let initialAltitude = 0;
    let currentAltitude = 0;
    let gammaShift = 0;
    let betaShift = 0;
    let currentSpeedUpDown = 0;
    let intervaltime = 0;
    let lastProcessedTime = 0;
    const thresholdRotation = 1.5;
    const throttleInterval = 500; // Intervall in Millisekunden (z.B. 100 ms entspricht 10 mal pro Sekunde)
    const options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 };
    const os = getOS();

    function handleError() {
        $("#altitudeData").text("Error getting altitude.");
    }

    function handleMotionError() {
        $("#motionInfo").text("Error in deviceMotion.");
    }

    $("#requestAltitudeButton").click(function () {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                initialAltitude = position.coords.altitude;
                currentAltitude = initialAltitude;
                lastAltitude = initialAltitude;
                lastUpdateTime = Date.now();
                $("#altitudeData").text("Altitude: " + initialAltitude);
                // kontinuierliches Update der Höhe
                setInterval(updateAltitude, throttleInterval);
                console.log("initial Height: " + initialAltitude);
            }, handleError, options);
            
            if (window.DeviceOrientationEvent) {
                $("#orientation").text("Device orientation supported.");
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    $("#orientationInfo").text("Requesting permission for DeviceOrientation");
                    DeviceOrientationEvent.requestPermission().then(permissionState => {
                        if (permissionState === 'granted') {
                            $("#permission").text("Permission granted for DeviceOrientation");
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            $("#permission").text("Permission not granted for DeviceOrientation");
                            alert('Permission not granted for DeviceOrientation');
                        }
                    }).catch(console.error);
                } else {
                    $("#orientationInfo").text("No need to request permission for DeviceOrientation");
                    window.addEventListener('deviceorientation', handleOrientation);
                }
                if (window.DeviceMotionEvent) {
                    $("#motion").text("Device motion supported.");
                    if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
                        $("#motionInfo").text("Requesting permission for DeviceMotion");
                        DeviceMotionEvent.requestPermission().then(permissionState => {
                            if (permissionState === 'granted') {
                                window.addEventListener('devicemotion', handleMotion, handleMotionError);
                            } else {
                                alert('Permission not granted for DeviceMotion');
                            }
                        }).catch(console.error);
                    } else {
                        $("#motionInfo").text("No need to request permission for DeviceMotion");
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
        const currentTime = Date.now();
        let interval = evt.interval + intervaltime;
        if (currentTime - lastProcessedTime > throttleInterval) {
            lastProcessedTime = currentTime;

            let accelarationUpDown = 0;
            let accelerationZ1 = evt.acceleration.z;
            let accelerationY1 = evt.acceleration.y;
            let accelerationX1 = evt.acceleration.x;

            $("#AccelerationX").text("Acceleration X: " + accelerationX1.toFixed(2));
            $("#AccelerationY").text("Acceleration Y: " + accelerationY1.toFixed(2));
            $("#AccelerationZ").text("Acceleration Z: " + accelerationZ1.toFixed(2));

            switch (true) {
                case (gammaShift >= 0 && gammaShift <= 90):
                    switch (true) {
                        case (betaShift >= 0 && betaShift <= 90):
                            accelarationUpDown = (betaShift / 90 * accelerationY1) + ((1 - betaShift / 90) * accelerationZ1) + (betaShift / 90 * accelerationX1);
                            break;
                        case (betaShift < 0 && betaShift < -90):
                            accelarationUpDown = (betaShift / 90 * accelerationY1) - ((1 - betaShift / 90) * accelerationZ1) + (betaShift / 90 * accelerationX1);
                            break;
                    }
                case (gammaShift < 0 && gammaShift > -90):
                    switch (true) {
                        case (betaShift >= 0 && betaShift <= 90):
                            accelarationUpDown = (betaShift / 90 * accelerationY1) + ((1 - betaShift / 90) * accelerationZ1) + (betaShift / 90 * accelerationX1);
                            break;
                        case (betaShift < 0 && betaShift < -90):
                            accelarationUpDown = (betaShift / 90 * accelerationY1) - ((1 - betaShift / 90) * accelerationZ1) + (betaShift / 90 * accelerationX1);
                            break;
                    }
            }
            $("#AccelerationUpDown").text("Acceleration Up/Down: " + accelarationUpDown.toFixed(3));
            currentSpeedUpDown = calculateSpeedUpDown(accelarationUpDown, interval);
            $("#SpeedUpDown").text("Speed Up/Down: " + currentSpeedUpDown.toFixed(3));
            interval = 0;
            intervaltime = 0;
        }
        intervaltime += evt.interval;
    }

    function calculateSpeedUpDown(acc, interval) {
        if (acc > 0.1 || acc < -0.1) {
            if (os == 'iOS' || os == 'MacOS') {
                let speed = currentSpeedUpDown + acc * interval;
                console.log("Interval: " + interval)
                console.log("kalkulierter Speed on IOS: " + speed + "  delta-speed: " + (speed - currentSpeedUpDown))
                return speed;
            } else {
                let speed = currentSpeedUpDown + acc * interval / 1000;
                console.log("Interval: " + interval)
                console.log("kalkulierter Speed: " + speed + "  delta-speed: " + (speed - currentSpeedUpDown))
                return speed;
            }
        } else return currentSpeedUpDown;
    }

    function handleOrientation(evt) {
        $("#alpha").text("Alpha: " + evt.alpha);
        $("#beta").text("Beta: " + evt.beta);
        $("#gamma").text("Gamma: " + evt.gamma);

        if (evt.gamma < 90 && evt.gamma >= 0) {
            if (evt.gamma > thresholdRotation || evt.gamma - 90 < -thresholdRotation) {
                gammaShift = evt.gamma;
            } else {
                gammaShift = 0;
            }
        } else if (evt.gamma >= -90 && evt.gamma < 0) {
            if (evt.gamma < -thresholdRotation || evt.gamma + 90 > thresholdRotation) {
                gammaShift = evt.gamma;
            } else {
                gammaShift = 0;
            }
        }
        if (evt.beta < 180 && evt.beta >= 0) {
            if (evt.beta > thresholdRotation || evt.beta - 180 < -thresholdRotation) {
                betaShift = evt.beta;
            } else {
                betaShift = 0;
            }
        } else if (evt.beta >= -180 && evt.beta < 0) {
            if (evt.beta < -thresholdRotation || evt.beta + 180 > thresholdRotation) {
                betaShift = evt.beta;
            } else {
                betaShift = 0;
            }
        }
        $("#betaShift").text("BetaShift: " + betaShift);
        $("#gammaShift").text("GammaShift: " + gammaShift);
    }

    function updateAltitude() {
        console.log("updateAltitude Function");
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var newAltitude = position.coords.altitude;
                var currentTime = Date.now();
                var deltaAltitude = newAltitude - currentAltitude;
                var deltaTime = (currentTime - lastUpdateTime) / 1000; // Zeitdifferenz in Sekunden
                var speed = deltaAltitude / deltaTime; // Geschwindigkeit in Metern pro Sekunde

                $("#altitudeData").text("Current Altitude: " + newAltitude + 
                                        ", Delta: " + deltaAltitude + 
                                        ", Speed: " + speed + " m/s");
                                        
                console.log("Current Altitude: " + newAltitude + 
                                        ", Delta: " + deltaAltitude + 
                                        ", Speed: " + speed + " m/s");
                // Update die Variablen für die nächste Messung
                currentAltitude = newAltitude;
                lastUpdateTime = currentTime;
            }, handleError, options);
        } else {
            $("#altitudeData").text("Geolocation not supported.");
        }
    }
});