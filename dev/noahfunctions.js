$(document).ready(function () {
    let initialAltitude;
    let previousAltitude;
    let currentAltitude;
    let counter = 0;
    let watchId;

    $("#startHeightWatch").click(function () {
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(updateHeight, errorHandler, { enableHighAccuracy: true, timeout: 200 });
            // Request altitude updates at a high frequency (approximately 10 times per second)
        } else {
            console.error("Geolocation wird von diesem Browser nicht unterstützt.");
        }
    });

    $("#stopHeightWatch").click(function () {
        stopwatch = navigator.geolocation.clearWatch(watchId);
        console.log("Höhenüberwachung gestoppt");
    });

    function updateHeight(position) {
        if (counter = 0) {
            initialAltitude = position.coords.altitude;
            previousAltitude = initialAltitude;
            currentAltitude = initialAltitude;
            counter++;
        }
        else {
            counter++;
            const { latitude, longitude, altitude } = position.coords;
            currentAltitude = altitude;
            if (previousAltitude - currentAltitude >= 0) {
                $("#ascent_descent").html("Abstieg");
            } else if (previousAltitude - currentAltitude < 0) {
                $("#ascent_descent").html("Aufstieg");
            }
            previousAltitude = currentAltitude;
            console.log("Höhe: " + altitude + " Meter");
            $("#height").html("Longitude: " + longitude + " | Höhe: " + altitude + " Meter<br>");
            $("#latitude").html("Latitude: " + latitude + " | Counter: " + counter + "<br>");
        }
    }

    function errorHandler(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error("Benutzer hat die Standortfreigabe abgelehnt.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Höheninformationen sind nicht verfügbar.");
                break;
            case error.TIMEOUT:
                console.error("Die Höhenabfrage dauerte zu lange.");
                break;
            case error.UNKNOWN_ERROR:
                console.error("Ein unbekannter Fehler ist aufgetreten.");
                break;
        }
    }
});
