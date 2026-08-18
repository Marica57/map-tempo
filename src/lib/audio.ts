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

  // Zakazuje jedan ton na apsolutno vrijeme `start` (za nizove tonova).
  // `rel` je relativna glasnoća signala (0..1); množi se s master glasnoćom.
  private at(freq: number, start: number, dur: number, rel: number) {
    const ac = this.ac!;
    const o = ac.createOscillator();
    const g = ac.createGain();
    const vol = Math.max(0.0001, Math.min(1, rel * this.volume));
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g);
    g.connect(ac.destination);
    o.start(start);
    o.stop(start + dur + 0.02);
  }

  private tone(freq: number, dur: number, rel: number) {
    if (!this.soundOn || this.volume <= 0) return;
    this.ensure();
    this.at(freq, this.ac!.currentTime, dur, rel);
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

  /**
   * Kraj serije / cijele vježbe — jasno prepoznatljiva uzlazna fanfara (3 tona).
   * Namjerno drukčija od svih jednotonskih signala da se čuje da je GOTOVO.
   */
  finish() {
    if (!this.soundOn || this.volume <= 0) return;
    this.ensure();
    const t = this.ac!.currentTime;
    this.at(660, t, 0.16, 1.0);
    this.at(990, t + 0.14, 0.16, 1.0);
    this.at(1320, t + 0.28, 0.34, 1.0);
  }

  /**
   * Najava da počinje ZADNJE ponavljanje/serija — dvostruki visoki "beep-beep".
   * Razlikuje se i od kraja faze (strong) i od kraja vježbe (finish).
   */
  lastRep() {
    if (!this.soundOn || this.volume <= 0) return;
    this.ensure();
    const t = this.ac!.currentTime;
    this.at(1245, t, 0.1, 0.9);
    this.at(1245, t + 0.16, 0.1, 0.9);
  }

  /** Kratki preview ton (za isprobavanje glasnoće na klizaču). */
  preview() {
    this.tone(700, 0.16, 0.9);
  }

  vibrate(ms: number | number[]) {
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
