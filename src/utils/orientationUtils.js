/**
 * Handles the orientation event on iOS devices. For this we use the webkitCompassHeading value if it is available.
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
 * Handles the orientation event on Android devices. This uses the alpha value of the orientation event.
 *
 * @param {Object} event - The orientation event object.
 * @param {number} event.alpha - The alpha value of the orientation event.
 * @returns {number} The normalized alpha value.
 */
export function handleOrientationAndroid(event) {
    const alpha = Math.round(event.alpha * 100) / 100; // Normalize value
    const beta = Math.round(event.beta * 100) / 100;  // Rotation around x-axis
    const gamma = Math.round(event.gamma * 100) / 100; // Rotation around y-axis

    return { alpha, beta, gamma };
    return alpha;
}