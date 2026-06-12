'use client';

import { useState, useEffect } from 'react';
import TierCard from './components/TierCard';
import type { RecommendationResult } from '../types';

const EXAMPLES = [
  'track soil moisture and automatically water plants when dry',
  'detect motion and send an alert to my phone via Telegram',
  'display live temperature and humidity on a small screen',
  'control desk lamp brightness with a rotary knob',
];

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function HardwareBg() {
  return (
    <>
      {/* QFP microcontroller chip — top right */}
      <svg
        className="absolute pointer-events-none select-none"
        style={{ top: 0, right: 24, opacity: 0.22, width: 220, height: 220 }}
        viewBox="0 0 220 220"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="60" y="60" width="100" height="100" strokeWidth="1.5" />
        <path d="M60 72 A12 12 0 0 1 72 60" strokeWidth="1.5" />
        {[78, 93, 108, 123, 138].map((x) => (
          <rect key={`t${x}`} x={x - 4} y={38} width="8" height="22" rx="1" strokeWidth="1" />
        ))}
        {[78, 93, 108, 123, 138].map((x) => (
          <rect key={`b${x}`} x={x - 4} y={160} width="8" height="22" rx="1" strokeWidth="1" />
        ))}
        {[78, 93, 108, 123, 138].map((y) => (
          <rect key={`l${y}`} x={38} y={y - 4} width="22" height="8" rx="1" strokeWidth="1" />
        ))}
        {[78, 93, 108, 123, 138].map((y) => (
          <rect key={`r${y}`} x={160} y={y - 4} width="22" height="8" rx="1" strokeWidth="1" />
        ))}
        <line x1="110" y1="65" x2="110" y2="155" strokeWidth="0.5" strokeDasharray="3 5" />
        <line x1="65" y1="110" x2="155" y2="110" strokeWidth="0.5" strokeDasharray="3 5" />
        <rect x="82" y="88" width="56" height="44" rx="1" strokeWidth="0.6" strokeDasharray="2 3" />
      </svg>

      {/* Schematic: VCC → resistor → LED → GND with cap branch — left side */}
      <svg
        className="absolute pointer-events-none select-none"
        style={{ top: 50, left: 16, opacity: 0.2, width: 200, height: 210 }}
        viewBox="0 0 200 210"
        fill="none"
        stroke="white"
        strokeLinecap="round"
      >
        <line x1="30" y1="14" x2="30" y2="30" strokeWidth="1" />
        <line x1="18" y1="10" x2="42" y2="10" strokeWidth="1.5" />
        <line x1="22" y1="5" x2="38" y2="5" strokeWidth="1" />
        <line x1="26" y1="1" x2="34" y2="1" strokeWidth="0.7" />
        <line x1="30" y1="30" x2="30" y2="48" strokeWidth="1" />
        <rect x="20" y="48" width="20" height="38" rx="2" strokeWidth="1.2" />
        <line x1="30" y1="86" x2="30" y2="106" strokeWidth="1" />
        <circle cx="30" cy="106" r="3" fill="white" />
        <line x1="30" y1="106" x2="80" y2="106" strokeWidth="1" />
        <line x1="80" y1="94" x2="80" y2="104" strokeWidth="1" />
        <line x1="68" y1="104" x2="92" y2="104" strokeWidth="2" />
        <line x1="68" y1="110" x2="92" y2="110" strokeWidth="1" />
        <line x1="80" y1="110" x2="80" y2="122" strokeWidth="1" />
        <line x1="70" y1="122" x2="90" y2="122" strokeWidth="1.5" />
        <line x1="73" y1="126" x2="87" y2="126" strokeWidth="1" />
        <line x1="76" y1="130" x2="84" y2="130" strokeWidth="0.7" />
        <line x1="30" y1="106" x2="30" y2="146" strokeWidth="1" />
        <polygon points="22,146 38,146 30,162" strokeWidth="1.2" fill="none" />
        <line x1="22" y1="162" x2="38" y2="162" strokeWidth="1.2" />
        <line x1="36" y1="156" x2="42" y2="150" strokeWidth="0.8" />
        <line x1="40" y1="158" x2="46" y2="152" strokeWidth="0.8" />
        <line x1="30" y1="162" x2="30" y2="178" strokeWidth="1" />
        <line x1="18" y1="178" x2="42" y2="178" strokeWidth="1.5" />
        <line x1="22" y1="182" x2="38" y2="182" strokeWidth="1" />
        <line x1="26" y1="186" x2="34" y2="186" strokeWidth="0.7" />
        <line x1="80" y1="106" x2="130" y2="106" strokeWidth="1" />
        <line x1="130" y1="88" x2="130" y2="124" strokeWidth="1" />
        <rect x="122" y="88" width="16" height="36" rx="2" strokeWidth="1" strokeDasharray="2 2" />
      </svg>

      {/* PCB copper traces with vias — bottom right */}
      <svg
        className="absolute pointer-events-none select-none"
        style={{ bottom: 10, right: 0, opacity: 0.18, width: 280, height: 190 }}
        viewBox="0 0 280 190"
        fill="none"
        stroke="white"
        strokeLinecap="round"
      >
        <path d="M20 165 H70 V100 H120 V50 H200" strokeWidth="2" />
        <path d="M120 50 H160 V130 H220 V70 H280" strokeWidth="2" />
        <path d="M20 115 H70" strokeWidth="2" />
        <path d="M160 130 V190" strokeWidth="2" />
        <path d="M70 100 V190" strokeWidth="2" />
        <path d="M200 50 V10 H250" strokeWidth="2" />
        {([[70,100],[120,50],[160,130],[220,70],[200,50]] as [number,number][]).map(([x,y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={6} strokeWidth="1.5" />
            <circle cx={x} cy={y} r={2.5} fill="white" />
          </g>
        ))}
        <rect x="190" y="3" width="22" height="14" rx="2" strokeWidth="1.2" />
        <rect x="218" y="3" width="22" height="14" rx="2" strokeWidth="1.2" />
        <rect x="270" y="62" width="10" height="16" rx="2" strokeWidth="1.2" />
      </svg>

      {/* NPN transistor schematic — top left */}
      <svg
        className="absolute pointer-events-none select-none"
        style={{ top: 16, left: 20, opacity: 0.17, width: 130, height: 130 }}
        viewBox="0 0 130 130"
        fill="none"
        stroke="white"
        strokeLinecap="round"
      >
        {/* Circle body */}
        <circle cx="70" cy="65" r="38" strokeWidth="1.2" />
        {/* Base wire */}
        <line x1="0" y1="65" x2="32" y2="65" strokeWidth="1.2" />
        {/* Vertical base bar */}
        <line x1="32" y1="44" x2="32" y2="86" strokeWidth="2" />
        {/* Collector */}
        <line x1="32" y1="50" x2="72" y2="32" strokeWidth="1.2" />
        <line x1="72" y1="32" x2="72" y2="4" strokeWidth="1.2" />
        {/* Emitter with arrow */}
        <line x1="32" y1="80" x2="72" y2="98" strokeWidth="1.2" />
        <line x1="72" y1="98" x2="72" y2="126" strokeWidth="1.2" />
        {/* Arrow on emitter */}
        <polygon points="60,92 72,98 65,106" fill="white" stroke="none" />
        {/* Labels */}
        <line x1="72" y1="4" x2="90" y2="4" strokeWidth="0.8" strokeDasharray="2 3" />
        <line x1="0" y1="65" x2="0" y2="65" />
      </svg>

      {/* Pin header connector — right side, middle */}
      <svg
        className="absolute pointer-events-none select-none"
        style={{ top: '38%', right: 16, opacity: 0.16, width: 80, height: 160 }}
        viewBox="0 0 80 160"
        fill="none"
        stroke="white"
        strokeLinecap="round"
      >
        {/* Connector housing */}
        <rect x="20" y="4" width="40" height="152" rx="3" strokeWidth="1.2" />
        {/* Pins */}
        {[16, 32, 48, 64, 80, 96, 112, 128].map((y) => (
          <g key={y}>
            <rect x="32" y={y} width="16" height="10" rx="1" strokeWidth="1" />
            <line x1="0" y1={y + 5} x2="32" y2={y + 5} strokeWidth="0.8" strokeDasharray="2 3" />
            <line x1="48" y1={y + 5} x2="60" y2={y + 5} strokeWidth="0.8" strokeDasharray="2 3" />
          </g>
        ))}
        {/* Pin 1 marker dot */}
        <circle cx="26" cy="20" r="3" fill="white" />
      </svg>

      {/* Inductor coil — bottom left */}
      <svg
        className="absolute pointer-events-none select-none"
        style={{ bottom: 30, left: 20, opacity: 0.16, width: 200, height: 80 }}
        viewBox="0 0 200 80"
        fill="none"
        stroke="white"
        strokeLinecap="round"
      >
        {/* Lead in */}
        <line x1="0" y1="40" x2="20" y2="40" strokeWidth="1.2" />
        {/* Coil arcs */}
        <path d="M20 40 A10 10 0 0 1 40 40" strokeWidth="1.2" />
        <path d="M40 40 A10 10 0 0 1 60 40" strokeWidth="1.2" />
        <path d="M60 40 A10 10 0 0 1 80 40" strokeWidth="1.2" />
        <path d="M80 40 A10 10 0 0 1 100 40" strokeWidth="1.2" />
        <path d="M100 40 A10 10 0 0 1 120 40" strokeWidth="1.2" />
        <path d="M120 40 A10 10 0 0 1 140 40" strokeWidth="1.2" />
        {/* Lead out */}
        <line x1="140" y1="40" x2="200" y2="40" strokeWidth="1.2" />
        {/* Core line */}
        <line x1="20" y1="24" x2="140" y2="24" strokeWidth="0.8" strokeDasharray="4 3" />
        <line x1="20" y1="19" x2="140" y2="19" strokeWidth="0.8" strokeDasharray="4 3" />
        {/* Labels */}
        <line x1="0" y1="40" x2="0" y2="60" strokeWidth="0.8" strokeDasharray="2 3" />
        <line x1="200" y1="40" x2="200" y2="60" strokeWidth="0.8" strokeDasharray="2 3" />
      </svg>
    </>
  );
}

function LoadingSkeleton({ seconds }: { seconds: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono">Analyzing components</p>
        </div>
        <p className="text-xs font-mono text-zinc-600">
          {seconds > 0 ? `~${seconds}s` : 'finishing up…'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-zinc-950 rounded-2xl border border-white/[0.06] p-6 animate-pulse"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="h-2.5 bg-zinc-900 rounded w-20 mb-6" />
            <div className="h-9 bg-zinc-900 rounded w-16 mb-8" />
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="flex justify-between mb-4">
                <div className="flex-1 mr-4">
                  <div className="h-2.5 bg-zinc-900 rounded w-3/4 mb-1.5" />
                  <div className="h-2 bg-zinc-900 rounded w-1/2" />
                </div>
                <div className="h-2.5 bg-zinc-900 rounded w-10" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (!loading) return;
    setCountdown(15);
    const id = setInterval(() => {
      setCountdown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to generate recommendations.');
      } else {
        setResult(data as RecommendationResult);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => { setResult(null); setError(null); setDescription(''); }}
            className="text-sm font-bold tracking-tight hover:opacity-70 transition-opacity"
          >
            breadboard.
          </button>
          <div className="flex items-center gap-6">
            <span className="text-xs text-zinc-600 hidden sm:block">Hardware Advisor</span>
            <span className="text-xs text-zinc-600 hidden sm:block">About</span>
            <button
              onClick={() => { setResult(null); setError(null); setDescription(''); }}
              className="text-xs border border-white/20 rounded-full px-4 py-1.5 hover:bg-white hover:text-black transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Landing — hero + form combined, full viewport height */}
      {!result && !loading && !error && (
        <section className="relative overflow-hidden" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <HardwareBg />

          <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 pb-16 pt-4 text-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-6">
              AI-powered hardware planning
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.9] tracking-tight mb-8">
              THE HARDWARE<br />
              COMPONENT<br />
              ADVISOR.
            </h1>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-10">
              Describe your project and get AI-curated component lists across budget, mid-range, and premium tiers.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="border border-white/[0.08] rounded-2xl bg-zinc-950 p-5">
                <label className="block text-xs text-zinc-600 uppercase tracking-widest font-mono mb-3 text-left">
                  What do you want to build?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={3}
                  placeholder="e.g. a weather station that logs temperature, humidity, and pressure to an SD card…"
                  className="w-full bg-black rounded-xl border border-white/[0.08] p-4 text-white placeholder-zinc-700 resize-none focus:outline-none focus:border-white/25 transition-colors disabled:opacity-50 text-sm"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs text-zinc-700 font-mono">Try:</span>
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setDescription(ex)}
                      className="text-xs text-zinc-600 hover:text-white border border-white/[0.07] hover:border-white/20 px-3 py-1 rounded-full transition-colors text-left"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !description.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-zinc-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate BOM
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Footer — visible on landing when scrolled */}
      {!result && !loading && !error && (
        <footer className="border-t border-white/[0.06] py-6">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-600">breadboard. © 2026</span>
            <span className="text-xs text-zinc-700 font-mono uppercase tracking-widest">Built for makers</span>
          </div>
        </footer>
      )}

      {/* Results view */}
      {(result || loading || error) && (
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Form — compact at top when results are shown */}
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="border border-white/[0.08] rounded-2xl bg-zinc-950 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs text-zinc-600 uppercase tracking-widest font-mono mb-2">
                  What do you want to build?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={2}
                  placeholder="Describe another project…"
                  className="w-full bg-black rounded-xl border border-white/[0.08] p-3 text-white placeholder-zinc-700 resize-none focus:outline-none focus:border-white/25 transition-colors disabled:opacity-50 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-zinc-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {loading ? <><Spinner /> Analyzing</> : <>Generate BOM</>}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mb-8 p-4 border border-red-900/40 rounded-xl bg-red-950/10">
              <p className="text-xs text-red-500 font-mono">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && <LoadingSkeleton seconds={countdown} />}

          {/* Result header + cards */}
          {result && !loading && (
            <>
              <div className="mb-8">
                <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-3">Generated BOM</p>
                <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight mb-3">
                  {result.project_title}
                </h2>
                <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm">{result.project_summary}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.tiers.map((tier) => (
                  <TierCard key={tier.tier} tier={tier} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
