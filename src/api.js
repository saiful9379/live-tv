const API = 'https://iptv-org.github.io/api';

async function getJSON(path) {
  const res = await fetch(`${API}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

export async function fetchAllData() {
  const [channels, streams, countries, categories] = await Promise.all([
    getJSON('channels.json'),
    getJSON('streams.json'),
    getJSON('countries.json'),
    getJSON('categories.json'),
  ]);

  const ADULT_CATEGORIES = new Set(['xxx']);
  const ADULT_NAME_PATTERN = /\b(xxx|porn|adult|hustler|playboy|vivid|brazzers)\b/i;

  const streamByChannel = new Map();
  for (const s of streams) {
    if (!s.channel || !s.url) continue;
    const existing = streamByChannel.get(s.channel);
    if (!existing) {
      streamByChannel.set(s.channel, s);
      continue;
    }
    const existingIsHls = /\.m3u8(\?|$)/i.test(existing.url);
    const candidateIsHls = /\.m3u8(\?|$)/i.test(s.url);
    if (candidateIsHls && !existingIsHls) {
      streamByChannel.set(s.channel, s);
    }
  }

  const countryMap = new Map(countries.map((c) => [c.code, c]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const merged = channels
    .map((ch) => {
      if (ch.is_nsfw) return null;
      if ((ch.categories || []).some((id) => ADULT_CATEGORIES.has(id))) return null;
      if (ADULT_NAME_PATTERN.test(ch.name)) return null;
      const stream = streamByChannel.get(ch.id);
      if (!stream) return null;
      return {
        id: ch.id,
        name: ch.name,
        altNames: ch.alt_names || [],
        logo: ch.logo,
        country: ch.country,
        countryName: countryMap.get(ch.country)?.name,
        countryFlag: countryMap.get(ch.country)?.flag,
        languages: ch.languages || [],
        categories: ch.categories || [],
        categoryNames: (ch.categories || [])
          .map((id) => categoryMap.get(id)?.name)
          .filter(Boolean),
        isNsfw: ch.is_nsfw,
        website: ch.website,
        url: stream.url,
        referrer: stream.referrer,
        userAgent: stream.user_agent,
      };
    })
    .filter(Boolean);

  const filteredCategories = categories.filter((c) => !ADULT_CATEGORIES.has(c.id));

  return { channels: merged, countries, categories: filteredCategories };
}
