$(document).ready(function() {
    let watchID;

    $("#startHeightWatch").click(function() {
        if ('geolocation' in navigator) {
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
        console.log("Höhe: " + altitude.toFixed(2) + " Meter");
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
