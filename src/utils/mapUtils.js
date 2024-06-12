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

export function calculateManualSpeed(position, lastPosition, lastTimestamp) {
    var speed = 0;
    if (lastPosition && lastTimestamp) {
        const deltaTime = (position.timestamp - lastTimestamp) / 1000; // Convert ms to s
        const distance = calculateDistance(lastPosition.coords.latitude, lastPosition.coords.longitude, position.coords.latitude, position.coords.longitude);
        speed = distance / deltaTime; // m/s
    }
    lastPosition = position;
    lastTimestamp = position.timestamp;
    console.log(speed);
    console.log(lastPosition);
    console.log(lastTimestamp);
    return { manualSpeed: speed, lastPosition, lastTimestamp };
}
