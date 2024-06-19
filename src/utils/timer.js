class Timer {
    constructor() {
        this.seconds = 0;
        this.intervalId = null;
    }

    //starts timer
    start() {
        this.intervalId = setInterval(() => {
            this.seconds++;
            $('#timeFlown').html("Zeit", this.getTimeValues().toString());
        }, 1000);
    }

    // pauses timer, but does not clear the time
    pause() {
        clearInterval(this.intervalId);
    }

    // stops timer and clears the time
    stop() {
        clearInterval(this.intervalId);
        this.seconds = 0;
    }

    getTimeValues() {
        let hours = Math.floor(this.seconds / 3600);
        let minutes = Math.floor((this.seconds - (hours * 3600)) / 60);
        let seconds = this.seconds - (hours * 3600) - (minutes * 60);

        return [hours, minutes, seconds].map(this.padTime).join(':');
    }

    padTime(time) {
        return time < 10 ? "0" + time : time;
    }
}

export default Timer;