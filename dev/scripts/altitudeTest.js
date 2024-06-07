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

    
  let initialAltitude = 0;
  let currentAltitude = 0;
  let gammaShift = 0;
  let betaShift = 0;

  var os = getOS();

  let intervaltime = 0

  const thresholdRotation = 1.5

  let currentSpeedUpDown = 0

  let lastProcessedTime = 0;
  const throttleInterval = 500; // Intervall in Millisekunden (z.B. 100 ms entspricht 10 mal pro Sekunde)


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
    const currentTime = Date.now();
    let interval = evt.interval + intervaltime;
    if (currentTime - lastProcessedTime > throttleInterval) {
      lastProcessedTime = currentTime;

      
      let accelarationUpDown = 0;

      let accelerationZ1 = evt.acceleration.z;
      let accelerationY1 = evt.acceleration.y;
      let accelerationX1 = evt.acceleration.x;

      $("#AccelerationX").text("Acceleration X: " + accelerationX1.toFixed(2));
      $("#AccelerationY").text("Acceleration Y: " + accelerationY1.toFixed(2));
      $("#AccelerationZ").text("Acceleration Z: " + accelerationZ1.toFixed(2));

      switch (true) {
        case (gammaShift >= 0 && gammaShift <= 90):
            switch (true) {
                case (betaShift >= 0 && betaShift <= 90):
                  accelarationUpDown = (betaShift / 90 * accelerationY1) + ((1 - betaShift / 90) * accelerationZ1) + (betaShift / 90 * accelerationX1);
                  break;
                case (betaShift < 0 && betaShift < -90):
                  accelarationUpDown = (betaShift / 90 * accelerationY1) - ((1 - betaShift / 90) * accelerationZ1)  + (betaShift / 90 * accelerationX1);
                  break;
              }
        case (gammaShift < 0 && gammaShift > -90):
            switch (true) {
                case (betaShift >= 0 && betaShift <= 90):
                  accelarationUpDown = (betaShift / 90 * accelerationY1) + ((1 - betaShift / 90) * accelerationZ1) + (betaShift / 90 * accelerationX1);
                  break;
                case (betaShift < 0 && betaShift < -90):
                  accelarationUpDown = (betaShift / 90 * accelerationY1) - ((1 - betaShift / 90) * accelerationZ1) + (betaShift / 90 * accelerationX1);
                  break;
          }
      }
      $("#AccelerationUpDown").text("Acceleration Up/Down: " + accelarationUpDown.toFixed(3));
      currentSpeedUpDown = calculateSpeedUpDown(accelarationUpDown, interval);
      $("#SpeedUpDown").text("Speed Up/Down: " + currentSpeedUpDown.toFixed(3));
      interval = 0;
      intervaltime = 0;
    }
    intervaltime = intervaltime + evt.interval;
  }

  function calculateSpeedUpDown(acc, interval){
    if(acc > 0.1 || acc < -0.1){
        if(os == 'iOS'){
            //For IOS Intervall seems to be in seconds. For android in ms
            let speed = currentSpeedUpDown + acc * interval;
            console.log("Interval: " + interval)
            console.log("kalkulierter Speed on IOS: " + speed + "  delta-speed: " + (speed - currentSpeedUpDown))
            return speed;
        } else {
            let speed = currentSpeedUpDown + acc * interval / 1000;
            console.log("Interval: " + interval)
            console.log("kalkulierter Speed: " + speed + "  delta-speed: " + (speed - currentSpeedUpDown))
            return speed;
        }
    } else return currentSpeedUpDown
  }


  function handleOrientation(evt) {
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