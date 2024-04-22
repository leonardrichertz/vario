$(document).ready(function(){
    $("#start").text("Device orientation and geolocation data");
    // Function to handle device orientation data
    function handleOrientation(event) {
        var alpha;
        if (event.webkitCompassHeading !== undefined) {
            $("#webkit").text("webkitCompassHeading supported.");
            alpha = event.webkitCompassHeading; // iOS
        } else {
            $("#webkit").text("webkitCompassHeading not supported.");
            alpha = event.alpha; // non-iOS
        }
    
        
        alpha = Math.round(alpha * 100) / 100; // Normalize value
        
        var beta     = Math.round(event.beta * 100) / 100;  // rotation around x-axis
        var gamma    = Math.round(event.gamma * 100) / 100; // rotation around y-axis

        $("#compass").css("transform", "rotate(" + alpha + "deg)");

        // Display device orientation data
        $("#orientationData").html("<br>Alpha: " + alpha + "<br>Beta: " + beta + "<br>Gamma: " + gamma);
    }
    // requestDeviceOrientation
    function requestDeviceOrientation(){
        if(typeof DeviceOrientationEvent != 'undefined'&& typeof DeviceOrientationEvent.requestPermission ==='function'){
           // ios 13 and higher
           try {
            const permissionState = DeviceOrientationEvent.requestPermission()
            if(permissionState==='granted'){
                window.addEventListener('deviceorientation',handleOrientation)
            }
           } catch (error) { console.error(error)
            
           } 
        }
        else if('DeviceorientationEvent'in window){
            // not ios 13 or higher
            window.addEventListener('deviceorientation',handleOrientation)
        }
        else{
            // deviceorientation is not supported
            alert('not supported')
        }
    }

    // Function to handle geolocation data
    function handleGeolocation(position) {
        // Display geolocation data
        $("#geolocationData").html("<br>Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    }

    // Function to handle geolocation errors
    function handleError(error) {
        // Handle error
        $("#geolocationData").text("Geolocation error: " + error.message);
    }

    // Check if the device supports DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
        // Add event listener for device orientation
        console.log("Device orientation supported.");
        $("#orientation").text("Device orientation supported.");
        window.addEventListener('deviceorientation', handleOrientation, false);
    } else {
        // Device orientation not supported
        console.log("Device orientation not supported.");
        $("#orientation").text("Device orientation not supported.");
    }

    // Get geolocation data continuously
    if (navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(handleGeolocation, handleError);
    } else {
        // Geolocation not supported
        $("#geolocationData").text("Geolocation not supported.");
    }

    // Gravity for measuring speed
    let gravitySensor = new GravitySensor({ frequency: 1 }); 

    gravitySensor.addEventListener("reading", (e) => {
     // console.log(`Gravity along the X-axis ${gravitySensor.x}`);
     // console.log(`Gravity along the Y-axis ${gravitySensor.y}`);
      console.log(`Gravity along the Z-axis ${gravitySensor.z-9.81}`); // substraction of earthgravity 
    });
    
    gravitySensor.start();
    


});
