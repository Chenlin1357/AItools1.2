class VoiceRecognition {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.init();
  }

  init() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = 'zh-CN';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStart && this.onStart();
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.onResult && this.onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        this.onError && this.onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onEnd && this.onEnd();
      };
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('语音识别启动失败:', error);
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  setLanguage(lang) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  // 事件回调
  onStart(callback) {
    this.onStart = callback;
  }

  onResult(callback) {
    this.onResult = callback;
  }

  onError(callback) {
    this.onError = callback;
  }

  onEnd(callback) {
    this.onEnd = callback;
  }
}

// 创建全局语音识别实例
window.voiceRecognition = new VoiceRecognition();