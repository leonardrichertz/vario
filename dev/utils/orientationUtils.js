export function handleOrientationIOS(event) {
    let alpha;
    if (typeof event.webkitCompassHeading !== "undefined") {
        alpha = Math.round(event.webkitCompassHeading * 100) / 100; // Normalize value
    }
    const beta = Math.round(event.beta * 100) / 100;  // Rotation around x-axis
    const gamma = Math.round(event.gamma * 100) / 100; // Rotation around y-axis

    return { alpha, beta, gamma };
}

export function handleOrientationAndroid(event) {
    console.log("handleOrientationAndroid function called");
    const alpha = Math.round(event.alpha * 100) / 100; // Normalize value
    const beta = Math.round(event.beta * 100) / 100;  // Rotation around x-axis
    const gamma = Math.round(event.gamma * 100) / 100; // Rotation around y-axis

    return { alpha, beta, gamma };
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
