import type { Tier } from '../../types';

const STYLES = {
  budget: {
    border: 'border-emerald-800',
    badge: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    price: 'text-emerald-400',
    dot: 'bg-emerald-500',
    divider: 'border-emerald-900',
    componentBar: 'bg-emerald-950',
  },
  mid: {
    border: 'border-blue-800',
    badge: 'bg-blue-950 text-blue-400 border border-blue-800',
    price: 'text-blue-400',
    dot: 'bg-blue-500',
    divider: 'border-blue-900',
    componentBar: 'bg-blue-950',
  },
  premium: {
    border: 'border-violet-800',
    badge: 'bg-violet-950 text-violet-400 border border-violet-800',
    price: 'text-violet-400',
    dot: 'bg-violet-500',
    divider: 'border-violet-900',
    componentBar: 'bg-violet-950',
  },
} as const;

function fmt(min: number, max: number) {
  if (min === max || max === 0) return `$${min}`;
  return `$${min}–$${max}`;
}

export default function TierCard({ tier }: { tier: Tier }) {
  const s = STYLES[tier.tier];
  return (
    <div className={`bg-gray-900 rounded-2xl border ${s.border} p-6 flex flex-col gap-5`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>
          {tier.label}
        </span>
        <div className={`w-2 h-2 rounded-full ${s.dot}`} />
      </div>

      {/* Total price */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated total</p>
        <p className={`text-3xl font-bold font-mono ${s.price}`}>
          {fmt(tier.total_price_min, tier.total_price_max)}
        </p>
      </div>

      {/* Components */}
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Bill of materials</p>
        <div className="space-y-3">
          {tier.components.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white leading-snug">{c.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{c.purpose}</p>
                {c.notes && (
                  <p className="text-xs text-gray-600 mt-0.5 italic leading-snug">{c.notes}</p>
                )}
              </div>
              <span className="text-xs font-mono text-gray-400 whitespace-nowrap pt-0.5 shrink-0">
                {fmt(c.price_min, c.price_max)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`border-t ${s.divider}`} />

      {/* Tradeoffs */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tradeoffs</p>
        <p className="text-sm text-gray-300 leading-relaxed">{tier.tradeoffs}</p>
      </div>

      {/* Gotchas */}
      {tier.gotchas && tier.gotchas.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Watch out for</p>
          <ul className="space-y-1.5">
            {tier.gotchas.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-400 leading-snug">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
