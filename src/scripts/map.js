import { calculateDistance, calculateManualSpeed } from '../utils/mapUtils.js';
import { getOS } from '../utils/operatingSystem.js';
import { handleOrientationIOS, handleOrientationAndroid, requestOrientationPermission } from '../utils/orientationUtils.js';

$(document).ready(function () {
    var os = getOS();
    console.log("Operating System: " + os);

    var map = L.map('map').setView([49.75, 6.63], 12);
    var marker;
    var startMarker;
    var watchId;
    var distance = 0;

    var startMarkerIcon = L.icon({
        iconUrl: '../assets/marker.png',
        iconSize: [38, 50],
        iconAnchor: [19, 50],
        popupAnchor: [-3, -76]
    });

    var markerIcon = L.icon({
        iconUrl: '../assets/paraglider.png',
        iconSize: [38, 50],
        iconAnchor: [19, 50],
        popupAnchor: [-3, -76]
    });

    const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
    };

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([0, 0], { icon: markerIcon }).addTo(map).bindPopup("You are here");

    $("#start").text("Karte, Geschwindigkeit und Distanz");

    function updateOrientationData(data) {
        $("#osInfo").html("Operating System: " + os);
        $("#compass").css("transform", "rotate(" + (data.alpha || 0) + "deg)");
        $("#orientationData").html(`<br>Alpha: ${data.alpha}<br>Beta: ${data.beta}<br>Gamma: ${data.gamma}`);
    }

    $("#requestOrientationPermissionButton").click(function () {
        requestOrientationPermission(os).then(permission => {
            if (permission.granted) {
                $("#permission").text("Permission granted for DeviceOrientation");
                if (permission.os === 'iOS' || permission.os === 'MacOS') {
                    window.addEventListener('deviceorientation', event => {
                        const orientationData = handleOrientationIOS(event);
                        updateOrientationData(orientationData);
                    });
                } else {
                    window.addEventListener('deviceorientationabsolute', event => {
                        const orientationData = handleOrientationAndroid(event);
                        updateOrientationData(orientationData);
                    }, true);
                }
            } else {
                $("#permission").text("Permission not granted for DeviceOrientation");
                alert('Permission not granted for DeviceOrientation');
            }
        }).catch(console.error);
    });

    function handleGeolocation(position) {
        var latlng = [position.coords.latitude, position.coords.longitude];
        if (marker.getLatLng().lat !== 0 && marker.getLatLng().lng !== 0) {
            var oldLatLng = marker.getLatLng();
            var polyline = L.polyline([oldLatLng, latlng], { color: 'blue' }).addTo(map);
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
            $("#speed").html("<br>Speed: " + speed.toFixed(2) + " m/s <br> Speed: " + (speed * 3.6).toFixed(2) + " km/h ");
        } else {
            var manualSpeed = calculateManualSpeed(position);
            $("#speed").html("<br>Calculated Speed: " + manualSpeed.toFixed(2) + " m/s <br> Calculated Speed: " + (manualSpeed * 3.6).toFixed(2) + " km/h ");
        }
    }

    function handleError(error) {
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

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
            $("#startGeolocation").prop("disabled", true);
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
});
