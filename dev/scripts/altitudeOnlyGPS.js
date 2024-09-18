import { calculateDistance, calculateManualSpeed, displayDistance, displaySpeed } from '../utils/mapUtils.js';
import { getOS } from '../utils/operatingSystem.js';
import { handleOrientationAndroid, handleOrientationIOS } from '../utils/orientationUtils.js';
import Timer from '../utils/timer.js';
import { playSound, getSoundProfile } from '../utils/sound.js';
import { changeAltitudeIcon, changeSpeedHistory, displayAltitude } from '../utils/altitudeUtils.js';
import { showToast } from '../utils/toast.js';

export function altitudeOnlyGPS() {

    // Updates the app's favicon based on the user's color scheme preference.
    function updateFaviconForColorScheme(){
        const favicon = $('#favicon');
        const appleTouchIcon = $('#apple-touch-icon');
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          favicon.attr('href', './assets/favicon-white.ico');
          appleTouchIcon.attr('href', './assets/icon-192x192-white.png');
        }
        else{
          favicon.attr('href', './assets/favicon.ico');
          appleTouchIcon.attr('href', './assets/icon-192x192.png');
        }
    }
    updateFaviconForColorScheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFaviconForColorScheme);
    var os = getOS();

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
        iconUrl: './assets/marker.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [19, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var markerIcon = L.icon({
        iconUrl: './assets/paraglider.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [19, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    // Define the options for the geolocation.watchposition function.
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

    // EventListener for the save track button.
    $('#saveTrackButton').click(function () {
        // show success message if saving was succesful.
        showToast("Save Track button clicked. The flight was " + timer.getSeconds() + " seconds long", 'success', 3000);
        // saveFlightData(); Replace with the function to save the flight data.
        navigator.geolocation.clearWatch(watchId);
        timer.stop();
    });


    function OrientationIOS(event) {
        const alpha = handleOrientationIOS(event);
        $("#compass").css("transform", "rotate(" + (360 - alpha) + "deg)");
    }

    function OrientationAndroid(event) {
        const { alpha, beta, gamma } = handleOrientationAndroid(event);
        $("#compass").css("transform", "rotate(" + alpha + "deg)");
    }

    function handleGeolocation(position) {
        var latlng = [position.coords.latitude, position.coords.longitude];
        const newAltitude = position.coords.altitude;
        const currentTime = Date.now();
        if (lastTimestamp !== 0 && newAltitude !== null) {
            const altitudeDifference = newAltitude - lastAltitude;
            // convert milliseconds to seconds
            const timeDifference = (currentTime - lastTimestamp) / 1000;
            let speed = altitudeDifference / timeDifference;
            handleVerticalSpeed(speed);
        }
        lastAltitude = newAltitude;
        lastTimestamp = currentTime;

        displayAltitude(lastAltitude);

        if (marker.getLatLng().lat !== 0 && marker.getLatLng().lng !== 0) {
            var oldLatLng = marker.getLatLng();
            L.polyline([oldLatLng, latlng], { color: 'blue' }).addTo(map);
            distance += calculateDistance(oldLatLng.lat, oldLatLng.lng, position.coords.latitude, position.coords.longitude);
            displayDistance(distance);
        }
        marker.setLatLng(latlng).setIcon(markerIcon).update();
        map.setView(latlng);

        if (typeof startMarker == 'undefined') {
            startMarker = L.marker([position.coords.latitude, position.coords.longitude], { icon: startMarkerIcon }).addTo(map);
        }
        displayDistance(distance);
        var speed = position.coords.speed;
        if (speed !== null && !isNaN(speed)) {
            displaySpeed(speed);
        } else {
            var result = calculateManualSpeed(position, lastPosition, lastTimestamp);
            lastPosition = result.lastPosition;
            lastTimestamp = result.lastTimestamp;
            var manualSpeed = result.manualSpeed;
            displaySpeed(manualSpeed);
        }
        // Save the necessary data to the save object. This has to be specified by the implementer,
        // but all the necessary data is available.
        // writeDatatoSaveObject(position, lastTimestamp);
    }

    function handleVerticalSpeed(speed) {
        const averageSpeed = changeSpeedHistory(speedHistory, speed);
        let trendAdjustedSpeed = speed;
        if (speed * 0.7 < averageSpeed || speed * 1.3 > averageSpeed) {
            trendAdjustedSpeed = speed * 0.7 + averageSpeed * 0.3;
        }
        const soundChoice = changeAltitudeIcon(trendAdjustedSpeed);
        const soundProfile = getSoundProfile(soundChoice);
        const context = playSound(soundProfile, audioContext);
        audioContext = context;
    }

    function handleError(error) {
        showToast("Error with the Geolocation, if this issue persists try reloading the page and restarting the tracking.", 'error', 4000);
    }

    $("#requestOrientationPermissionButton").click(function () {
        if ($(this).text() === "Start") {
            $(this).text("Stop");
            timer.start();
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
            } else {
                showToast("Geolocation not supported.", 'error', 3000);
            }
            if (window.DeviceOrientationEvent) {
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                if (os === 'iOS' || os === 'MacOS') {
                                    window.addEventListener('deviceorientation', OrientationIOS);
                                } else {
                                    window.addEventListener('deviceorientationabsolute', OrientationAndroid, true);
                                }
                            } else {
                                showToast("Permission not granted for DeviceOrientation", 'error', 3000);
                            }
                        })
                        .catch(error => {
                            showToast("Error requesting DeviceOrientation permission. Try reloading the page.", 'error', 4000);
                        });
                } else {
                    if (os === 'iOS') {
                        window.addEventListener('deviceorientation', handleOrientationIOS);
                    } else {
                        window.addEventListener('deviceorientationabsolute', OrientationAndroid, true);
                    }
                }
            } else {
                showToast("Device orientation not supported", 'error', 3000);
            }
        } else {
            $(this).text("Start");
            navigator.geolocation.clearWatch(watchId);
            timer.stop();
        }
    });
}