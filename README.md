# NovaTV — IPTV Web Player

A modern, dark-themed web app to browse and watch thousands of live channels from
[iptv-org/iptv](https://github.com/iptv-org/iptv). Click a channel and it plays
in an embedded HLS player.

![stack](https://img.shields.io/badge/React-18-61dafb) ![stack](https://img.shields.io/badge/Vite-5-646cff) ![stack](https://img.shields.io/badge/Tailwind-3-38bdf8) ![stack](https://img.shields.io/badge/hls.js-1.5-ff5252)

---

## How to run

### 1. Install Node.js (one-time)

You need Node.js **v18 or newer**. The easiest way on Linux/macOS is **nvm**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Close and reopen your terminal (or `source ~/.bashrc`), then install Node:

```bash
nvm install --lts
node --version    # should print v20.x or v22.x or higher
npm --version
```

> Alternative (Ubuntu/Debian, system-wide): `sudo apt update && sudo apt install -y nodejs npm`

### 2. Install project dependencies (one-time)

From this directory (`/home/sayan/Desktop/iptv_system`):

```bash
npm install
```

This downloads `react`, `vite`, `hls.js`, `tailwindcss`, etc. into `node_modules/`.

### 3. Start the dev server

```bash
npm run dev
```

You should see:

```
  VITE v5.4.21  ready in 109 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.0.9:5173/
```

Open <http://localhost:5173> in your browser. Channels load automatically from
iptv-org. Click any card to start streaming.

To stop the server: press `Ctrl+C` in the terminal.

### 4. (Optional) Production build

```bash
npm run build      # outputs static files to dist/
npm run preview    # serves the built app on http://localhost:4173
```

You can deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub
Pages, Nginx, etc.) — no server required, everything runs in the browser.

---

## Coming back later (after a reboot)

If you already installed everything and just want to run it again:

```bash
cd /home/sayan/Desktop/iptv_system
npm run dev
```

If `node` is "command not found" after a reboot (because nvm only loads in
interactive shells), source it first:

```bash
source ~/.nvm/nvm.sh
npm run dev
```

---

## Features
- Live channel grid with logos, country flags, categories
- Full-text search + filter by country + filter by category
- Safe-mode toggle (hides NSFW channels by default)
- HLS playback via `hls.js` (with native fallback on Safari/iOS)
- Infinite scroll, lazy-loaded logos, graceful error handling
- Responsive layout, glassy header, soft motion

## Project layout
```
iptv_system/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # React entry
    ├── App.jsx               # top-level layout + state
    ├── index.css             # Tailwind + global styles
    ├── api.js                # fetches channels/streams from iptv-org
    ├── hooks/
    │   └── useChannels.js    # data hook + filter logic
    └── components/
        ├── Header.jsx        # search + filter bar
        ├── ChannelGrid.jsx   # responsive grid + infinite scroll
        ├── ChannelCard.jsx   # individual channel card
        └── Player.jsx        # hls.js video player
```

## Notes on stream playback
- Some streams in the iptv-org list are geo-restricted, require a referer
  header, or are simply offline. The player will show "This stream is
  unavailable" in that case — try another channel.
- Browser CORS policy applies. Most streams in the list are CORS-friendly,
  but a small number may fail if served from origins without
  `Access-Control-Allow-Origin`. Working around this requires a server-side
  proxy (out of scope for this client).

## Data source
Live JSON pulled at runtime from <https://iptv-org.github.io/api>:
- `channels.json` — channel metadata
- `streams.json`  — stream URLs (.m3u8)
- `countries.json`, `categories.json` — taxonomies

## Tech
- React 18 + Vite 5
- Tailwind CSS 3
- hls.js 1.5

## Troubleshooting

| Problem | Fix |
|---|---|
| `node: command not found` | Run `source ~/.nvm/nvm.sh` (or reopen terminal) |
| Port 5173 already in use | Stop the other server, or run `npm run dev -- --port 5174` |
| Blank page / nothing loads | Check the browser console; usually a network/CORS issue with iptv-org |
| Most streams fail to play | Streams die over time — try a popular one (BBC, France 24, NHK, Al Jazeera) |
| `npm install` is slow | Normal on first run (~130 packages); subsequent installs are cached |
