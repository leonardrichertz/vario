$(document).ready(function() {

            function updateHeight(position) {
            var altitude = position.coords.altitude;
            console.log("Höhe: " + altitude.toFixed(2) + " Meter");
            $("#hoehe").html("<br>heading:" + altitude.toFixed(2));
        
        }

        // Funktion zur Behandlung von Fehlern bei der Standortabfrage
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

        // Funktion zum Starten der Höhenüberwachung
        function startHeightWatch() {
            if ("geolocation" in navigator) {
                var watchID = navigator.geolocation.watchPosition(updateHeight, errorHandler, { enableHighAccuracy: true });
                console.log("Höhenüberwachung gestartet (ID: " + watchID + ")");
            } else {
                console.error("Geolocation wird von diesem Browser nicht unterstützt.");
            }
        }

        // Funktion zum Stoppen der Höhenüberwachung
        function stopHeightWatch() {
            if ("geolocation" in navigator) {
                navigator.geolocation.clearWatch(watchID);
                console.log("Höhenüberwachung gestoppt");
            } else {
                console.error("Geolocation wird von diesem Browser nicht unterstützt.");
            }
        }

        })

