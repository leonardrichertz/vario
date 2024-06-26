import { calculateDistance, calculateManualSpeed } from '../utils/mapUtils.js';
import { getOS } from '../utils/operatingSystem.js';
import { handleOrientationAndroid, handleOrientationIOS, getOrientationShift } from '../utils/orientationUtils.js';
import Timer from '../utils/timer.js';
import { getverticalSpeedFromInterval } from '../utils/motionUtils.js';

export function altitudeGPSandAcceleration() {
    var os = getOS();
    console.log("Operating System: " + os);

    // Define these variables in the correct scope
    var lastPosition = null;
    var lastTimestamp = null;
    const timer = new Timer();

    // Used for adjusting the devices orientation
    let gammaShift = 0;
    let betaShift = 0;
    const thresholdRotation = 1.5; // Define threshold for rotation, which is passed to the getOrientationShift function
    let verticalSpeed = 0; // Used for the calculation of the vertical speed

    // Used for the calculation of the vertical speed using vectors
    let isFirstCall = true;
    // v0 is the speed at time t0


    var map = L.map('map').setView([49.75, 6.63], 12);
    var marker;
    var startMarker;
    var watchId;
    var distance = 0;
    var lastAltitude = 0;

    var startMarkerIcon = L.icon({
        iconUrl: '../assets/marker.png',
        iconSize: [38, 50], // size of the icon
        iconAnchor: [19, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var markerIcon = L.icon({
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
        const alpha = handleOrientationIOS(event);
        $("#compass").css("transform", "rotate(" + (360 - alpha) + "deg)");
        gammaShift, betaShift = getOrientationShifts(event, thresholdRotation);
        console.log("gammaShift: " + gammaShift);
        console.log("betaShift: " + betaShift);
    }

    function Android(event) {
        const alpha = handleOrientationAndroid(event);
        $("#compass").css("transform", "rotate(" + alpha + "deg)");
        gammaShift, betaShift = getOrientationShifts(event, thresholdRotation);
        console.log("gammaShift: " + gammaShift);
        console.log("betaShift: " + betaShift);
    }

    function handleGeolocation(position) {
        console.log("handleGeolocation event triggered");
        var latlng = [position.coords.latitude, position.coords.longitude];
        //Added altitude handling and displaying it on the website.
        const newAltitude = position.coords.altitude;
        console.log("new Altitude: " + newAltitude);
        console.log("last Altitude: " + lastAltitude);
        const currrentTime = Date.now();
        console.log("current time: " + currrentTime);
        console.log("last timestamp: " + lastTimestamp);

        if (lastTimestamp !== 0 && newAltitude !== null) {
            console.log("Vertical speed calculation started")
            const altitudeDifference = newAltitude - lastAltitude;
            // convert milliseconds to seconds
            const timeDifference = (currrentTime - lastTimestamp) / 1000;
            console.log("Altitude difference: " + altitudeDifference);
            console.log("Time difference: " + timeDifference);
            verticalSpeed = altitudeDifference / timeDifference;
            if (speed > 0) {
                console.log("Ascent speed: " + speed.toFixed(2));
                $("#ascentSpeed").html(speed.toFixed(2));
                $("#descentSpeed").html("0.00");
            }
            else {
                console.log("Descent speed: " + speed.toFixed(2));
                $("#ascentSpeed").html("0.00");
                $("#descentSpeed").html(Math.abs(speed.toFixed(2)));
            }
            lastAltitude = newAltitude;
            lastTimestamp = currrentTime;
        }

        if (marker.getLatLng().lat !== 0 && marker.getLatLng().lng !== 0) {
            var oldLatLng = marker.getLatLng();
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

        var speed = position.coords.speed;
        if (speed !== null && !isNaN(speed)) {
            console.log("speed is coming from GPS")
            $("#speed").html(speed.toFixed(2));
        } else {
            console.log("speed is calculated manually")
            var result = calculateManualSpeed(position, lastPosition, lastTimestamp);
            lastPosition = result.lastPosition;
            lastTimestamp = result.lastTimestamp;
            var manualSpeed = result.manualSpeed;
            $("#speed").html(manualSpeed.toFixed(2));
        }
    }
    function handleMotion(evt) {
        lastAltitude, isFirstCall, verticalSpeed = getverticalSpeedFromInterval(evt, gammaShift, betaShift, thresholdRotation, lastAltitude, os, isFirstCall, verticalSpeed);
    }

    function handleError(error) {
        console.log(error.message);
    }

    $("#requestOrientationPermissionButton").click(function () {
        if ($(this).text() === "Start") {
            console.log("startOrientation clicked");
            $(this).text("Stop");
            timer.start();
            console.log("timer started");
            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
            } else {
                alert("Geolocation not supported.");
            }
            console.log("Requesting permission for DeviceOrientation");
            if (window.DeviceOrientationEvent) {
                console.log("DeviceOrientation supported");
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    console.log("Requesting permission for DeviceOrientation");
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                console.log("Permission granted for DeviceOrientation");
                                if (os === 'iOS' || os === 'MacOS') {
                                    console.log("case 1 Apple");
                                    window.addEventListener('deviceorientation', IOS);
                                } else {
                                    console.log("case 1 Android");
                                    window.addEventListener('deviceorientationabsolute', Android, true);
                                }
                            } else {
                                console.log("Permission not granted for DeviceOrientation");
                            }
                        })
                        .catch(console.error);
                } else {
                    console.log("No need to request permission for DeviceOrientation");
                    if (os === 'iOS') {
                        console.log("case 2 Apple");
                        window.addEventListener('deviceorientation', handleOrientationIOS);
                    } else {
                        console.log("case 2 Android");
                        window.addEventListener('deviceorientationabsolute', Android, true);
                    }
                }
                if (window.DeviceMotionEvent) {
                    console.log("Device motion supported.");
                    if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
                        console.log("Requesting permission for DeviceMotion");
                        DeviceMotionEvent.requestPermission().then(permissionState => {
                            if (permissionState === 'granted') {
                                window.addEventListener('devicemotion', handleMotion, handleError);
                            }
                            else {
                                alert('Permission not granted for DeviceMotion');
                            }
                        }).catch(console.error);
                    }
                    else {
                        $("#motionInfo").text("No need to request permission for DeviceMotion");
                        window.addEventListener('devicemotion', handleMotion, handleError);
                    }
                }
                else {
                    $("#motionInfo").text("Device motion not supported.");
                }
            } else {
               console.log("Device orientation not supported.");
            }
        } else {
            $(this).text("Start");
            navigator.geolocation.clearWatch(watchId);
            timer.stop();
        }
    });
}
