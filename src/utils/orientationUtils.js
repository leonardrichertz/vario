export function handleOrientationIOS(event) {
    let alpha;
    if (typeof event.webkitCompassHeading !== "undefined") {
        alpha = Math.round(event.webkitCompassHeading * 100) / 100; // Normalize value
    }

    return alpha;
}

export function handleOrientationAndroid(event) {
    const alpha = Math.round(event.alpha * 100) / 100; // Normalize value

    return alpha;
}

export function requestOrientationPermission(os) {
    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            return DeviceOrientationEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    return { granted: true, os };
                }
                return { granted: false, os };
            });
        } else {
            return Promise.resolve({ granted: true, os });
        }
    } else {
        return Promise.resolve({ granted: false, os });
    }
}

// return the orientation shift values for an event and the threshold rotation.
export function getOrientationShift(evt, thresholdRotation){
    let gammaShift = 0;
    let betaShift = 0;
    console.log(evt);
    console.log(thresholdRotation);
    console.log("Evt.gamma: ", evt.gamma);
    console.log("Evt.bete: ", evt.beta);
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
    if (evt.beta < 180 && evt.beta >= 0) {
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
    return { gammaShift, betaShift };
    // We do not have to use alpha since it only represents the compass direction (rotation around z-axis)
}