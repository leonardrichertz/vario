$(document).ready(function () {
    var map = L.map('map').setView([0, 0], 13);
    var marker;
    var startMarker
    var watchId;
    var distance = 0;
    var startMarkerIcon = L.icon({
        iconUrl: '../assets/marker.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [19, 50], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var markerIcon = L.icon({
        iconUrl: '../assets/paraglider.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [19, 50], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    })

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
    
    // Function to handle geolocation data
    function handleGeolocation(position) {
        

        var latlng = [position.coords.latitude, position.coords.longitude];
        if (marker.getLatLng().lat !== 0 && marker.getLatLng().lng !== 0) {

            //Line between old and new Position
            var oldLatLng = marker.getLatLng();
            var polyline = L.polyline([oldLatLng, latlng], { color: 'blue' }).addTo(map);


            //calculate distance
            distance += calculateDistance(oldLatLng.lat, oldLatLng.lng, position.coords.latitude, position.coords.longitude);
            $("#distance").html("<br>distance: " + distance.toFixed(3));
        }

        //Set the new marker to current location
        marker.setLatLng(latlng).setIcon(markerIcon).update();
        map.setView(latlng);

        //Set the startMarker once to initial position
        if(typeof startMarker == 'undefined'){
            startMarker = L.marker([position.coords.latitude, position.coords.longitude], {icon: startMarkerIcon}).addTo(map);
        }  

        //display distance
        $("#distance").html("<br>distance: " + distance.toFixed(3));

        // Display geolocation data
        $("#geolocationData").html("<br>Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
        
        var speed = position.coords.speed;
        // Display current speed
        if (speed !== null && !isNaN(speed)) {
            var speed = position.coords.speed;
            $("#speed").html("<br>Speed: " + speed.toFixed(2) + " m/s <br> Speed: " + (speed * 3.6).toFixed(2) + " km/h ");
        } else {
            var speed = position.coords.speed;
            $("#speed").html("<br>Speed: " + 0 + " m/s <br> Speed: " + (speed * 3.6).toFixed(2) + " km/h ");
        }
        
    }

    // Calulation of distance between two position with the Haversine-Formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // radius of the earth
        const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
        const dLon = (lon2 - lon1) * Math.PI / 180; // Von Gradmaß zu bogenmaß
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    // Function to handle geolocation errors
    function handleError(error) {
        // Handle error
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    $("#requestOrientationPermissionButton").click(function () {
        // Check if the device supports DeviceOrientationEvent
        if (window.DeviceOrientationEvent) {
            $("#orientation").text("Device orientation supported.");
            // Check if we need to request permission (iOS 13+)
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                $("#orientationInfo").text("Requesting permission for DeviceOrientation");
                console.log("Requesting permission for DeviceOrientation");
                // Request permission
                // The request permission is only needed for iOS 13+ devices and it is only available in Safari.
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            $("#permission").text("Permission granted for DeviceOrientation");
                            // Permission granted, add event listener
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            $("#permission").text("Permission not granted for DeviceOrientation");
                            console.log("Permission not granted for DeviceOrientation");
                            // Permission not granted
                            alert('Permission not granted for DeviceOrientation');
                        }
                    })
                    .catch(console.error);
            } else {
                $("#orientationInfo").text("No need to request permission for DeviceOrientation");
                console.log("No need to request permission for DeviceOrientation");
                // No need to request permission, add event listener directly
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } else {
            $("#orientation").text("Device orientation not supported.");
        }
    });
 
    // Stops trtackiing the users geolocation
    $("#stopGeolocation").click(function () {
        navigator.geolocation.clearWatch(watchId);
        $("#geolocationData").text("Geolocation data stopped.");
        $("#startGeolocation").prop("disabled", false);
    });

    // Starts tracking the users geolocation
    $("#startGeolocation").click(function () {
        startGeolocation();
    });

    // Function to start geolocation
    function startGeolocation() {
        // Get geolocation data once
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
            
        } else {
            // Geolocation not supported
            $("#geolocationData").text("Geolocation not supported.");
        } 
    }
    // Get geolocation data continuously
    if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError, options);
        $("#startGeolocation").prop("disabled", true);
    } else {
        // Geolocation not supported
        $("#geolocationData").text("Geolocation not supported.");
    }
});