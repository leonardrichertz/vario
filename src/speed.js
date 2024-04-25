    var velocity = { x: 0, y: 0, z: 0 }; // Initialize velocity
    var displacement = { x: 0, y: 0, z: 0 }; // Initialize displacement
    var previousTimestamp = null; // Variable to store the previous timestamp



function handleMotion(event) {
    var acceleration = event.acceleration;
    var currentTimestamp = event.timeStamp; // Get current timestamp
    var deltaTime = previousTimestamp ? (currentTimestamp - previousTimestamp) / 1000 : 0; // Convert milliseconds to seconds

    velocity.x += acceleration.x * deltaTime; // Calculate velocity
    velocity.y += acceleration.y * deltaTime;
    velocity.z += acceleration.z * deltaTime;

    displacement.x += velocity.x * deltaTime; // Calculate displacement
    displacement.y += velocity.y * deltaTime;
    displacement.z += velocity.z * deltaTime;

    var speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 +velocity.z ** 2); // Calculate speed

    $("#motionSpeed").html("Motion Data Speed: " + speed.toFixed(2) + " m/s");
    // Display acceleration data
    $("#motionData").html("Acceleration: <br>x: " + event.acceleration.x + "<br>y: " + event.acceleration.y + "<br>z: " + event.acceleration.z);
}


// Request permission for DeviceMotion
$("#requestMotionPermissionButton").click(function () {
    if (window.DeviceMotionEvent) {
        $("#motion").html("Device motion supported.");
        if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                }
                else {
                    alert('Permission not granted for DeviceMotion');
                }
            }).catch(console.error);
        }
        else {
            $("#motionInfo").text("No need to request permission for DeviceMotion");
            window.addEventListener('devicemotion', handleMotion);
        }
    }
    else {
        $("#motionInfo").html("Device motion not supported.");
    }
});
