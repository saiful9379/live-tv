import React, { useEffect, useRef, useState } from 'react';
import ChannelCard from './ChannelCard.jsx';

const PAGE = 60;

export default function ChannelGrid({ channels, activeId, onPick }) {
  const [visible, setVisible] = useState(PAGE);
  const sentinel = useRef(null);

  useEffect(() => {
    setVisible(PAGE);
  }, [channels]);

  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible((v) => Math.min(v + PAGE, channels.length));
        }
      },
      { rootMargin: '600px' }
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [channels.length]);

  if (channels.length === 0) {
    return (
      <div className="text-center py-24 text-white/50">
        <div className="text-5xl mb-3">📺</div>
        No channels match your filters.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {channels.slice(0, visible).map((ch) => (
          <ChannelCard
            key={ch.id}
            channel={ch}
            active={ch.id === activeId}
            onClick={() => onPick(ch)}
          />
        ))}
      </div>
      {visible < channels.length && (
        <div ref={sentinel} className="py-8 text-center text-white/40 text-xs">
          Loading more…
        </div>
      )}
    </>
  );
}
