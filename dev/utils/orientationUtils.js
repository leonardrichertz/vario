/**
 * Handles the orientation event on iOS devices.
 * @param {Event} event - The orientation event object.
 * @returns {number} - The normalized alpha value.
 */
export function handleOrientationIOS(event) {
    let alpha;
    if (typeof event.webkitCompassHeading !== "undefined") {
        alpha = Math.round(event.webkitCompassHeading * 100) / 100; // Normalize value
    }
    return alpha;
}

/**
 * Handles the orientation event on Android devices.
 *
 * @param {Object} event - The orientation event object.
 * @param {number} event.alpha - The alpha value of the orientation event.
 * @returns {number} The normalized alpha value.
 */
export function handleOrientationAndroid(event) {
    const alpha = Math.round(event.alpha * 100) / 100; // Normalize value
    return alpha;
}

/**
 * Calculates the orientation shift based on the provided event and threshold rotation.
 * @param {object} evt - The event object containing gamma and beta values.
 * @param {number} thresholdRotation - The threshold rotation value.
 * @returns {object} - An object containing the calculated gammaShift and betaShift values.
 */
export function getOrientationShift(evt, thresholdRotation){
    let gammaShift = 0;
    let betaShift = 0;
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