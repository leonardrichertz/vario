$(document).ready(function () {
    let initialAltitude = 0;
    let xSpeed = 0;
    let ySpeed = 0;
    let zSpeed = 0;

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
                initialAltitude = position.coords.altitude || 0;
                $("#altitudeData").text("Initial Altitude: " + initialAltitude + " meters");
            }, handleError, options);

            if (window.DeviceMotionEvent) {
                $("#motion").text("Device motion supported.");
                if (typeof DeviceMotionEvent.requestPermission === 'function') {
                    $("#motionInfo").text("Requesting permission for DeviceMotion");
                    DeviceMotionEvent.requestPermission().then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('devicemotion', handleMotion);
                        } else {
                            alert('Permission not granted for DeviceMotion');
                        }
                    }).catch(console.error);
                } else {
                    $("#motionInfo").text("No need to request permission for DeviceMotion");
                    window.addEventListener('devicemotion', handleMotion);
                }
            } else {
                $("#motionInfo").text("Device motion not supported.");
            }
        } else {
            $("#altitudeData").text("Geolocation not supported.");
        }
    });

    function handleMotion(evt) {
        const interval = evt.interval / 1000; // convert interval to seconds
        const accelerationX = evt.acceleration.x;
        const accelerationY = evt.acceleration.y;
        const accelerationZ = evt.acceleration.z;

        // Calculate the speed for each axis by integrating the acceleration
        xSpeed += accelerationX * interval;
        ySpeed += accelerationY * interval;
        zSpeed += accelerationZ * interval;
        console.log("Acceleration: X=" + accelerationX.toFixed(2) + ", Y=" + accelerationY.toFixed(2) + ", Z=" + accelerationZ.toFixed(2));
        console.log("Speed: X=" + xSpeed.toFixed(2) + ", Y=" + ySpeed.toFixed(2) + ", Z=" + zSpeed.toFixed(2));
        $("#accelerationData").text("Acceleration: X=" + accelerationX.toFixed(2) + ", Y=" + accelerationY.toFixed(2) + ", Z=" + accelerationZ.toFixed(2));
        $("#speedData").text("Speed (m/s): X=" + xSpeed.toFixed(2) + ", Y=" + ySpeed.toFixed(2) + ", Z=" + zSpeed.toFixed(2));
    }
});
