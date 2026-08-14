// Generira zvučne signale u kodu (Web Audio API), bez audio datoteka.
// Vidi docs/specifikacije/zvuk-i-signali.md
class AudioEngine {
  private ac: AudioContext | null = null;
  soundOn = true;

  ensure() {
    if (!this.ac) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ac = new Ctx();
    }
    if (this.ac.state === 'suspended') void this.ac.resume();
  }

  private tone(freq: number, dur: number, vol: number) {
    if (!this.soundOn) return;
    this.ensure();
    const ac = this.ac!;
    const o = ac.createOscillator();
    const g = ac.createGain();
    const t = ac.currentTime;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(ac.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  /** Tihi tik (sekunda unutar faze). */
  soft() {
    this.tone(440, 0.09, 0.12);
  }
  /** Malo naglašeniji tik (npr. polovica odbrojavanja). */
  mid() {
    this.tone(620, 0.14, 0.2);
  }
  /** Jači/viši ton — kraj faze. */
  strong() {
    this.tone(880, 0.28, 0.34);
  }
  /** Prijelaz u RAD (viši ton). */
  work() {
    this.tone(900, 0.22, 0.34);
  }
  /** Prijelaz u odmor/pauzu (niži ton). */
  rest() {
    this.tone(480, 0.24, 0.3);
  }

  vibrate(ms: number) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        /* ignore */
      }
    }
  }
}

export const audio = new AudioEngine();
