$(document).ready(function () {
    function handleError() {
        $("#altitudeData").text("Error getting altitude.");
    }
    const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
    };
    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(function (position) {
            var altitude = position.coords.altitude;
            $("#altitudeData").text("Altitude: " + altitude);
            // Use the altitude value here
        }, handleError, options);
    }
    else {
        $("#altitudeData").text("Geolocation not supported.");
    }
});
