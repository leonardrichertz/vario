import { ascentProfile1, ascentProfile2, ascentProfile3, ascentProfile4, ascentProfile5, ascentProfile6, ascentProfile7, descentProfile1, descentProfile2, descentProfile3, descentProfile4, descentProfile5, descentProfile6, descentProfile7 } from './soundprofiles.js';


const maxSpeed = 0.8; // Maximum speed for ascent. Change this value as needed.
const minSpeed = -0.8; // Minimum speed for descent. Change this value as needed.

const thresholds = {
    ascent1: maxSpeed * 0.625,
    ascent2: maxSpeed * 0.5,
    ascent3: maxSpeed * 0.375,
    ascent4: maxSpeed * 0.25,
    ascent5: maxSpeed * 0.125,
    descent5: minSpeed * 0.125,
    descent4: minSpeed * 0.25,
    descent3: minSpeed * 0.375,
    descent2: minSpeed * 0.5,
    descent1: minSpeed * 0.625,
};


/**
 * Changes the altitude icon based on the given speed.
 * 
 * @param {number} speed - The speed value used to determine the altitude icon.
 * @returns {string} - The name of the altitude profile associated with the highlighted bar.
 */
export function changeAltitudeIcon(speed) {
    // Remove existing highlight from all bars
    $(".bar").removeClass("bar-light").addClass("bar-dark");
    displayVerticalSpeed(speed);

    // Highlight the correct bar based on speed
    switch (true) {
        case speed > maxSpeed:
            $("#bar1").addClass("bar-light");
            return ascentProfile1;
        case speed > thresholds.ascent1:
            $("#bar2").addClass("bar-light");
            return ascentProfile2;
        case speed > thresholds.ascent2:
            $("#bar3").addClass("bar-light");
            return ascentProfile3;
        case speed > thresholds.ascent3:
            $("#bar4").addClass("bar-light");
            return ascentProfile4;
        case speed > thresholds.ascent4:
            $("#bar5").addClass("bar-light");
            return ascentProfile5;
        case speed > thresholds.ascent5:
            $("#bar6").addClass("bar-light");
            return ascentProfile6;
        case speed <= thresholds.ascent5 && speed > 0:
            $("#bar7").addClass("bar-light");
            return ascentProfile7;
        case speed <= 0 && speed > -thresholds.descent5:
            $("#bar7").addClass("bar-light");
            return descentProfile7;
        case speed < thresholds.descent5 && speed > thresholds.descent4:
            $("#bar8").addClass("bar-light");
            return descentProfile6;
        case speed < thresholds.descent4 && speed > thresholds.descent3:
            $("#bar9").addClass("bar-light");
            return descentProfile5;
        case speed < thresholds.descent3 && speed > thresholds.descent2:
            $("#bar10").addClass("bar-light");
            return descentProfile4;
        case speed < thresholds.descent2 && speed > thresholds.descent1:
            $("#bar11").addClass("bar-light");
            return descentProfile3;
        case speed <= thresholds.descent1 && speed > minSpeed:
            $("#bar12").addClass("bar-light");
            return descentProfile2;
        case speed <= minSpeed:
            $("#bar13").addClass("bar-light");
            return descentProfile1;
        default:
            $("#bar7").addClass("bar-light");
            return descentProfile7;            
    }
}

/**
 * Calculates the average speed based on the given speed history array and the current speed.
 * 
 * @param {number[]} speedHistory - The array containing the speed history.
 * @param {number} speed - The current speed.
 * @returns {number} - The average speed.
 */
export function changeSpeedHistory(speedHistory, speed) {
    var averageSpeed = 0;
    // Update the speed history array
    speedHistory.push(speed);
    if (speedHistory.length > 4) {
        speedHistory.shift();
    }
    
    for (let i = 0; i < speedHistory.length; i++) {
        averageSpeed += speedHistory[i];
    }   
    averageSpeed = averageSpeed/speedHistory.length;
    return averageSpeed;
}

/**
 * Displays the attitude value on the webpage.
 * 
 * @param {number} altitude - The altitude value to be displayed.
 * @returns {void}
 */
export function displayAltitude(altitude) {
    $("#altitude").html((altitude).toFixed(2) + " m");
}

/**
 * Displays the vertical speed on the webpage.
 * 
 * @param {number} speed - The vertical speed to be displayed.
 * @returns {void}
 */
export function displayVerticalSpeed(speed) {
    if (speed > 0) {
        $("#verticalSpeed").text("+" + speed.toFixed(2));
    }
    else {
        $("#verticalSpeed").text(speed.toFixed(2));
    }
}
