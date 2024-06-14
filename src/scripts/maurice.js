// scripts/map.js
import { calculateDistance, calculateManualSpeed } from '../utils/mapUtils.js';
import { getOS } from '../utils/operatingSystem.js';
import { handleOrientationAndroid, handleOrientationIOS } from '../utils/orientationUtils.js';

export function map() {
    var os = getOS();
    console.log("Operating System: " + os);
    lastPosition = null;
    lastTimestamp = null;

    var map = L.map('map').setView([49.75, 6.63], 12);
    var marker;
    var startMarker;
    var watchId;
    var distance = 0;

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
        const {alpha, beta, gamma} = handleOrientationIOS(event);
        $("#compass").css("transform", "rotate(" + alpha + "deg)");
        $("#orientationData").html("<br>Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }

    function Android(event) {
        console.log("Android function called");
        const {alpha, beta, gamma} = handleOrientationAndroid(event);
        $("#compass").css("transform", "rotate(" + (360 - alpha) + "deg)");
        console.log(alpha);
        $("#orientationData").html("<br>Alpha: " + (360 - alpha) + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }

    function handleGeolocation(position) {
        var latlng = [position.coords.latitude, position.coords.longitude];
        if (marker.getLatLng().lat !== 0 && marker.getLatLng().lng !== 0) {
            var oldLatLng = marker.getLatLng();
            L.polyline([oldLatLng, latlng], { color: 'blue' }).addTo(map);
            distance += calculateDistance(oldLatLng.lat, oldLatLng.lng, position.coords.latitude, position.coords.longitude);
            $("#distance").html("<br>distance: " + distance.toFixed(3));
        }

        marker.setLatLng(latlng).setIcon(markerIcon).update();
        map.setView(latlng);

        if (typeof startMarker == 'undefined') {
            startMarker = L.marker([position.coords.latitude, position.coords.longitude], { icon: startMarkerIcon }).addTo(map);
        }

        $("#distance").html("<br>distance: " + distance.toFixed(3));
        $("#geolocationData").html("<br>Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);

        var speed = position.coords.speed;
        if (speed !== null && !isNaN(speed)) {
            $("#speed").html(speed.toFixed(2));
        } else {
            var manualSpeed, lastPosition, lastTimestamp = calculateManualSpeed(position, lastPosition, lastTimestamp);
            $("#speed").html(manualSpeed.toFixed(2));
        }
    }

    function handleError(error) {
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    $("#requestOrientationPermissionButton").click(function () {
        console.log("Button clicked");
        if (window.DeviceOrientationEvent) {
            $("#orientation").text("Device orientation supported.");
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                $("#orientationInfo").text("Requesting permission for DeviceOrientation");
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            $("#permission").text("Permission granted for DeviceOrientation");
                            if (os === 'iOS' || os === 'MacOS') {
                                window.addEventListener('deviceorientation', IOS);
                            } else {
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
                if (os === 'iOS' || os === 'MacOS') {
                    window.addEventListener('deviceorientation', handleOrientationIOS);
                } else {
                    //window.addEventListener('deviceorientationabsolute', handleOrientationAndroid, true);
                    window.addEventListener('deviceorientationabsolute', Android, true);
                }
            }
        } else {
            $("#orientation").text("Device orientation not supported.");
        }
    });

    $("#stopGeolocation").click(function () {
        navigator.geolocation.clearWatch(watchId);
        $("#geolocationData").text("Geolocation data stopped.");
        $("#startGeolocation").prop("disabled", false);
    });

    $("#startGeolocation").click(function () {
        startGeolocation();
    });

    function startGeolocation() {
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
        } else {
            $("#geolocationData").text("Geolocation not supported.");
        }
    }

    if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
        $("#startGeolocation").prop("disabled", true);
    } else {
        $("#geolocationData").text("Geolocation not supported.");
    }
}
