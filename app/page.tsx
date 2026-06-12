'use client';

import { useState } from 'react';
import TierCard from './components/TierCard';
import type { RecommendationResult } from '../types';

const EXAMPLES = [
  'track soil moisture and automatically water my plants when dry',
  'detect motion and send an alert to my phone via Telegram',
  'display live temperature and humidity readings on a small screen',
  'control my desk lamp brightness with a rotary knob and save presets',
];

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-8">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <p className="text-sm text-gray-400">Claude is researching components…</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-6 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="h-5 bg-gray-800 rounded-full w-28" />
              <div className="w-2 h-2 rounded-full bg-gray-800" />
            </div>
            <div className="h-4 bg-gray-800 rounded w-24 mb-2" />
            <div className="h-9 bg-gray-800 rounded w-20 mb-7" />
            <div className="h-3 bg-gray-800 rounded w-28 mb-4" />
            {[0, 1, 2, 3, 4].map((j) => (
              <div key={j} className="flex justify-between items-start mb-3">
                <div className="flex-1 mr-3">
                  <div className="h-3 bg-gray-800 rounded w-3/4 mb-1.5" />
                  <div className="h-2.5 bg-gray-800 rounded w-1/2" />
                </div>
                <div className="h-3 bg-gray-800 rounded w-12" />
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
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <header className="border-b border-gray-800 sticky top-0 z-10 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
              />
            </svg>
          </div>
          <span className="font-bold tracking-tight">Breadboard</span>
          <span className="text-xs text-gray-600 font-mono hidden sm:inline">
            hardware component advisor
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero — only shown before first result */}
        {!result && !loading && (
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Build smarter hardware
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Describe your project and get AI-curated component recommendations across three budget
              tiers — from scrappy prototype to polished build.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6">
            <label className="block text-sm font-medium text-gray-400 mb-3">
              What do you want to build?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
              placeholder="e.g. a weather station that logs temperature, humidity, and pressure to an SD card and shows readings on a small screen…"
              className="w-full bg-gray-950 rounded-xl border border-gray-700 p-4 text-white placeholder-gray-600 resize-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            />

            {/* Quick-fill examples */}
            {!result && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-600">Try:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setDescription(ex)}
                    className="text-xs text-gray-400 hover:text-emerald-400 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {loading ? (
                  <>
                    <Spinner /> Analyzing…
                  </>
                ) : (
                  <>
                    Generate BOM
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-950/60 border border-red-800 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {result && !loading && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{result.project_title}</h2>
              <p className="text-gray-400 max-w-3xl leading-relaxed">{result.project_summary}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.tiers.map((tier) => (
                <TierCard key={tier.tier} tier={tier} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
