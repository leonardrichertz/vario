import { calculateDistance, calculateManualSpeed } from '../utils/mapUtils.js';
import { getOS } from '../utils/operatingSystem.js';
import { handleOrientationAndroid, handleOrientationIOS } from '../utils/orientationUtils.js';
import Timer from '../utils/timer.js';

export function map() {
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
        const {alpha, beta, gamma} = handleOrientationAndroid(event);
        $("#compass").css("transform", "rotate(" + alpha + "deg)");
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
            $("#speed").html("Geschwindigkeit über Boden: ", speed.toFixed(2));
        } else {
            var result = calculateManualSpeed(position, lastPosition, lastTimestamp);
            lastPosition = result.lastPosition;
            lastTimestamp = result.lastTimestamp;
            var manualSpeed = result.manualSpeed;
            $("#speed").html("Geschwindigkeit über Boden: ", manualSpeed.toFixed(2));
        }
    }

    function handleError(error) {
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    $("#requestOrientationPermissionButton").click(function () {
        if($(this).text() === "Start"){
            $(this).text("Stop");
            $(this).attr("id", "stopOrientation");
            timer.start();
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
                    window.addEventListener('deviceorientation', handleOrientationIOS);
                } else {
                    console.log("case 2 Android");
                    window.addEventListener('deviceorientationabsolute', handleOrientationAndroid, true);
                }
            }
        } else {
            $("#orientation").text("Device orientation not supported.");
        }
    } else {
        $(this).text("Start");
        $(this).attr("id", "requestOrientationPermissionButton");
        navigator.geolocation.clearWatch(watchId);
        timer.stop();
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
