import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import TierCard from '../../components/TierCard';
import type { Tier } from '../../../types';

export default async function BomPage({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('boms')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) notFound();

  const tiers: Tier[] = data.tiers;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight hover:opacity-70 transition-opacity">
            breadboard.
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/projects" className="text-xs text-zinc-600 hover:text-white transition-colors hidden sm:block">
              Hardware Advisor
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-3">Shared BOM</p>
        <h1 className="text-4xl sm:text-5xl font-black uppercase leading-tight mb-3">
          {data.project_title}
        </h1>
        <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm mb-2">{data.project_summary}</p>
        {data.description && (
          <p className="text-xs text-zinc-700 font-mono mb-10">
            Prompt: &quot;{data.description}&quot;
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <TierCard key={tier.tier} tier={tier} />
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.06]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-zinc-100 transition-colors"
          >
            Generate your own BOM
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
