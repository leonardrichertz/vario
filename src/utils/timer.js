class Timer {
    constructor() {
        this.seconds = 0;
        this.intervalId = null;
    }

    start() {
        this.intervalId = setInterval(() => {
            this.seconds++;
            $('#timeFlown').html(this.getTimeValues().toString());
        }, 1000);
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