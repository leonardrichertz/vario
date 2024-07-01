export function playSound(soundProfile, audioContext) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const climbRate = 2; // example climb rate
    const frequency = getValueForClimb(soundProfile.frequency, climbRate);
    const duration = getValueForClimb(soundProfile.duration, climbRate);
    const gainValue = getValueForClimb(soundProfile.gain, climbRate);

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gainNode.gain.value = gainValue / 100; // Convert percentage to a value between 0 and 1

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, duration);
}

export function getValueForClimb(data, climbRate) {
    for (let i = 0; i < data.length; i++) {
        if (climbRate <= data[i].climb) {
            return data[i].value;
        }
    }
    return data[data.length - 1].value;
}