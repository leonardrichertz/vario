$(document).ready(function() {
    let watchID;
    let initialAltitude;
    let previousAltitude;
    let currentAltitude;

    $("#startHeightWatch").click(function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                initialAltitude = position.coords.altitude;
                previousAltitude = initialAltitude;
            }, errorHandler, { enableHighAccuracy: true });
            watchID = navigator.geolocation.watchPosition(updateHeight, errorHandler, { enableHighAccuracy: true });
            console.log("Höhenüberwachung gestartet (ID: " + watchID + ")");
        } else {
            console.error("Geolocation wird von diesem Browser nicht unterstützt.");
        }
    });

    $("#stopHeightWatch").click(function() {
        if ("geolocation" in navigator) {
            navigator.geolocation.clearWatch(watchID);
            console.log("Höhenüberwachung gestoppt");
        } else {
            console.error("Geolocation wird von diesem Browser nicht unterstützt.");
        }
    });

    function updateHeight(position) {
        const { latitude, longitude, altitude } = position.coords;
        currentAltitude = altitude;
        if (previousAltitude - currentAltitude >= 0) {
            $("#ascent_descent").html("Abstieg");
            // abstieg
        }
        else if (previousAltitude - currentAltitude < 0) {
            $("#ascent_descent").html("Aufstieg");
            // aufstieg
        }
        previousAltitude = currentAltitude;
        console.log("Höhe: " + altitude + " Meter");
        $("#height").html("Longitude: " + longitude + " | Höhe: " + altitude.toFixed(2) + " Meter<br>");
        $("#latitude").html("Latitude: " + latitude);
    }

    function errorHandler(error) {
        switch(error.code) {
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
