class MusicHandler {
    constructor() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.source = null;
      this.audioBuffer = null;
      this.isPlaying = false;
      this.startTime = 0;
      this.pauseTime = 0;
    }
  
    loadAudio(url) {
      return fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => this.audioContext.decodeAudioData(data))
        .then(buffer => {
          this.audioBuffer = buffer;
        })
        .catch(error => {
          console.error('Error loading audio file:', error);
        });
    }
  
    play() {
      if (this.audioBuffer && !this.isPlaying) {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.audioContext.destination);
        this.startTime = this.audioContext.currentTime - this.pauseTime;
        this.source.start(0, this.pauseTime);
        this.isPlaying = true;
        this.source.onended = () => {
          this.isPlaying = false;
          this.pauseTime = 0;
        };
      } else if (this.isPlaying) {
        this.audioContext.resume();
      }
    }
  
    pause() {
      if (this.source && this.isPlaying) {
        this.audioContext.suspend();
        this.pauseTime = this.audioContext.currentTime - this.startTime;
        this.isPlaying = false;
      }
    }
  
    stop() {
      if (this.source) {
        this.source.stop(0);
        this.source.disconnect();
        this.source = null;
        this.isPlaying = false;
        this.pauseTime = 0;
      }
    }
  }
  
  export default MusicHandler;
  