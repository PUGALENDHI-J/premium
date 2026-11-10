'use client';

export class VoiceInteractionController {
  private static recognition: any = null;
  private static isListening = false;
  private static isSpeaking = false;
  private static voiceMuted = false;

  public static isSTTSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  public static isTTSSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  public static startListening(
    onResult: (transcript: string) => void,
    onError?: (error: any) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isSTTSupported()) {
      if (onError) onError('Speech recognition not supported in this browser environment.');
      return false;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e) {
      if (onError) onError(e);
      return false;
    }
  }

  public static stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public static speak(text: string, onEnd?: () => void) {
    if (!this.isTTSSupported() || this.voiceMuted) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any active speech

      // Clean markdown tags from speech text for clean audio reading
      const cleanText = text
        .replace(/###|##|#|\*\*|\*|`|\[.*?\]\(.*?\)/g, '')
        .replace(/\n+/g, ' ')
        .slice(0, 320); // Speak first couple sentences concisely

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 0.98;

      // Select high quality voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')) &&
          v.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public static stopSpeaking() {
    if (this.isTTSSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public static toggleMute(): boolean {
    this.voiceMuted = !this.voiceMuted;
    if (this.voiceMuted) {
      this.stopSpeaking();
    }
    return this.voiceMuted;
  }

  public static isMuted(): boolean {
    return this.voiceMuted;
  }
}

