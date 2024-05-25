$(document).ready(function () {

    function getOS() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        if (/Win/i.test(userAgent)) {
            return "Windows";
        }
        if (/Mac/i.test(userAgent)) {
            return "MacOS";
        }
        if (/Linux/i.test(userAgent)) {
            return "Linux";
        }
        return "unknown";
    }

    var os = getOS();
    console.log("Operating System: " + os);

    var map = L.map('map').setView([49.75, 6.63], 12);
    var marker;
    var startMarker
    var watchId;
    var distance = 0;
    
    var lastPosition = null;
    var lastTimestamp = null;

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

    marker = L.marker([0,0], { icon: markerIcon }).addTo(map).bindPopup("You are here");


    $("#start").text("Karte, Geschwindigkeit und Distanz");

    // Function to handle device orientation data for iOS
    function handleOrientationIOS(event) {
        $("#osInfo").html("Operating System: " + os);
        var alpha;
        if (typeof event.webkitCompassHeading !== "undefined") {
            alpha = event.webkitCompassHeading; // iOS non-standard
            alpha = Math.round(alpha * 100) / 100; // Normalize value
            $("#compass").css("transform", "rotate(" + alpha + "deg)");
        }
        var beta = Math.round(event.beta * 100) / 100;  // rotation around x-axis
        var gamma = Math.round(event.gamma * 100) / 100; // rotation around y-axis

        // Display device orientation data
        $("#orientationData").html("<br>Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }

    function handleOrientationAndroid(event) {
        $("#osInfo").html("Operating System: " + os);
        var alpha = Math.round(event.alpha * 100) / 100; // Normalize value
        var beta = Math.round(event.beta * 100) / 100;  // rotation around x-axis
        var gamma = Math.round(event.gamma * 100) / 100; // rotation around y-axis

        $("#compass").css("transform", "rotate(" + (360 - alpha) + "deg)");

    
        $("#orientationData").html("<br>Alpha: " + (360 - alpha ) + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }
    
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
            console.log("Current speed:", speed, "m/s");
            $("#speed").html("<br>Speed: " + speed.toFixed(2) + " m/s <br> Speed: " + (speed * 3.6).toFixed(2) + " km/h ");
        } else {
            //console.log("Current speed:", speed, "m/s");
            //console.log(position.coords)
            //$("#speed").html("Current speed not available, but it is: " + speed + " m/s <br> Speed: " + (speed * 3.6).toFixed(2) + " km/h " );
        
            var manualSpeed = calculateManualSpeed(position);
            console.log("Calculated speed:", manualSpeed, "m/s");
            $("#speed").html("<br>Calculated Speed: " + manualSpeed.toFixed(2) + " m/s <br> Calculated Speed: " + (manualSpeed * 3.6).toFixed(2) + " km/h ");
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

    function calculateManualSpeed(position) {
        if (lastPosition && lastTimestamp) {
            const deltaTime = (position.timestamp - lastTimestamp) / 1000; // Convert ms to s
            const distance = calculateDistance(lastPosition.coords.latitude, lastPosition.coords.longitude, position.coords.latitude, position.coords.longitude);
            const speed = distance / deltaTime; // m/s
            lastPosition = position;
            lastTimestamp = position.timestamp;
            return speed;
        }
        lastPosition = position;
        lastTimestamp = position.timestamp;
        return 0;
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
                            if (os === 'iOS' || os === 'MacOS') {
                                console.log("iOS device detected");
                                window.addEventListener('deviceorientation', handleOrientationIOS);
                            } else {
                                console.log("Android device detected");
                                window.addEventListener('deviceorientationabsolute', handleOrientationAndroid, true);
                            }
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
                    if (os === 'iOS') {
                        window.addEventListener('deviceorientation', handleOrientationIOS);
                    } else {
                        window.addEventListener('deviceorientationabsolute', handleOrientationAndroid, true);
                    }
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