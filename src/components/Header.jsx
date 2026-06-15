import React from 'react';

export default function Header({
  query,
  onQuery,
  country,
  onCountry,
  category,
  onCategory,
  countries,
  categories,
  total,
}) {
  return (
    <header className="sticky top-0 z-30 glass">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-cyan-400 grid place-items-center shadow-glow">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-bg-900" fill="currentColor">
              <path d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7v2H7v2h10v-2h-3v-2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 14H3V5h18z" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-lg">Nova<span className="text-accent">TV</span></div>
            <div className="text-[11px] text-white/50">{total.toLocaleString()} live channels</div>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search channels, countries…"
              className="w-full bg-bg-700/60 border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-accent/60 focus:bg-bg-700"
            />
          </div>

          <select
            value={country}
            onChange={(e) => onCountry(e.target.value)}
            className="bg-bg-700/60 border border-white/5 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent/60 max-w-[160px]"
          >
            <option value="">All countries</option>
            {countries
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
          </select>

          <select
            value={category}
            onChange={(e) => onCategory(e.target.value)}
            className="bg-bg-700/60 border border-white/5 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent/60 max-w-[160px]"
          >
            <option value="">All categories</option>
            {categories
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>

        </div>
      </div>
    </header>
  );
}
