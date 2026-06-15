import React, { useState } from 'react';

export default function ChannelCard({ channel, active, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = channel.name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <button
      onClick={onClick}
      className={`card-hover text-left relative bg-bg-800/70 border border-white/5 rounded-2xl p-3 flex flex-col gap-2 ${
        active ? 'ring-2 ring-accent border-accent/60 shadow-glow' : ''
      }`}
    >
      <div className="aspect-video bg-bg-900/80 rounded-xl grid place-items-center overflow-hidden relative">
        {channel.logo && !imgErr ? (
          <img
            src={channel.logo}
            alt={channel.name}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="max-w-[80%] max-h-[80%] object-contain"
          />
        ) : (
          <div className="text-2xl font-extrabold text-white/30">{initials}</div>
        )}
        {active && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
            <span className="live-dot" /> Live
          </div>
        )}
        {channel.countryFlag && (
          <div className="absolute top-2 right-2 text-base drop-shadow">{channel.countryFlag}</div>
        )}
      </div>
      <div className="px-1">
        <div className="text-sm font-semibold truncate">{channel.name}</div>
        <div className="text-[11px] text-white/40 truncate">
          {channel.categoryNames.slice(0, 2).join(' · ') || channel.countryName || '—'}
        </div>
      </div>
    </button>
  );
}
