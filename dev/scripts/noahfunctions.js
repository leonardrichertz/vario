$(document).ready(function () {
    let initialAltitude;
    let previousAltitude;
    let currentAltitude;
    let counter = 0;
    let watchId;
    let threshold = 0.1;
    
    const ascentSound = $("#ascentSound");
    const descentSound = $("#descentSound");

    $("#startHeightWatch").click(function () {
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(updateHeight, errorHandler, { enableHighAccuracy: true, maximumAge: 0, timeout: 100 });
        } else {
            console.error("Geolocation wird von diesem Browser nicht unterstützt.");
        }
    });

    $("#stopHeightWatch").click(function () {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            console.log("Höhenüberwachung gestoppt");
        }
    });

    function updateHeight(position) {
        if (counter === 0) {
            initialAltitude = position.coords.altitude;
            previousAltitude = initialAltitude;
            currentAltitude = initialAltitude;
            counter++;
        } else {
            counter++;
            const { latitude, longitude, altitude } = position.coords;
            currentAltitude = altitude;

            if (currentAltitude - previousAltitude < -threshold) {
                $("#threshold").html("Schwellwert übertroffen");
                $("#ascent_descent").html("Abstieg");
                descentSound.play();
            } else if (currentAltitude - previousAltitude > threshold) {
                $("#threshold").html("Schwellwert übertroffen");
                $("#ascent_descent").html("Aufstieg");
                ascentSound.play();
            } else {
                $("#threshold").html("Schwellwert nicht übertroffen");
                $("#ascent_descent").html("Keine Änderung");
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
