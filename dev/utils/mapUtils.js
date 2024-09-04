/**
 * Calculates the distance between two coordinates on the Earth's surface. Uses the Haversine formula.
 *
 * @param {number} lat1 - The latitude of the first coordinate.
 * @param {number} lon1 - The longitude of the first coordinate.
 * @param {number} lat2 - The latitude of the second coordinate.
 * @param {number} lon2 - The longitude of the second coordinate.
 * @returns {number} The distance between the two coordinates in kilometers.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
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

/**
 * Calculates the manual speed based on the current and previous positions.
 * @param {Position} position - The current position.
 * @param {Position} lastPosition - The previous position.
 * @param {number} lastTimestamp - The timestamp of the previous position.
 * @returns {Object} - An object containing the manual speed, last position, and last timestamp.
 */
export function calculateManualSpeed(position, lastPosition, lastTimestamp) {
    var speed = 0;
    if (lastPosition && lastTimestamp) {
        const deltaTime = (position.timestamp - lastTimestamp) / 1000; // Convert ms to s
        const distance = calculateDistance(lastPosition.coords.latitude, lastPosition.coords.longitude, position.coords.latitude, position.coords.longitude);
        speed = distance / deltaTime; // m/s
    }
    lastPosition = position;
    lastTimestamp = position.timestamp;
    return { manualSpeed: speed, lastPosition, lastTimestamp };
}

/**
 * Displays the given distance on the HTML element with the id "distance".
 * @param {number} distance - The distance to be displayed.
 * @returns {void}
 */
export function displayDistance(distance) {
    $("#distance").html(distance.toFixed(3));
}

/**
 * Displays the speed value on the HTML element with the id "speed".
 * 
 * @param {number} speed - The speed value to be displayed.
 * @returns {void}
 */
export function displaySpeed(speed) {
    $("#speed").html(speed.toFixed(2));
}
