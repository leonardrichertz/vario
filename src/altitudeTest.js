$(document).ready(function () {
  var alpha = 0.8; // Complementary filter parameter
  var lastAcceleration = { x: 0, y: 0, z: 0 };
  var lastTimestamp;

  $("#requestMotionPermissionButton").on("click", function () {
    console.log("Requesting permission for DeviceMotion");
    if (window.DeviceMotionEvent) {
      console.log("Device motion supported.");
      $("#motionInfo").text("Device motion supported.");
      if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
          .then(function (permissionState) {
            if (permissionState === "granted") {
              window.addEventListener("devicemotion", handleMotionEvent, handleMotionError);
            } else {
              alert("Permission not granted for DeviceMotion");
            }
          })
          .catch(console.error);
      } else {
        console.log("No need to request permission for DeviceMotion");
        $("#motionInfo").text("No need to request permission for DeviceMotion");
        window.addEventListener("devicemotion", handleMotionEvent, handleMotionError);
      }
    } else {
      $("#motionInfo").text("Device motion not supported.");
    }
  });

  function handleMotionEvent(event) {
    console.log(event);
    var acceleration = event.accelerationIncludingGravity;
    var timestamp = event.timeStamp;

    if (lastTimestamp) {
      // Calculate time difference since last measurement
      var dt = (timestamp - lastTimestamp) / 1000; // Convert to seconds

      // Apply complementary filter to isolate vertical acceleration
      var filteredAcceleration = {
        x: alpha * lastAcceleration.x + (1 - alpha) * acceleration.x,
        y: alpha * lastAcceleration.y + (1 - alpha) * acceleration.y,
        z: alpha * lastAcceleration.z + (1 - alpha) * acceleration.z
      };

      // Update last acceleration for the next iteration
      lastAcceleration = filteredAcceleration;

      // Extract vertical acceleration (perpendicular to Earth's surface)
      var verticalAcceleration = Math.sqrt(filteredAcceleration.x ** 2 + filteredAcceleration.y ** 2);

      // Output vertical acceleration
      $("#accelerationData").html("Vertical Acceleration: " + verticalAcceleration + " m/s^2");
      console.log("Vertical Acceleration: " + verticalAcceleration + " m/s^2");
    }

    // Update timestamp for the next iteration
    lastTimestamp = timestamp;
  }

  function handleMotionError(error) {
    $("#motionInfo").text("Error accessing motion data: " + error);
    console.error("Error accessing motion data: " + error);
  }
});