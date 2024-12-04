// settingsmenu.js
export default class SettingsMenu {
    constructor(game) {
        this.game = game;
        this.subtitlesEnabled = true;
        this.init();
    }
    // full function is to turn on and off the subtitles within the subtitles menu. 
    init() {
        document.getElementById('settings-button').addEventListener('click', () => {
            document.getElementById('settings-menu').style.display = 'block';
        });

        document.getElementById('close-settings-button').addEventListener('click', () => {
            document.getElementById('settings-menu').style.display = 'none';
        });

        document.getElementById('subtitles-toggle').addEventListener('change', (event) => {
            this.subtitlesEnabled = event.target.checked;
            if (this.subtitlesEnabled) {
                // Request microphone permission
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        this.game.speechRecognitionHandler.start();
                        // We don't need the stream, so stop it
                        stream.getTracks().forEach(track => track.stop());
                    })
                    .catch((err) => {
                        console.error('Microphone access denied:', err);
                        alert('Microphone access is required for subtitles.');
                        event.target.checked = false;
                        this.subtitlesEnabled = false;
                    });
            } else {
                this.game.speechRecognitionHandler.stop();
                this.game.subtitleElement.style.opacity = 0;
                this.game.subtitleElement.textContent = '';
            }
        });
    }
}
