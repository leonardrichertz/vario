export function changeAltitudeIcon(speed) {
    // Remove existing highlight from all bars
    $(".bar").removeClass("bar-light").addClass("bar-dark");

    // Highlight the correct bar based on speed
    switch (true) {
        case speed > 1.5:
            $("#bar1").addClass("bar-light");
            break;
        case speed > 1:
            $("#bar2").addClass("bar-light");
            break;
        case speed > 0.8:
            $("#bar3").addClass("bar-light");
            break;
        case speed > 0.6:
            $("#bar4").addClass("bar-light");
            break;
        case speed > 0.4:
            $("#bar5").addClass("bar-light");
            break;
        case speed > 0.2:
            $("#bar6").addClass("bar-light");
            break;
        case speed <= 0.2 && speed > -0.2:
            $("#bar7").addClass("bar-light");
            break;
        case speed < -0.2 && speed > -0.4:
            $("#bar8").addClass("bar-light");
            break;
        case speed < -0.4 && speed > -0.6:
            $("#bar9").addClass("bar-light");
            break;
        case speed < -0.6 && speed > -0.8:
            $("#bar10").addClass("bar-light");
            break;
        case speed < -0.8 && speed > -1:
            $("#bar11").addClass("bar-light");
            break;
        case speed <= -1 && speed > -1.5:
            $("#bar12").addClass("bar-light");
            break;
        case speed <= -1.5:
            $("#bar13").addClass("bar-light");
            break;
        default:
            // Handle default case
            break;
    }
}
