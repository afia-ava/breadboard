import type { Tier } from '../../types';

const TIER_META: Record<string, { index: string; label: string; topBorder: string }> = {
  budget:   { index: '01', label: 'Budget',    topBorder: '#52525b' },
  mid:      { index: '02', label: 'Mid-range', topBorder: '#a1a1aa' },
  premium:  { index: '03', label: 'Premium',   topBorder: '#ffffff' },
};
const FALLBACK_META = { index: '--', label: 'Tier', topBorder: '#3f3f46' };

function fmt(min: number, max: number) {
  if (min === max || max === 0) return `$${min}`;
  return `$${min}–$${max}`;
}

export default function TierCard({ tier }: { tier: Tier }) {
  const meta = TIER_META[tier.tier?.toLowerCase?.()] ?? FALLBACK_META;
  return (
    <div
      className="bg-zinc-950 rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-5"
      style={{ borderTop: `1.5px solid ${meta.topBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-600">{meta.index}</span>
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{meta.label}</span>
      </div>

      {/* Total price */}
      <div>
        <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Est. total</p>
        <p className="text-3xl font-black font-mono text-white">
          {fmt(tier.total_price_min, tier.total_price_max)}
        </p>
      </div>

      {/* BOM */}
      <div className="flex-1">
        <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-3">Bill of materials</p>
        <div className="space-y-3.5">
          {tier.components.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white leading-snug">{c.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{c.purpose}</p>
                {c.notes && (
                  <p className="text-xs text-zinc-700 mt-0.5 italic leading-snug">{c.notes}</p>
                )}
              </div>
              <span className="text-xs font-mono text-zinc-400 whitespace-nowrap pt-0.5 shrink-0">
                {fmt(c.price_min, c.price_max)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.05]" />

      {/* Tradeoffs */}
      <div>
        <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-2">Tradeoffs</p>
        <p className="text-sm text-zinc-300 leading-relaxed">{tier.tradeoffs}</p>
      </div>

      {/* Gotchas */}
      {tier.gotchas && tier.gotchas.length > 0 && (
        <div>
          <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-2">Watch out</p>
          <ul className="space-y-1.5">
            {tier.gotchas.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-snug">
                <span className="mt-0.5 shrink-0 text-zinc-600">→</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
