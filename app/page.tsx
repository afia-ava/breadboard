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

function GlossyOrb({ size, top, right, bottom, left, opacity = 1 }: {
  size: number; top?: string; right?: string; bottom?: string; left?: string; opacity?: number;
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none select-none"
      style={{
        width: size,
        height: size,
        top,
        right,
        bottom,
        left,
        opacity,
        background:
          'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(210,180,255,0.75) 22%, rgba(100,200,255,0.55) 46%, rgba(30,20,80,0.85) 72%, rgba(0,0,0,0.97) 100%)',
        boxShadow:
          'inset -6px -8px 18px rgba(0,0,0,0.65), inset 4px 4px 10px rgba(255,255,255,0.35), 0 0 80px rgba(140,90,255,0.12)',
      }}
    />
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
          {/* Orbs */}
          <GlossyOrb size={200} top="40px" right="40px" opacity={0.85} />
          <GlossyOrb size={80} top="200px" right="280px" opacity={0.5} />
          <GlossyOrb size={44} bottom="60px" right="100px" opacity={0.3} />

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
