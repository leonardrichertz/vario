function calculateFlownTime(trackingStartTime) {
    if (trackingStartTime === null) {
        return 0;
    }
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - trackingStartTime;
    return Math.floor(elapsedTime / 1000); // Convert milliseconds to seconds
}