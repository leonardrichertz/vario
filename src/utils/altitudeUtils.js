export function changeAltitudeIcon(speed) {
    // Remove existing highlight from all bars
    $(".bar").removeClass("bar-light").addClass("bar-dark");
    $("#verticalSpeed").text(speed.toFixed(2));

    // Highlight the correct bar based on speed
    switch (true) {
        case speed > 0.8:
            $("#bar1").addClass("bar-light");
            break;
        case speed > 0.5:
            $("#bar2").addClass("bar-light");
            break;
        case speed > 0.4:
            $("#bar3").addClass("bar-light");
            break;
        case speed > 0.3:
            $("#bar4").addClass("bar-light");
            break;
        case speed > 0.2:
            $("#bar5").addClass("bar-light");
            break;
        case speed > 0.1:
            $("#bar6").addClass("bar-light");
            break;
        case speed <= 0.1 && speed > -0.1:
            $("#bar7").addClass("bar-light");
            break;
        case speed < -0.1 && speed > -0.2:
            $("#bar8").addClass("bar-light");
            break;
        case speed < -0.2 && speed > -0.3:
            $("#bar9").addClass("bar-light");
            break;
        case speed < -0.3 && speed > -0.4:
            $("#bar10").addClass("bar-light");
            break;
        case speed < -0.4 && speed > -0.5:
            $("#bar11").addClass("bar-light");
            break;
        case speed <= -0.5 && speed > -0.8:
            $("#bar12").addClass("bar-light");
            break;
        case speed <= -0.8:
            $("#bar13").addClass("bar-light");
            break;
        default:
            // Handle default case
            break;
    }
}
