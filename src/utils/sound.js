/**
 * Plays a sound using the provided sound profile and audio context.
 * 
 * @param {Object} soundProfile - The sound profile containing frequency, duration, and gain values.
 * @param {AudioContext} audioContext - The audio context to use for playing the sound.
 * @returns {AudioContext} The audio context used for playing the sound.
 */
export function playSound(soundProfile, audioContext) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const climbRate = 2; // example climb rate
    const frequency = getValueForClimb(soundProfile.frequency, climbRate);
    // Maybe get the duration froom the difference between the two timestamps?
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
    return audioContext;
}

/**
 * Returns the value corresponding to the given climb rate from the provided data.
 * @param {Array} data - The data array containing climb rates and their corresponding values.
 * @param {number} climbRate - The climb rate for which the corresponding value is to be retrieved.
 * @returns {*} - The value corresponding to the given climb rate. If no match is found, the value corresponding to the highest climb rate in the data array is returned.
 */
export function getValueForClimb(data, climbRate) {
    for (let i = 0; i < data.length; i++) {
        if (climbRate <= data[i].climb) {
            return data[i].value;
        }
    }
    return data[data.length - 1].value;
}