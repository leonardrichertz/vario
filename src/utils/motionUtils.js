/**
 * Calculates the vertical speed based on the given parameters.
 *
 * @param {Object} evt - The event object containing acceleration and interval data.
 * @param {number} gammaShift - The gamma shift value.
 * @param {number} betaShift - The beta shift value.
 * @param {number} thresholdRotation - The threshold rotation value.
 * @param {number} lastAltitude - The last recorded altitude.
 * @param {string} os - The operating system (iOS or Android).
 * @param {boolean} isFirstCall - Indicates if this is the first call to the function.
 * @param {number} verticalSpeed - The current vertical speed.
 * @param {number} acceleration0Z - The initial acceleration value for the z-axis.
 * @param {number} acceleration0Y - The initial acceleration value for the y-axis.
 * @param {number} acceleration0X - The initial acceleration value for the x-axis.
 * @param {number} acceleration0Altitude - The initial acceleration value for the altitude.
 * @returns {number} The updated vertical speed.
 */
export function getverticalSpeedFromInterval(evt, gammaShift, betaShift, thresholdRotation, lastAltitude, os, isFirstCall, verticalSpeed, acceleration0Z, acceleration0Y, acceleration0X, acceleration0Altitude) {
    var interval = null;
    console.log(os);
    // For IOS we already have it in seconds
    if (os == 'iOS' || os == 'MacOS') {
        interval = evt.interval;
    }
    // For Android we have it in milliseconds
    else {
        interval = evt.interval / 1000;
    }
    console.log(interval);
    let accelerationZ1 = evt.acceleration.z;
    let accelerationY1 = evt.acceleration.y;
    let accelerationX1 = evt.acceleration.x;
    let adjustedAccelerationZ1 = 0;
    let adjustedAccelerationY1 = 0;
    let adjustedAccelerationX1 = 0;
    let adjustedAccelerationAltitude1 = 0;

    // Check if this is the first call
    if (isFirstCall) {
        // Calculate the initial acceleration, which is the same as the acceleration at time t1 now, but since we get the average acceleration it should be fine.
        acceleration0Z = (gammaShift / 90 * accelerationZ1) + (betaShift / 90 * accelerationZ1);
        acceleration0Y = (betaShift / 90 * accelerationY1);
        acceleration0X = - (gammaShift / 90 * accelerationX1);
        isFirstCall = false;
    }
    acceleration0Altitude = acceleration0Z + acceleration0Y + acceleration0X;
    // Check if the device is not rotated
    if (Math.abs(gammaShift) <= thresholdRotation && Math.abs(betaShift) <= thresholdRotation) {
        // No rotation
        verticalSpeed = verticalSpeed + ((accelerationZ1 + acceleration0Z) / 2) * interval;
    }
    // Check if initial altitude is set
    else {
        // gamma are values between -90 and 90.
        // beta are values between -180 and 180.
        // Todo: adjust functionality accordingly.
        switch (true) {
            case (gammaShift <= 90 && gammaShift >= 0):
                switch (true) {
                    case (betaShift >= 0 && betaShift <= 90):
                        // In this case the acceleration for the x axis is negative if we are moving the device upwards.
                        // Maybe we actually only need to adjust the acceleration for the z-axis with the gammaShift value and not the beta value. I am however unsure about this. We would take parts of 90 from each rotation value and thus et a weighted average of the acceleration values.
                        // This is the old code that I am not sure about:
                        // adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) + (betaShift / 90 * accelerationZ) - (90 - gammaShift / 90 * accelerationX) + (90 - betaShift / 90 * accelerationY);
                        // Do we need to adjust the value of the acceleration by signing it? Does that make sense since a negative sum of accelerations would mean we lose speed. If there isn't any acceleration we would stay at the same speed.
                        adjustedAccelerationZ1 = (gammaShift / 90 * accelerationZ1) + (betaShift / 90 * accelerationZ1);
                        adjustedAccelerationY1 = (betaShift / 90 * accelerationY1)
                        adjustedAccelerationX1 = - (gammaShift / 90 * accelerationX1)
                        adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                        verticalSpeed = verticalSpeed + ((acceleration0Altitude + adjustedAccelerationAltitude1) / 2) * evt.interval;
                        lastAltitude = lastAltitude + verticalSpeed * evt.interval;
                        break;
                    case (betaShift >= -90 && betaShift < 0):
                        // In this case the acceleration for the y-axis is negative because the top of the device is facing downwards.
                        adjustedAccelerationZ1 = (gammaShift / 90 * accelerationZ1) - (betaShift / 90 * accelerationZ1);
                        adjustedAccelerationY1 = -(betaShift / 90 * accelerationY1)
                        adjustedAccelerationX1 = - (gammaShift / 90 * accelerationX1)
                        adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                        verticalSpeed = verticalSpeed + ((acceleration0Altitude + adjustedAccelerationAltitude1) / 2) * evt.interval;
                        lastAltitude = lastAltitude + verticalSpeed * evt.interval;
                        break;
                    // Old code that I am unsure about:
                    // adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) - (90 - gammaShift / 90 * accelerationX)  + (betaShift / 90 * accelerationZ) - (90 - betaShift / 90 * accelerationY); 
                    case (betaShift >= 90):
                        //z-negative, y-positive, x-positive
                        adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) + (betaShift / 180 * accelerationZ1);
                        adjustedAccelerationY1 = -(betaShift / 180 * accelerationY1)
                        adjustedAccelerationX1 = - (gammaShift / 90 * accelerationX1)
                        adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                        verticalSpeed = verticalSpeed + ((acceleration0Altitude + adjustedAccelerationAltitude1) / 2) * evt.interval;
                        lastAltitude = lastAltitude + verticalSpeed * evt.interval;
                        break;
                    // adjustedAccelerationAltitude = -(gammaShift / 90 * accelerationZ) + (90 - gammaShift / 90 * accelerationX) - (betaShift / 180 * accelerationZ) + (180 - betaShift / 180 * accelerationZ);
                    case (betaShift < 0 && betaShift <= -90):
                        adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) - (betaShift / 180 * accelerationZ1);
                        adjustedAccelerationY1 = -(betaShift / 180 * accelerationY1);
                        adjustedAccelerationX1 = - (gammaShift / 90 * accelerationX1);
                        adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                        verticalSpeed = verticalSpeed + ((acceleration0Altitude + adjustedAccelerationAltitude1) / 2) * evt.interval;
                        lastAltitude = lastAltitude + verticalSpeed * evt.interval;
                        break;
                }
                break;

            case (gammaShift < 0 && gammaShift >= -90):
                switch (true) {
                    case (betaShift >= 0 && betaShift <= 90):
                        adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) + (betaShift / 90 * accelerationZ1);
                        adjustedAccelerationY1 = (betaShift / 90 * accelerationY1)
                        adjustedAccelerationX1 = -(gammaShift / 90 * accelerationX1)
                        adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                        verticalSpeed = verticalSpeed + ((acceleration0Altitude + adjustedAccelerationAltitude1) / 2) * evt.interval;
                        lastAltitude = lastAltitude + verticalSpeed * evt.interval;
                        break;
                    // adjustedAccelerationAltitude = (gammaShift / 90 * accelerationZ) + (90 - gammaShift / 90 * accelerationX) + (betaShift / 90 * accelerationY) + (90 - betaShift / 90 * accelerationZ);
                    case (betaShift >= -90 && betaShift < 0):
                        adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) - (betaShift / 90 * accelerationZ1);
                        adjustedAccelerationY1 = -(betaShift / 90 * accelerationY1)
                        adjustedAccelerationX1 = -(gammaShift / 90 * accelerationX1)
                        adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                        verticalSpeed = verticalSpeed + ((acceleration0Altitude + adjustedAccelerationAltitude1) / 2) * evt.interval;
                        lastAltitude = lastAltitude + verticalSpeed * evt.interval;
                        break;
                    // Todo: add code here
                    case (betaShift >= 90):
                        // Todo: add code here
                        adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) + (betaShift / 90 * accelerationZ1);
                        adjustedAccelerationY1 = (betaShift / 90 * accelerationY1)
                        adjustedAccelerationX1 = -(gammaShift / 90 * accelerationX1)
                        adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                        verticalSpeed = verticalSpeed + ((acceleration0Altitude + adjustedAccelerationAltitude1) / 2) * evt.interval;
                        lastAltitude = lastAltitude + verticalSpeed * evt.interval;
                        break;
                    case (betaShift < 0 && betaShift <= -90):
                        adjustedAccelerationZ1 = -(gammaShift / 90 * accelerationZ1) - (betaShift / 90 * accelerationZ1);
                        adjustedAccelerationY1 = -(betaShift / 90 * accelerationY1)
                        adjustedAccelerationX1 = -(gammaShift / 90 * accelerationX1)
                        adjustedAccelerationAltitude1 = adjustedAccelerationZ1 + adjustedAccelerationY1 + adjustedAccelerationX1;
                        verticalSpeed = verticalSpeed + ((acceleration0Altitude + adjustedAccelerationAltitude1) / 2) * evt.interval;
                        lastAltitude = lastAltitude + verticalSpeed * evt.interval;
                        break;
                }
                break;
        }
        if (!isFirstCall) {
            acceleration0X = adjustedAccelerationX1;
            acceleration0Y = adjustedAccelerationY1;
            acceleration0Z = adjustedAccelerationZ1;
        }
        return { lastAltitude, isFirstCall, verticalSpeed, acceleration0X, acceleration0Y, acceleration0Z, acceleration0Altitude}
    }
}