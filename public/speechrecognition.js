// speechrecognition.js
export default class SpeechRecognitionHandler {
    constructor(game) {
        this.game = game;
        this.recognition = null;
        this.subtitlesEnabled = true;
        this.subtitleElement = document.getElementById('subtitle');
        this.init();
    }
    //sets the speech recognition up in browser
    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
        } else {
            console.warn('Speech Recognition API not supported in this browser.');
        }
    }
    //starts the speech recognition, which takes in audio from the surrounding environemnt and displays the words on screen. Six words max at a time on screen. 
    start() {
        if (!this.recognition) return;
        this.recognition.start();
        this.recognition.onresult = (event) => {
            if (this.subtitlesEnabled) {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    transcript += event.results[i][0].transcript;
                }
                // Limit to last 6 words
                const words = transcript.trim().split(/\s+/);
                const lastWords = words.slice(-6).join(' ');
                this.subtitleElement.textContent = lastWords;
                this.subtitleElement.style.opacity = 1;
            }
        };
        this.recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
        };
    }
    //stops speech recognition
    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}
