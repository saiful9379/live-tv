import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const CONNECT_TIMEOUT_MS = 15000;

function proxied(url) {
  return `/proxy?url=${encodeURIComponent(url)}`;
}

export default function Player({ channel, onClose }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel) return;

    setStatus('loading');
    setErrMsg('');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const url = proxied(channel.url);
    const isHls = /\.m3u8(\?|$)/i.test(channel.url);

    const onPlaying = () => setStatus('playing');
    video.addEventListener('playing', onPlaying);

    const timeoutId = setTimeout(() => {
      setStatus((prev) => {
        if (prev === 'playing') return prev;
        setErrMsg('Took too long to connect — channel is probably offline.');
        return 'error';
      });
    }, CONNECT_TIMEOUT_MS);

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setStatus('error');
          setErrMsg(data.details || 'Stream failed to load');
        }
      });
    } else {
      video.src = url;
      video.play().catch(() => {});
      video.onerror = () => {
        setStatus('error');
        setErrMsg('Playback error');
      };
    }

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('playing', onPlaying);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.removeAttribute('src');
      video.load();
    };
  }, [channel]);

  if (!channel) return null;

  return (
    <div className="animate-slide-up bg-bg-800/80 border border-white/5 rounded-2xl overflow-hidden glass">
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          autoPlay
          playsInline
        />
        {status === 'loading' && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="flex flex-col items-center gap-3 text-white/80">
              <div className="w-10 h-10 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
              <div className="text-sm">Connecting to stream…</div>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 grid place-items-center bg-black/60">
            <div className="text-center px-6">
              <div className="text-4xl mb-2">⚠️</div>
              <div className="font-semibold mb-1">This stream is unavailable</div>
              <div className="text-sm text-white/50 mb-4">{errMsg}</div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-accent hover:bg-accent-600 rounded-lg text-sm font-semibold"
              >
                Pick another channel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-5 flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-bg-900 grid place-items-center overflow-hidden shrink-0">
          {channel.logo ? (
            <img src={channel.logo} alt="" className="max-w-[80%] max-h-[80%] object-contain" />
          ) : (
            <div className="text-xs text-white/40">TV</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">
              <span className="live-dot" /> Live
            </div>
            <div className="text-lg font-bold truncate">{channel.name}</div>
            {channel.countryFlag && <span>{channel.countryFlag}</span>}
          </div>
          <div className="text-sm text-white/50 truncate">
            {[channel.countryName, ...channel.categoryNames].filter(Boolean).join(' · ')}
          </div>
          {channel.website && (
            <a
              href={channel.website}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-accent-400 hover:underline"
            >
              {new URL(channel.website).hostname.replace(/^www\./, '')}
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white text-sm p-2 rounded-lg hover:bg-white/5"
          title="Close player"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
