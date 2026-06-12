export class SoundEngine {
  private static audioCtx: AudioContext | null = null;

  private static getContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // 1. Play Bell (Smooth, resonant sound)
  private static playBell(volume: number = 1.0) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    
    // Fundamental + harmonics for a bell
    const frequencies = [880, 1760, 2640];
    const amplitudes = [1, 0.5, 0.2];
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Decay envelope
      const maxVol = (amplitudes[i] * volume) / frequencies.length;
      gain.gain.setValueAtTime(maxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5 + (i * 0.2));
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2.0);
    });
  }

  // 2. Play Chime (Modern UI alert, two notes)
  private static playChime(volume: number = 1.0) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    
    const playNote = (freq: number, startTime: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(volume * 0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 1.0);
    };

    playNote(1046.50, now);        // C6
    playNote(1318.51, now + 0.15); // E6
  }

  // 3. Play Siren (Emergency / Urgent)
  private static playSiren(volume: number = 1.0) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    
    // Modulate frequency up and down
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.4);
    osc.frequency.linearRampToValueAtTime(800, now + 0.8);
    osc.frequency.linearRampToValueAtTime(1200, now + 1.2);
    osc.frequency.linearRampToValueAtTime(800, now + 1.6);
    
    gain.gain.setValueAtTime(volume * 0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.6);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 1.6);
  }

  public static playSound(type: 'siren' | 'chime' | 'bell', volume: number) {
    try {
      if (volume <= 0) return;
      if (type === 'bell') this.playBell(volume);
      else if (type === 'chime') this.playChime(volume);
      else if (type === 'siren') this.playSiren(volume);
    } catch (e) {
      console.warn("Failed to play synthesized sound", e);
    }
  }

  public static speak(text: string, volume: number = 1.0) {
    try {
      if (!('speechSynthesis' in window) || volume <= 0) return;
      // Stop any current speech so it doesn't queue up a hundred times
      window.speechSynthesis.cancel(); 
      
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'th-TH';
      msg.volume = volume;
      msg.rate = 1.0;
      
      window.speechSynthesis.speak(msg);
    } catch (e) {
      console.warn("Failed to play TTS", e);
    }
  }
}
