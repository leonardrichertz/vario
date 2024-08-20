import { ascentProfile1, ascentProfile2, ascentProfile3, ascentProfile4, ascentProfile5, ascentProfile6, ascentProfile7, descentProfile1, descentProfile2, descentProfile3, descentProfile4, descentProfile5, descentProfile6, descentProfile7 } from './soundprofiles.js';


export function getSoundProfile(soundChoice) {
    switch (true) {
        case soundChoice === 'ascentProfile1':
            return ascentProfile1;
        case soundChoice === 'ascentProfile2':
            return ascentProfile2;
        case soundChoice === 'ascentProfile3':
            return ascentProfile3;
        case soundChoice === 'ascentProfile4':
            return ascentProfile4;
        case soundChoice === 'ascentProfile5':
            return ascentProfile5;
        case soundChoice === 'ascentProfile6':
            return ascentProfile6;
        case soundChoice === 'ascentProfile7':
            return ascentProfile7;
        case soundChoice === 'descentProfile1':
            return descentProfile1;
        case soundChoice === 'descentProfile2':
            return descentProfile2;
        case soundChoice === 'descentProfile3':
            return descentProfile3;
        case soundChoice === 'descentProfile4':
            return descentProfile4;
        case soundChoice === 'descentProfile5':
            return descentProfile5;
        case soundChoice === 'descentProfile6':
            return descentProfile6;
        case soundChoice === 'descentProfile7':
            return descentProfile7;
        default:
            return descentProfile1;
};
}
export function playSound(soundProfile, audioContext) {
    console.log("playSound function started: ", soundProfile);
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    console.log("AudioContext: ", audioContext);  
    console.log("AudioContext state: ", audioContext.state);  


    const climbRate = 2; // example climb rate
    const frequency = getValueForClimb(soundProfile.frequency, climbRate);
    const duration = getValueForClimb(soundProfile.duration, climbRate);
    console.log("Duration: ", duration);
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