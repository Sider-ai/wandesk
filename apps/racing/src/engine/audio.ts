import { clamp } from '../lib/math';

type NoiseChannel = { filter: BiquadFilterNode; gain: GainNode };

export class RacingAudio {
  context?: AudioContext;
  started = false;

  private master?: GainNode;
  private engineGain?: GainNode;
  private engineFilter?: BiquadFilterNode;
  private saw?: OscillatorNode;
  private square?: OscillatorNode;
  private wind?: NoiseChannel;
  private skid?: NoiseChannel;
  private nitro?: NoiseChannel;

  init(): void {
    if (this.started) return;
    const AudioContextCtor = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    this.started = true;
    const context = this.context = new AudioContextCtor();
    const master = this.master = context.createGain();
    master.gain.value = 0.85;
    const compressor = context.createDynamicsCompressor();
    master.connect(compressor);
    compressor.connect(context.destination);

    this.engineGain = context.createGain();
    this.engineGain.gain.value = 0;
    this.engineFilter = context.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 400;
    this.saw = context.createOscillator();
    this.saw.type = 'sawtooth';
    this.saw.frequency.value = 60;
    this.square = context.createOscillator();
    this.square.type = 'square';
    this.square.frequency.value = 30;
    const squareGain = context.createGain();
    squareGain.gain.value = 0.55;
    this.saw.connect(this.engineFilter);
    this.square.connect(squareGain);
    squareGain.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(master);
    this.saw.start();
    this.square.start();

    const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const makeNoise = (type: BiquadFilterType, frequency: number, q = 1): NoiseChannel => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = frequency;
      filter.Q.value = q;
      const gain = context.createGain();
      gain.gain.value = 0;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start();
      return { filter, gain };
    };
    this.wind = makeNoise('lowpass', 500);
    this.skid = makeNoise('highpass', 1100);
    this.nitro = makeNoise('bandpass', 900, 1.6);
  }

  set(rpm: number, throttle: number, speed: number, skid: number, nitro: boolean): void {
    if (!this.started || !this.context || !this.saw || !this.square || !this.engineFilter ||
      !this.engineGain || !this.wind || !this.skid || !this.nitro) return;
    const now = this.context.currentTime;
    const response = 0.045;
    const frequency = 42 + rpm * 185;
    this.saw.frequency.setTargetAtTime(frequency * 2, now, response);
    this.square.frequency.setTargetAtTime(frequency, now, response);
    this.engineFilter.frequency.setTargetAtTime(260 + rpm * 1500, now, response);
    this.engineGain.gain.setTargetAtTime(0.05 + throttle * 0.115 + rpm * 0.05, now, response);
    this.wind.gain.gain.setTargetAtTime(speed * speed * 0.30, now, 0.1);
    this.wind.filter.frequency.setTargetAtTime(380 + speed * 900, now, 0.1);
    this.skid.gain.gain.setTargetAtTime(clamp(skid, 0, 1) * 0.22, now, 0.05);
    this.nitro.gain.gain.setTargetAtTime(nitro ? 0.30 : 0, now, nitro ? 0.03 : 0.12);
    this.nitro.filter.frequency.setTargetAtTime(nitro ? 2200 : 800, now, 0.18);
  }

  beep(frequency: number, duration = 0.14, volume = 0.22, type: OscillatorType = 'square'): void {
    if (!this.started || !this.context || !this.master) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  thud(): void {
    if (!this.started || !this.context || !this.master) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(95, now);
    oscillator.frequency.exponentialRampToValueAtTime(38, now + 0.16);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + 0.25);
  }

  idle(): void {
    if (this.started) this.set(0.08, 0, 0, 0, false);
  }

  suspend(): void {
    void this.context?.suspend();
  }

  resume(): void {
    void this.context?.resume();
  }
}
