/**
 * Represents a timer that tracks the elapsed time.
 */
class Timer {
    constructor() {
        this.seconds = 0;
        this.intervalId = null;
    }

    /**
     * Starts the timer.
     */
    start() {
        this.intervalId = setInterval(() => {
            this.seconds++;
            $('#timeFlown').html(this.getTimeValues().toString());
        }, 1000);
    }

    /**
     * Pauses the timer, but does not clear the time.
     */
    pause() {
        clearInterval(this.intervalId);
    }
    
    /**
     * Stops the timer and clears the time.
     */
    stop() {
        clearInterval(this.intervalId);
        this.seconds = 0;
    }

    /**
     * Returns the current time values as a formatted string.
     * @returns {string} The formatted time string in the format "HH:MM:SS".
     */
    getTimeValues() {
        let hours = Math.floor(this.seconds / 3600);
        let minutes = Math.floor((this.seconds - (hours * 3600)) / 60);
        let seconds = this.seconds - (hours * 3600) - (minutes * 60);

        return [hours, minutes, seconds].map(this.padTime).join(':');
    }
    
    /**
     * Returns the value of the seconds property.
     *
     * @returns {number} The value of the seconds property.
     */
    getSeconds() {
        return this.seconds;
    }

    /**
     * Pads a single digit time value with a leading zero.
     * @param {number} time - The time value to pad.
     * @returns {string} The padded time value as a string.
     */
    padTime(time) {
        return time < 10 ? "0" + time : time;
    }
}

export default Timer;