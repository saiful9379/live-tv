import React, { useState } from 'react';
import Header from './components/Header.jsx';
import QuickFilters, { PRESETS } from './components/QuickFilters.jsx';
import ChannelGrid from './components/ChannelGrid.jsx';
import Player from './components/Player.jsx';
import { useChannels, useFiltered, usePresetCounts } from './hooks/useChannels.js';

export default function App() {
  const { channels, countries, categories, loading, error } = useChannels();
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [preset, setPreset] = useState('');
  const [active, setActive] = useState(null);

  const filtered = useFiltered(channels, { query, country, category, preset });
  const presetCounts = usePresetCounts(channels);
  const presetLabel = PRESETS.find((p) => p.id === preset)?.label;

  const pick = (ch) => {
    setActive(ch);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <Header
        query={query}
        onQuery={setQuery}
        country={country}
        onCountry={setCountry}
        category={category}
        onCategory={setCategory}
        countries={countries}
        categories={categories}
        total={channels.length}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        <QuickFilters active={preset} onPick={setPreset} counts={presetCounts} />

        {active && <Player channel={active} onClose={() => setActive(null)} />}

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} />
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <h2 className="text-base md:text-lg font-bold tracking-tight">
                {preset
                  ? `${presetLabel} channels`
                  : active
                  ? 'More channels'
                  : 'Browse channels'}
                <span className="ml-2 text-xs font-medium text-white/40">
                  {filtered.length.toLocaleString()} results
                </span>
              </h2>
            </div>
            <ChannelGrid
              channels={filtered}
              activeId={active?.id}
              onPick={pick}
            />
          </>
        )}
      </main>

      <footer className="border-t border-white/5 py-4 text-center text-xs text-white/30">
        Streams provided by{' '}
        <a
          href="https://github.com/iptv-org/iptv"
          target="_blank"
          rel="noreferrer"
          className="hover:text-accent-400"
        >
          iptv-org/iptv
        </a>
        . Availability of channels is not guaranteed.
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-800/40 border border-white/5 rounded-2xl p-3 animate-pulse"
        >
          <div className="aspect-video bg-bg-700/50 rounded-xl" />
          <div className="h-3 bg-bg-700/50 rounded mt-3 w-3/4" />
          <div className="h-2 bg-bg-700/40 rounded mt-2 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="text-center py-24">
      <div className="text-5xl mb-3">😵</div>
      <div className="font-semibold">Couldn’t load channels</div>
      <div className="text-sm text-white/50 mt-1">{message}</div>
    </div>
  );
}
