import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Readable } from 'node:stream';

function streamProxy() {
  return {
    name: 'stream-proxy',
    configureServer(server) {
      server.middlewares.use('/proxy', async (req, res) => {
        const target = new URL(req.url, 'http://x').searchParams.get('url');
        if (!target) {
          res.statusCode = 400;
          res.end('missing url');
          return;
        }

        let upstream;
        try {
          upstream = await fetch(target, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
              Referer: new URL(target).origin + '/',
            },
            redirect: 'follow',
          });
        } catch (e) {
          res.statusCode = 502;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(`upstream fetch failed: ${e.message}`);
          return;
        }

        res.statusCode = upstream.status;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        const ct = upstream.headers.get('content-type');
        if (ct) res.setHeader('content-type', ct);

        const isPlaylist =
          /\.m3u8($|\?)/i.test(target) ||
          (ct && /mpegurl|m3u8/i.test(ct));

        if (isPlaylist) {
          const text = await upstream.text();
          const base = new URL(upstream.url || target);
          const rewritten = text
            .split('\n')
            .map((line) => {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith('#')) {
                return line.replace(
                  /URI="([^"]+)"/g,
                  (_, uri) =>
                    `URI="/proxy?url=${encodeURIComponent(
                      new URL(uri, base).toString()
                    )}"`
                );
              }
              const abs = new URL(trimmed, base).toString();
              return `/proxy?url=${encodeURIComponent(abs)}`;
            })
            .join('\n');
          res.end(rewritten);
          return;
        }

        if (upstream.body) {
          Readable.fromWeb(upstream.body).pipe(res);
        } else {
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), streamProxy()],
  server: {
    host: true,
    port: 5173,
  },
});
