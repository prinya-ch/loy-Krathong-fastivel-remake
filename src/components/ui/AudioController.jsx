import React, { useEffect, useRef } from 'react';
import { useKrathongStore } from '../../store/useKrathongStore';

// Web Audio API Procedural Thai Traditional Khim & Gentle River Ambient Generator
export function AudioController() {
  const isAudioPlaying = useKrathongStore((state) => state.isAudioPlaying);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const noiseNodeRef = useRef(null);

  useEffect(() => {
    if (!isAudioPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      return;
    }

    // Initialize Web Audio Context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // 1. Soft River Water Stream Pink Noise Generator
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft river murmuring
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(0);
    noiseNodeRef.current = whiteNoise;

    // 2. Traditional Thai Khim (ขิม) Melodic Plucks in Southeast Asian Pentatonic Scale
    // Scale notes: D4, E4, G4, A4, B4, D5, E5, G5, A5
    const thaiPentatonicFrequencies = [
      293.66, 329.63, 392.00, 440.00, 493.88,
      587.33, 659.25, 783.99, 880.00
    ];

    const playKhimNote = (freq) => {
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Khim pluck envelope: instant attack, long shimmering decay
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.85);
    };

    // Play meditative ambient Khim patterns
    let step = 0;
    timerRef.current = setInterval(() => {
      if (Math.random() > 0.15) {
        const noteIndex = Math.floor(Math.random() * thaiPentatonicFrequencies.length);
        playKhimNote(thaiPentatonicFrequencies[noteIndex]);

        // Occasionally play harmony note
        if (step % 4 === 0) {
          setTimeout(() => {
            playKhimNote(thaiPentatonicFrequencies[(noteIndex + 3) % thaiPentatonicFrequencies.length]);
          }, 220);
        }
      }
      step++;
    }, 700);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      try {
        whiteNoise.stop();
      } catch (e) {}
    };
  }, [isAudioPlaying]);

  return null;
}
