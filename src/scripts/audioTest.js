let audioContext = null;

$(document).ready(function() {
    $('#startSound').click(function() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log("AudioContext resumed");
                startSoundInterval();
            });
        } else {
            startSoundInterval();
        }
    });
});

function startSoundInterval() {
    setInterval(() => {
        playSound(ascentProfile);
    }, 1000);
}

function playSound(soundProfile) {
    console.log("playSound function started: ", soundProfile);
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    console.log("AudioContext: ", audioContext);    
    console.log("AudioContext state: ", audioContext.state);

    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log("AudioContext resumed");
            playSoundInternal(soundProfile, audioContext);
        });
    } else {
        playSoundInternal(soundProfile, audioContext);
    }
}

function playSoundInternal(soundProfile, audioContext) {
    const climbRate = 2; // example climb rate
    const frequency = getValueForClimb(soundProfile.frequency, climbRate);
    const duration = getValueForClimb(soundProfile.duration, climbRate);
    const gainValue = getValueForClimb(soundProfile.gain, climbRate);

    console.log("Frequency: ", frequency);
    console.log("Duration: ", duration);
    console.log("Gain: ", gainValue);

    if (!frequency || !duration || !gainValue) {
        console.error("Invalid sound parameters");
        return;
    }

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
}

function getValueForClimb(data, climbRate) {
    for (let i = 0; i < data.length; i++) {
        if (climbRate <= data[i].climb) {
            return data[i].value;
        }
    }
    return data[data.length - 1].value;
}

const descentProfile = {
    "version": 1,
    "units": {
        "climb": "m/s",
        "frequency": "Hz",
        "duration": "ms",
        "dutycycle": "percent",
        "gain": "percent"
    },
    "frequency": [
        { "climb": -0.5, "value": 800 },
        { "climb": -1, "value": 600 },
        { "climb": -2, "value": 400 },
        { "climb": -3, "value": 300 },
        { "climb": -4, "value": 200 }
    ],
    "duration": [
        { "climb": -0.5, "value": 1000 },
        { "climb": -1, "value": 800 },
        { "climb": -2, "value": 600 },
        { "climb": -3, "value": 400 },
        { "climb": -4, "value": 200 }
    ],
    "dutycycle": [
        { "climb": -0.5, "value": 10 },
        { "climb": -1, "value": 20 },
        { "climb": -2, "value": 30 },
        { "climb": -3, "value": 40 },
        { "climb": -4, "value": 50 }
    ],
    "gain": [
        { "climb": -0.5, "value": 100 },
        { "climb": -1, "value": 100 },
        { "climb": -2, "value": 100 },
        { "climb": -3, "value": 100 },
        { "climb": -4, "value": 100 }
    ]
};

const ascentProfile = {
    "version": 1,
    "units": {
        "climb": "m/s",
        "frequency": "Hz",
        "duration": "ms",
        "dutycycle": "percent",
        "gain": "percent"
    },
    "frequency": [
        { "climb": 0.5, "value": 1000 },
        { "climb": 1, "value": 1200 },
        { "climb": 2, "value": 1400 },
        { "climb": 3, "value": 1600 },
        { "climb": 4, "value": 1800 }
    ],
    "duration": [
        { "climb": 0.5, "value": 1000 },
        { "climb": 1, "value": 800 },
        { "climb": 2, "value": 600 },
        { "climb": 3, "value": 400 },
        { "climb": 4, "value": 200 }
    ],
    "dutycycle": [
        { "climb": 0.5, "value": 10 },
        { "climb": 1, "value": 20 },
        { "climb": 2, "value": 30 },
        { "climb": 3, "value": 40 },
        { "climb": 4, "value": 50 }
    ],
    "gain": [
        { "climb": 0.5, "value": 100 },
        { "climb": 1, "value": 100 },
        { "climb": 2, "value": 100 },
        { "climb": 3, "value": 100 },
        { "climb": 4, "value": 100 }
    ]
};