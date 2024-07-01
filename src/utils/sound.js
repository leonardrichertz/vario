export function playSound(soundProfile) {
   return soundProfile;
}

export function getValueForClimb(data, climbRate) {
    for (let i = 0; i < data.length; i++) {
        if (climbRate <= data[i].climb) {
            return data[i].value;
        }
    }
    return data[data.length - 1].value;
}