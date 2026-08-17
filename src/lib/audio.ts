// Generira zvučne signale u kodu (Web Audio API), bez audio datoteka.
// Vidi docs/specifikacije/zvuk-i-signali.md
class AudioEngine {
  private ac: AudioContext | null = null;
  soundOn = true;
  /** Master glasnoća 0..1 (podesiva klizačem, pamti se na uređaju). */
  volume = 0.8;

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

  // `rel` je relativna glasnoća signala (0..1); množi se s master glasnoćom.
  private tone(freq: number, dur: number, rel: number) {
    if (!this.soundOn || this.volume <= 0) return;
    this.ensure();
    const ac = this.ac!;
    const o = ac.createOscillator();
    const g = ac.createGain();
    const t = ac.currentTime;
    const vol = Math.max(0.0001, Math.min(1, rel * this.volume));
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
    this.tone(440, 0.09, 0.4);
  }
  /** Malo naglašeniji tik (npr. polovica odbrojavanja). */
  mid() {
    this.tone(620, 0.14, 0.6);
  }
  /** Jači/viši ton — kraj faze. */
  strong() {
    this.tone(880, 0.28, 1.0);
  }
  /** Prijelaz u RAD (viši ton). */
  work() {
    this.tone(900, 0.22, 1.0);
  }
  /** Prijelaz u odmor/pauzu (niži ton). */
  rest() {
    this.tone(480, 0.24, 0.85);
  }

  /** Kratki preview ton (za isprobavanje glasnoće na klizaču). */
  preview() {
    this.tone(700, 0.16, 0.9);
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
