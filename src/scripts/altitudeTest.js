$(document).ready(function () {

  let initialAltitude = 0;
  let currentAltitude = 0;
  let gammaShift = 0;
  let betaShift = 0;

  const thresholdRotation = 1.5

  function handleError() {
    $("#altitudeData").text("Error getting altitude.");
}

  function handleMotionError(){
      $("#motionInfo").text("Error in deviceMotion.");
  }

  const options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,
  };

  $("#requestAltitudeButton").click(function () {
      if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(function (position) {
              initialAltitude = position.coords.altitude;
              $("#altitudeData").text("Altitude: " + initialAltitude);
          }, handleError, options);
          // Check if the device supports DeviceOrientationEvent
          if (window.DeviceOrientationEvent) {
              $("#orientation").text("Device orientation supported.");
              // Check if we need to request permission (iOS 13+)
              if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                  $("#orientationInfo").text("Requesting permission for DeviceOrientation");
                  // The request permission is only needed for iOS 13+ devices and it is only available in Safari.
                  DeviceOrientationEvent.requestPermission()
                      .then(permissionState => {
                          if (permissionState === 'granted') {
                              $("#permission").text("Permission granted for DeviceOrientation");
                              // Permission granted, add event listener
                              window.addEventListener('deviceorientation', handleOrientation);
                          } else {
                              $("#permission").text("Permission not granted for DeviceOrientation");
                              // Permission not granted
                              alert('Permission not granted for DeviceOrientation');
                          }
                      })
                      .catch(console.error);
              } else {
                  $("#orientationInfo").text("No need to request permission for DeviceOrientation");
                  // No need to request permission, add event listener directly
                  window.addEventListener('deviceorientation', handleOrientation);
              }
              if (window.DeviceMotionEvent) {
                  $("#motion").text("Device motion supported.");
                  if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
                      $("#motionInfo").text("Requesting permission for DeviceMotion");
                      DeviceMotionEvent.requestPermission().then(permissionState => {
                          if (permissionState === 'granted') {
                              window.addEventListener('devicemotion', handleMotion, handleMotionError);
                          }
                          else {
                              alert('Permission not granted for DeviceMotion');
                          }
                      }).catch(console.error);
                  }
                  else {
                      $("#motionInfo").text("No need to request permission for DeviceMotion");
                      window.addEventListener('devicemotion', handleMotion, handleMotionError);
                  }
              }
              else {
                  $("#motionInfo").text("Device motion not supported.");
              }

          } else {
              $("#orientation").text("Device orientation not supported.");
          }
      }
      else {
          $("#altitudeData").text("Geolocation not supported.");
      }
  });

  function handleMotion(evt) {
    console.log("Hanlde Motion" + evt)
    let accelarationInUpDown = 0

    let accelerationZ1 = evt.acceleration.z;
    let accelerationY1 = evt.acceleration.y;
    let accelerationX1 = evt.acceleration.x;

    $("#AccelerationX").text("Acceleration X: "+ accelerationX1);
    $("#AccelerationY").text("Acceleration Y: "+ accelerationY1);
    $("#AccelerationZ").text("Acceleration Z: "+ accelerationZ1);

    switch (true) {
      case (gammaShift >= 0 && gammaShift <= 90):
          switch (true) {
              case (betaShift >= 0 && betaShift <= 90):
                accelarationInUpDown = (betaShift / 90 * accelerationY1) + ((1- betaShift / 90) * accelerationZ1);
                break;
              case (betaShift < 0 && betaShift < -90):
                accelarationInUpDown = (betaShift / 90 * accelerationY1) - ((1- betaShift / 90) * accelerationZ1);
                break;
            }
      case(gammaShift < 0 && gammaShift > -90):
          switch (true) {
              case (betaShift >= 0 && betaShift <= 90):
                accelarationInUpDown = (betaShift / 90 * accelerationY1) + ((1- betaShift / 90) * accelerationZ1);
                break;
              case (betaShift < 0 && betaShift < -90):
                accelarationInUpDown = (betaShift / 90 * accelerationY1) - ((1- betaShift / 90) * accelerationZ1);
                break;
        }
        }
      $("#AccelerationUpDown").text("Acceleration Up/Down" + accelarationInUpDown);
  }


  function handleOrientation(evt) {
    console.log("handleOrientationEvent gamma: " + evt.gamma);
    $("#alpha").text("Alpha: " + evt.alpha);
    $("#beta").text("Beta: " + evt.beta);
    $("#gamma").text("Gamma: " + evt.gamma);

    
    if (evt.gamma < 90 && evt.gamma >= 0) {
        if (evt.gamma > thresholdRotation || evt.gamma - 90 < -thresholdRotation) {
            // adjust the gammaShift value
            gammaShift = evt.gamma;
        }
        else {
            gammaShift = 0;
        }
    }
    else if (evt.gamma >= -90 && evt.gamma < 0) {
        if (evt.gamma < -thresholdRotation || evt.gamma + 90 > thresholdRotation) {
            // adjust the gammaShift value
            gammaShift = evt.gamma;
        }
        else {
            gammaShift = 0;
        }
    }
    if (evt.beta < 180  && evt.beta >= 0) {
        if (evt.beta > thresholdRotation || evt.beta - 180 < -thresholdRotation) {
            // adjust the betaShift value
            betaShift = evt.beta;
        }
        else {
            betaShift = 0;
        }
    }
    else if (evt.beta >= -180 && evt.beta < 0) {
        if (evt.beta < -thresholdRotation || evt.beta + 180 > thresholdRotation) {
            // adjust the betaShift value
            betaShift = evt.beta;
        }
        else {
            betaShift = 0;
        }
    }
    $("#betaShift").text("BetaShift: " + betaShift);
    $("#gammaShift").text("GammaShift: " + gammaShift);
    // We do not have to use alpha since it only represents the compass direction (rotation around z-axis)
}
});