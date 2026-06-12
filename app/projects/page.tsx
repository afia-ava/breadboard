import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export const revalidate = 60;

export default async function ProjectsPage() {
  const { data: boms } = await supabase
    .from('boms')
    .select('id, project_title, project_summary, description, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight hover:opacity-70 transition-opacity">
            breadboard.
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white font-mono hidden sm:block">Hardware Advisor</span>
            <Link
              href="/"
              className="text-xs border border-white/20 rounded-full px-4 py-1.5 hover:bg-white hover:text-black transition-colors"
            >
              New BOM
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-4">Community builds</p>
        <h1 className="text-5xl sm:text-6xl font-black uppercase leading-[0.9] tracking-tight mb-12">
          PAST<br />PROJECTS.
        </h1>

        {!boms || boms.length === 0 ? (
          <div className="border border-white/[0.06] rounded-2xl p-12 text-center">
            <p className="text-zinc-600 text-sm font-mono">No projects yet — be the first.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-zinc-100 transition-colors"
            >
              Generate a BOM
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boms.map((bom, i) => (
              <Link
                key={bom.id}
                href={`/bom/${bom.id}`}
                className="group border border-white/[0.07] rounded-2xl bg-zinc-950 p-6 flex flex-col gap-3 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-zinc-700 font-mono">
                    {new Date(bom.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </div>
                <h2 className="text-base font-black uppercase leading-tight group-hover:text-zinc-200 transition-colors">
                  {bom.project_title}
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-1">
                  {bom.project_summary}
                </p>
                {bom.description && (
                  <p className="text-xs text-zinc-700 font-mono truncate">
                    &quot;{bom.description}&quot;
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-white transition-colors mt-1">
                  <span>View BOM</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-white/[0.06] py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-600">breadboard. © 2026</span>
          <span className="text-xs text-zinc-700 font-mono uppercase tracking-widest">Built for makers</span>
        </div>
      </footer>
    </main>
  );
}
