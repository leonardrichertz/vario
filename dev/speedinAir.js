
let lastAcceleration = { x: 0, y: 0, z: 0 };

let lastTimestamp;

let currentDirection = null; // 'up' für aufsteigende Bewegung, 'down' für absteigende Bewegung


function handleMotion(event) {
    let acceleration = event.accelerationIncludingGravity;
    let currentTimestamp = new Date().getTime();
    if (lastTimestamp) {
        // Berechne die Änderung der Geschwindigkeit
        let timeDifference = currentTimestamp - lastTimestamp;
        let deltaX = acceleration.x - lastAcceleration.x;
        let deltaY = acceleration.y - lastAcceleration.y;
        let deltaZ = acceleration.z - lastAcceleration.z;
        // Berechne die Geschwindigkeit in Metern pro Sekunde (m/s)
        let speedX = deltaX / timeDifference * 1000; // in m/s
        let speedY = deltaY / timeDifference * 1000; // in m/s
        let speedZ = deltaZ / timeDifference * 1000; // in m/s
        // Ermittle die Bewegungsrichtung basierend auf der Geschwindigkeit (nur X-Achse)
        if (speedX > 0) {
            currentDirection = 'up'; // aufsteigende Bewegung
        } else if (speedX < 0) {
            currentDirection = 'down'; // absteigende Bewegung
        } else {
            currentDirection = null; // keine eindeutige Bewegung
        }
        // Zeige die Bewegungsrichtung und Geschwindigkeit an
        document.getElementById("movement").innerText = "Bewegungsrichtung: " + (currentDirection ? currentDirection : "keine Bewegung");
        document.getElementById("speed").innerText = "Geschwindigkeit (X-Achse): " + Math.abs(speedX).toFixed(2) + " m/s";
    }



    // Aktualisiere die letzten Werte
    lastAcceleration = {
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z
    };
    lastTimestamp = currentTimestamp;
}



window.addEventListener("devicemotion", handleMotion);
