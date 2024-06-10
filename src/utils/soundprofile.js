import { playSound } from 'sound.js';

const soundProfile = {
    "version": 1,
    "units": {
        "climb": "m/s",
        "frequency": "Hz",
        "duration": "ms",
        "dutycycle": "percent",
        "gain": "percent"
    },
    "frequency": [
        { "climb": -8, "value": 200 },
        { "climb": -1, "value": 440 },
        { "climb": -0.2999999999999998, "value": 570 },
        { "climb": -0.09999999999999964, "value": 700.0000000000001 },
        { "climb": 1, "value": 1000 },
        { "climb": 2, "value": 1200 },
        { "climb": 3, "value": 1400 },
        { "climb": 4, "value": 1500.0000000000002 },
        { "climb": 6, "value": 1599.9999999999998 },
        { "climb": 8, "value": 1700 }
    ],
    "duration": [
        { "climb": -8, "value": 400 },
        { "climb": -1, "value": 400 },
        { "climb": -0.7999999999999998, "value": 700 },
        { "climb": -0.2999999999999998, "value": 650 },
        { "climb": 0.09999999999999964, "value": 610 },
        { "climb": 1, "value": 545 },
        { "climb": 3, "value": 400 },
        { "climb": 4.5, "value": 310 },
        { "climb": 6, "value": 225 },
        { "climb": 8, "value": 150 }
    ],
    "dutycycle": [
        { "climb": -8, "value": 1 },
        { "climb": -0.5, "value": 1 },
        { "climb": -0.5, "value": 0.05 },
        { "climb": 0.3000000000000007, "value": 0.05 },
        { "climb": 1, "value": 0.4799999999999999 },
        { "climb": 2, "value": 0.4799999999999999 },
        { "climb": 4, "value": 0.4799999999999999 },
        { "climb": 6, "value": 0.4799999999999999 },
        { "climb": 7, "value": 0.4799999999999999 },
        { "climb": 8, "value": 0.4799999999999999 }
    ],
    "gain": [
        { "climb": -8, "value": 1 },
        { "climb": -6, "value": 1 },
        { "climb": -4, "value": 1 },
        { "climb": -2, "value": 1 },
        { "climb": 0, "value": 1 },
        { "climb": 2, "value": 1 },
        { "climb": 4, "value": 1 },
        { "climb": 6, "value": 1 },
        { "climb": 7, "value": 1 },
        { "climb": 8, "value": 1 }
    ]
};

document.getElementById('playSound').addEventListener('click', playSound);