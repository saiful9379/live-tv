import React from 'react';

export const PRESETS = [
  { id: '', label: 'All', icon: '✨' },
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'cricket', label: 'Cricket', icon: '🏏' },
  { id: 'sports', label: 'Sports', icon: '🏟️' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'movies', label: 'Movies', icon: '🎬' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'kids', label: 'Kids', icon: '🧸' },
  { id: 'documentary', label: 'Docs', icon: '🎓' },
];

export const PRESET_RULES = {
  football: {
    nameRegex:
      /\b(football|soccer|fifa|uefa|champions\s*league|premier\s*league|epl|la\s*liga|laliga|bundesliga|serie\s*a|ligue\s*1|copa|fa\s*cup|mls)\b/i,
    requireCategory: 'sports',
  },
  cricket: {
    nameRegex:
      /\b(cricket|ipl|psl|bbl|cpl|t20|willow|star\s*cricket|sky\s*sports?\s*cricket|ten\s*cricket|wisden)\b/i,
  },
  sports: { category: 'sports' },
  news: { category: 'news' },
  movies: { category: 'movies' },
  music: { category: 'music' },
  kids: { category: 'kids' },
  documentary: { category: 'documentary' },
};

export default function QuickFilters({ active, onPick, counts }) {
  return (
    <div className="sticky top-[64px] md:top-[60px] z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-bg-900/80 backdrop-blur border-b border-white/5">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {PRESETS.map((p) => {
          const isActive = p.id === active;
          const count = counts?.[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold border transition ${
                isActive
                  ? 'bg-accent text-bg-900 border-accent shadow-glow'
                  : 'bg-bg-800/60 border-white/5 text-white/80 hover:border-accent/40 hover:bg-bg-700/60'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                    isActive ? 'bg-bg-900/30' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
