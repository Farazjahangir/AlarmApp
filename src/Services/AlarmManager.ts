import Sound from 'react-native-sound';

Sound.setCategory('Alarm', true)
class AlarmSingleton {
    constructor() {
        if (!AlarmSingleton.instance) {
            this.alarmSound = null;
            this.isRinging = false
            AlarmSingleton.instance = this;
        }
        return AlarmSingleton.instance;
    }

    playAlarm = async () => {
        if (this.alarmSound) {
            // If sound is already playing, stop it
            await this.stopAlarm();
        }


        if (!this.alarmSound) {
            return new Promise((resolve, reject) => {
                this.alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, error => {
                    if (error) {
                        console.log('Failed to load sound', error);
                        reject(error)
                        return;
                    }
                    this.alarmSound.setNumberOfLoops(-1);
                    this.alarmSound.play();
                    this.isRinging = true
                    resolve()
                });
            })
        }
    };

    stopAlarm = () => {
        if (this.alarmSound) {
            return new Promise((resolve, reject) => {
                this.alarmSound.stop(() => {
                    this.alarmSound.release();
                    this.alarmSound = null;
                    this.isRinging = false
                    resolve()
                });
            })

        }
    };
}

const instance = new AlarmSingleton();
// Object.freeze(instance); // Ensures singleton pattern

export default instance;
