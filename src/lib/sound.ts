type Listener = (enabled: boolean) => void;

/**
 * Tiny synthesized sound layer (Web Audio, no audio files).
 * Disabled by default; nothing is created or played until the visitor
 * explicitly turns sound on with the toggle.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private ambient: { stop: () => void } | null = null;
  private enabled = false;
  private listeners = new Set<Listener>();
  private lastTick = 0;

  isEnabled() {
    return this.enabled;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.enabled));
  }

  private ensure() {
    if (this.ctx && this.master) return this.ctx;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  async enable() {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    if (ctx.state === 'suspended') await ctx.resume();
    this.enabled = true;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.2);
    this.startAmbient();
    this.blip(660, 0.12, 'sine', 0.05);
    this.emit();
  }

  disable() {
    this.enabled = false;
    if (this.ctx && this.master) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.12);
      window.setTimeout(() => {
        if (!this.enabled) this.stopAmbient();
      }, 700);
    }
    this.emit();
  }

  toggle() {
    return this.enabled ? this.disable() : this.enable();
  }

  private startAmbient() {
    if (this.ambient || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0.03;
    out.connect(this.master);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 360;
    filter.connect(out);

    const oscs = [55, 82.4, 110.3].map((f) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(filter);
      o.start();
      return o;
    });

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 140;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.ambient = {
      stop: () => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
        out.disconnect();
      },
    };
  }

  private stopAmbient() {
    this.ambient?.stop();
    this.ambient = null;
  }

  private blip(freq: number, dur: number, type: OscillatorType, vol: number) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g);
    g.connect(this.master);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }

  tick() {
    const now = performance.now();
    if (now - this.lastTick < 70) return;
    this.lastTick = now;
    this.blip(1800, 0.035, 'triangle', 0.018);
  }

  click() {
    this.blip(420, 0.08, 'sine', 0.05);
  }

  whoosh() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    if (!this.noise) {
      this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(300, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start();
    src.stop(ctx.currentTime + 0.65);
  }
}

export const sound = new SoundEngine();
