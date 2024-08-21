export function changeAltitudeIcon(speed) {
    // Remove existing highlight from all bars
    $(".bar").removeClass("bar-light").addClass("bar-dark");
    displayVerticalSpeed(speed);

    // Highlight the correct bar based on speed
    switch (true) {
        case speed > 0.8:
            $("#bar1").addClass("bar-light");
            return 'ascentProfile1';
        case speed > 0.5:
            $("#bar2").addClass("bar-light");
            return 'ascentProfile2';
        case speed > 0.4:
            $("#bar3").addClass("bar-light");
            return 'ascentProfile3';
        case speed > 0.3:
            $("#bar4").addClass("bar-light");
            return 'ascentProfile4';
        case speed > 0.2:
            $("#bar5").addClass("bar-light");
            return 'ascentProfile5';
        case speed > 0.1:
            $("#bar6").addClass("bar-light");
            return 'ascentProfile6';
        case speed <= 0.1 && speed > 0:
            $("#bar7").addClass("bar-light");
            return 'ascentProfile7';
        case speed <= 0 && speed > -0.1:
            $("#bar7").addClass("bar-light");
            return 'descentProfile7';
        case speed < -0.1 && speed > -0.2:
            $("#bar8").addClass("bar-light");
            return 'descentProfile6';
        case speed < -0.2 && speed > -0.3:
            $("#bar9").addClass("bar-light");
            return 'descentProfile5';
        case speed < -0.3 && speed > -0.4:
            $("#bar10").addClass("bar-light");
            return 'descentProfile4';
        case speed < -0.4 && speed > -0.5:
            $("#bar11").addClass("bar-light");
            return 'descentProfile3';
        case speed <= -0.5 && speed > -0.8:
            $("#bar12").addClass("bar-light");
            return 'descentProfile2';
        case speed <= -0.8:
            $("#bar13").addClass("bar-light");
            return 'descentProfile1';
        default:
            $("#bar7").addClass("bar-light");
            return 'descentProfile7';            
    }
}

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

export function displayAttitude(altitude) {
    $("#altitude").html((altitude).toFixed(2));
}

export function displayVerticalSpeed(speed) {
    $("#verticalSpeed").text(speed.toFixed(2));
}
