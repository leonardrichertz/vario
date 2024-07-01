export function playSound(soundProfile, audioContext) {
    console.log("playSound function started: ", soundProfile);
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    console.log("AudioContext: ", audioContext);    


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
    console.log("playSound end: ", frequency, duration, gainValue);
    return audioContext;
}

export function getValueForClimb(data, climbRate) {
    for (let i = 0; i < data.length; i++) {
        if (climbRate <= data[i].climb) {
            return data[i].value;
        }
    }
    return data[data.length - 1].value;
}