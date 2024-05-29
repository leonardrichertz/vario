export function getOS() {
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