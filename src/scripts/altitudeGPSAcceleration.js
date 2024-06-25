import { calculateDistance, calculateManualSpeed } from '../utils/mapUtils.js';
import { getOS } from '../utils/operatingSystem.js';
import { handleOrientationAndroid, handleOrientationIOS } from '../utils/orientationUtils.js';
import Timer from '../utils/timer.js';

export function altitudeGPSAcceleration() {
    const os = getOS();
    console.log("Operating System: " + os);

    // Define these variables in the correct scope
    let lastPosition = null;
    let lastTimestamp = null;
    const timer = new Timer();

    const map = L.map('map').setView([49.75, 6.63], 12);
    let marker;
    let startMarker;
    let watchId;
    let distance = 0;

    let previousHeight = null;
    let previousTime = null;
    let verticalSpeed = 0;  // Initial vertical speed
    let accelerationBuffer = []; // Buffer for storing acceleration data
    let lastMotionUpdate = Date.now(); // Time of the last devicemotion event

    const startMarkerIcon = L.icon({
        iconUrl: '../assets/marker.png',
        iconSize: [38, 50], // size of the icon
        iconAnchor: [19, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    const markerIcon = L.icon({
        iconUrl: '../assets/paraglider.png',
        iconSize: [38, 50], // size of the icon
        iconAnchor: [19, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
    };

    // Add Tile layer for map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([0, 0], { icon: markerIcon }).addTo(map).bindPopup("You are here");

    $("#start").text("Karte, Geschwindigkeit und Distanz");

    function IOS(event) {
        const { alpha, beta, gamma } = handleOrientationIOS(event);
        $("#compass").css("transform", "rotate(" + alpha + "deg)");
    }

    function Android(event) {
        const { alpha, beta, gamma } = handleOrientationAndroid(event);
        $("#compass").css("transform", "rotate(" + alpha + "deg)");
    }

    function handleGeolocation(position) {
        const latlng = [position.coords.latitude, position.coords.longitude];

        if (marker.getLatLng().lat !== 0 && marker.getLatLng().lng !== 0) {
            const oldLatLng = marker.getLatLng();
            L.polyline([oldLatLng, latlng], { color: 'blue' }).addTo(map);
            distance += calculateDistance(oldLatLng.lat, oldLatLng.lng, position.coords.latitude, position.coords.longitude);
            $("#distance").html("Strecke in m: " + distance.toFixed(3));
        }

        marker.setLatLng(latlng).setIcon(markerIcon).update();
        map.setView(latlng);

        if (typeof startMarker == 'undefined') {
            startMarker = L.marker([position.coords.latitude, position.coords.longitude], { icon: startMarkerIcon }).addTo(map);
        }

        $("#distance").html("Strecke in m: " + distance.toFixed(3));

        const speed = position.coords.speed;
        if (speed !== null && !isNaN(speed)) {
            $("#speed").html(speed.toFixed(2));
        } else {
            const result = calculateManualSpeed(position, lastPosition, lastTimestamp);
            lastPosition = result.lastPosition;
            lastTimestamp = result.lastTimestamp;
            const manualSpeed = result.manualSpeed;
            $("#speed").html(manualSpeed.toFixed(2));
        }

        // Altitude handling
        const currentHeight = position.coords.altitude;
        if (currentHeight !== null) {
            $("#height").html(currentHeight.toFixed(2) + " m");

            const currentTime = Date.now();
            if (previousHeight !== null && previousTime !== null) {
                const speed = calculateVerticalSpeed(currentHeight, currentTime);
                verticalSpeed = (verticalSpeed + speed) / 2;  // Average speed
            }
            previousHeight = currentHeight;
            previousTime = currentTime;
        }
    }

    function handleError(error) {
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    function updateDeviceMotion(event) {
        const currentTime = Date.now();
        const timeDifference = (currentTime - lastMotionUpdate) / 1000; // convert to seconds

        const accelerationZ = event.acceleration.z;
        if (accelerationZ !== null) {
            accelerationBuffer.push({
                acceleration: accelerationZ,
                timestamp: currentTime
            });
        }

        if (timeDifference >= 0.2) { // Only update if 200ms have passed
            let sumAcceleration = 0;
            let validDataPoints = 0;

            for (let i = 0; i < accelerationBuffer.length; i++) {
                sumAcceleration += accelerationBuffer[i].acceleration;
                validDataPoints++;
            }

            if (validDataPoints > 0) {
                const averageAcceleration = sumAcceleration / validDataPoints;
                const timeDiff = (currentTime - previousTime) / 1000;  // convert to seconds

                if (previousTime !== null) {
                    verticalSpeed += averageAcceleration * timeDiff;  // integrate acceleration to get speed
                }

                // Update the UI
                if (verticalSpeed > 0) {
                    $("#ascentSpeed").html(verticalSpeed.toFixed(2));
                    $("#descentSpeed").html("0.00");
                } else {
                    $("#ascentSpeed").html("0.00");
                    $("#descentSpeed").html((-verticalSpeed).toFixed(2));
                }

                previousTime = currentTime;
            }

            accelerationBuffer = []; // Clear the buffer
            lastMotionUpdate = currentTime; // Update the last motion update time
        }
    }

    function updateGeolocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            const currentHeight = position.coords.altitude;
            console.log("current Height: " + currentHeight);
            const currentTime = Date.now();

            if (currentHeight !== null) {
                const speed = calculateVerticalSpeed(currentHeight, currentTime);
                verticalSpeed = (verticalSpeed + speed) / 2;  // Average speed

                // Update the UI
                if (verticalSpeed > 0) {
                    $("#ascentSpeed").html(verticalSpeed.toFixed(2));
                    $("#descentSpeed").html("0.00");
                } else {
                    $("#ascentSpeed").html("0.00");
                    $("#descentSpeed").html((-verticalSpeed).toFixed(2));
                }
            }

            previousHeight = currentHeight;
            previousTime = currentTime;
        }, (error) => {
            console.error('Geolocation error:', error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    }

    function calculateVerticalSpeed(currentHeight, currentTime) {
        if (previousHeight !== null && previousTime !== null) {
            const heightDifference = currentHeight - previousHeight;
            const timeDifference = (currentTime - previousTime) / 1000;  // convert to seconds
            return heightDifference / timeDifference;  // speed in m/s
        }
        return 0;
    }

    $("#requestOrientationPermissionButton").click(function () {
        if ($(this).text() === "Start") {
            console.log("startOrientation clicked");
            $(this).text("Stop");
            timer.start();
            console.log("timer started");

            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
                $("#startGeolocation").prop("disabled", true);
            } else {
                $("#geolocationData").text("Geolocation not supported.");
            }

            console.log("Requesting permission for DeviceOrientation");
            if (window.DeviceOrientationEvent) {
                console.log("DeviceOrientation supported");
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    console.log("Requesting permission for DeviceOrientation");
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                $("#permission").text("Permission granted for DeviceOrientation");
                                if (os === 'iOS' || os === 'MacOS') {
                                    console.log("case 1 Apple");
                                    window.addEventListener('deviceorientation', IOS);
                                } else {
                                    console.log("case 1 Android");
                                    window.addEventListener('deviceorientationabsolute', Android, true);
                                }
                            } else {
                                $("#permission").text("Permission not granted for DeviceOrientation");
                                alert('Permission not granted for DeviceOrientation');
                            }
                        })
                        .catch(console.error);
                } else {
                    $("#orientationInfo").text("No need to request permission for DeviceOrientation");
                    if (os === 'iOS') {
                        console.log("case 2 Apple");
                        window.addEventListener('deviceorientation', IOS);
                    } else {
                        console.log("case 2 Android");
                        window.addEventListener('deviceorientationabsolute', Android, true);
                    }
                }
            } else {
                $("#orientation").text("Device orientation not supported.");
            }

            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', updateDeviceMotion);
            }

            setInterval(updateGeolocation, 1000);
        } else {
            $(this).text("Start");
            navigator.geolocation.clearWatch(watchId);
            timer.stop();
        }
    });
}
