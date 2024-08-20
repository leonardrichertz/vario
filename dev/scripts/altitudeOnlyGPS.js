import { calculateDistance, calculateManualSpeed } from '../utils/mapUtils.js';
import { getOS } from '../utils/operatingSystem.js';
import { handleOrientationAndroid, handleOrientationIOS } from '../utils/orientationUtils.js';
import Timer from '../utils/timer.js';
import { descentProfile, ascentProfile } from '../utils/soundprofile.js';
import { playSound } from '../utils/sound.js';
import { changeAltitudeIcon, changeSpeedHistory, displayAltitude } from '../utils/altitudeUtils.js';
import { showToast } from '../utils/toast.js';

export function altitudeOnlyGPS() {
    var os = getOS();
    console.log("Operating System: " + os);

    // Define these variables in the correct scope
    var lastPosition = null;
    var lastTimestamp = null;
    const timer = new Timer();

    var map = L.map('map').setView([49.75, 6.63], 12);
    var marker;
    var startMarker;
    var watchId;
    var distance = 0;
    var lastAltitude = 0;
    var audioContext = null;
    var speedHistory = [];

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

    $('#saveTrackButton').click(function () {
        console.log("Save Track button clicked");
        // saveFlightData();
    });

    function IOS(event) {
        const alpha = handleOrientationIOS(event);
        $("#compass").css("transform", "rotate(" + (360 - alpha) + "deg)");
    }

    function Android(event) {
        const alpha = handleOrientationAndroid(event);
        $("#compass").css("transform", "rotate(" + alpha + "deg)");
    }

    function handleGeolocation(position) {
        // writeDatatoSaveObject(position);
        console.log("handleGeolocation event triggered");
        var latlng = [position.coords.latitude, position.coords.longitude];
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
            let speed = altitudeDifference / timeDifference;
            handleVerticalSpeed(speed);
        }
        lastAltitude = newAltitude;
        lastTimestamp = currrentTime;

        displayAltitude(lastAltitude);

        if (marker.getLatLng().lat !== 0 && marker.getLatLng().lng !== 0) {
            var oldLatLng = marker.getLatLng();
            L.polyline([oldLatLng, latlng], { color: 'blue' }).addTo(map);
            distance += calculateDistance(oldLatLng.lat, oldLatLng.lng, position.coords.latitude, position.coords.longitude);
            $("#distance").html(distance.toFixed(3));
        }

        marker.setLatLng(latlng).setIcon(markerIcon).update();
        map.setView(latlng);

        if (typeof startMarker == 'undefined') {
            startMarker = L.marker([position.coords.latitude, position.coords.longitude], { icon: startMarkerIcon }).addTo(map);
        }

        $("#distance").html(distance.toFixed(3));

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

    function handleVerticalSpeed(speed) {
        const averageSpeed = changeSpeedHistory(speedHistory, speed);
        const trendAdjustedSpeed = speed * 0.8 + averageSpeed * 0.2;
        changeAltitudeIcon(trendAdjustedSpeed);
        // Take the average of the last 4 speed values into consideration.
        $("#verticalSpeed").html(trendAdjustedSpeed.toFixed(2));
        if (trendAdjustedSpeed > 0) {
            console.log("trendAdjustedSpeed Ascent speed: " + trendAdjustedSpeed.toFixed(2));
            const context = playSound(ascentProfile, audioContext);
            audioContext = context;
        }
        else {
            console.log("Descent speed: " + trendAdjustedSpeed.toFixed(2));
            const context = playSound(descentProfile, audioContext);
            audioContext = context;
        }
        changeSpeedHistory(speedHistory, speed);
    }

    function handleError(error) {
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    $("#requestOrientationPermissionButton").click(function () {
        showToast("Requesting permission for DeviceOrientation", 'info', 2000);
        if ($(this).text() === "Start") {
            console.log("startOrientation clicked");
            $(this).text("Stop");
            timer.start();
            console.log("timer started");
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
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