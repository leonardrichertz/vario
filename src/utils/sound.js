export function playSound() {
    const climbRate = 2; // example climb rate

    const frequency = getValueForClimb(soundProfile.frequency, climbRate);
    const duration = getValueForClimb(soundProfile.duration, climbRate);
    const dutyCycle = getValueForClimb(soundProfile.dutycycle, climbRate);
    const gainValue = getValueForClimb(soundProfile.gain, climbRate);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gainNode.gain.value = gainValue;

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