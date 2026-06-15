import { useEffect, useMemo, useState } from 'react';
import { fetchAllData } from '../api';
import { PRESET_RULES } from '../components/QuickFilters.jsx';

export function useChannels() {
  const [data, setData] = useState({ channels: [], countries: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchAllData()
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((e) => {
        if (alive) setError(e);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { ...data, loading, error };
}

function matchesPreset(ch, presetId) {
  if (!presetId) return true;
  const rule = PRESET_RULES[presetId];
  if (!rule) return true;
  if (rule.category && !ch.categories.includes(rule.category)) return false;
  if (rule.requireCategory && !ch.categories.includes(rule.requireCategory)) {
    if (!rule.nameRegex || !rule.nameRegex.test(ch.name)) return false;
  }
  if (rule.nameRegex) {
    const hay = ch.name + ' ' + ch.altNames.join(' ');
    if (!rule.nameRegex.test(hay)) return false;
  }
  return true;
}

export function useFiltered(channels, { query, country, category, preset }) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return channels.filter((ch) => {
      if (!matchesPreset(ch, preset)) return false;
      if (country && ch.country !== country) return false;
      if (category && !ch.categories.includes(category)) return false;
      if (q) {
        const hay =
          ch.name.toLowerCase() +
          ' ' +
          ch.altNames.join(' ').toLowerCase() +
          ' ' +
          (ch.countryName || '').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [channels, query, country, category, preset]);
}

export function usePresetCounts(channels) {
  return useMemo(() => {
    const counts = { '': channels.length };
    for (const id of Object.keys(PRESET_RULES)) counts[id] = 0;
    for (const ch of channels) {
      for (const id of Object.keys(PRESET_RULES)) {
        if (matchesPreset(ch, id)) counts[id]++;
      }
    }
    return counts;
  }, [channels]);
}
