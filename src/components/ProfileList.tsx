/** @jsxImportSource react */
import React, { useMemo, useState } from 'react';
import profiles from '../data/profile.json';

type Links = Partial<{
  instagram: string;
  tiktok: string;
  facebook: string;
}>;

type Profile = {
  name: string;
  icon?: string; // "horse" | "pferd" | "horse.svg" | ...
  bg?: string;   // z.B. "bg-green-300"
  links?: Links;
};

// Kategorien + Aliasse (de/en & optional .svg)
const CATEGORIES = [
  { key: 'paw',    icon: '/images/icons/paw.svg',    legend: 'Tierschutz', aliases: ['paw','pfote','hund','katze'] },
  { key: 'cat',    icon: '/images/icons/cat.svg',    legend: 'Katze',                  aliases: ['cat','katze'] },
  { key: 'cow',    icon: '/images/icons/cow.svg',    legend: 'Kuh · Stall · Landwirtschaft', aliases: ['cow','kuh','hof','stall','lebenshof'] },
  { key: 'zoo',    icon: '/images/icons/zoo.svg',    legend: 'Zoo · Wildtiere',        aliases: ['zoo','wild','wildtiere'] },
  { key: 'turtle', icon: '/images/icons/turtle.svg', legend: 'Schildkröte · Reptil', aliases: ['turtle','schildkroete','schildkröte'] },
  { key: 'horse',  icon: '/images/icons/horse.svg',  legend: 'Stall · Reiten · Pferd', aliases: ['horse','pferd','reiten','stall'] },
  { key: 'dog',    icon: '/images/icons/dog.svg',    legend: 'Hund · Training',       aliases: ['dog','hund'] },
] as const;

type CategoryKey = typeof CATEGORIES[number]['key'];

// JSON-icon → normalisierten CategoryKey mappen
const iconToCategoryKey = (icon?: string): CategoryKey | null => {
  if (!icon) return null;
  const val = icon.replace('.svg', '').trim().toLowerCase();
  const found = CATEGORIES.find(c => c.key === val || c.aliases.includes(val));
  return found ? found.key : null;
};

export default function ProfileList() {
  // Start: keine Kategorie aktiv → ALLE anzeigen
  const [active, setActive] = useState<Record<CategoryKey, boolean>>(
    () => CATEGORIES.reduce((acc, c) => ({ ...acc, [c.key]: false }), {} as Record<CategoryKey, boolean>)
  );

  const toggle = (key: CategoryKey) =>
    setActive(prev => ({ ...prev, [key]: !prev[key] }));

  const activeList = useMemo(
    () => (Object.entries(active).filter(([, on]) => on).map(([k]) => k) as CategoryKey[]),
    [active]
  );

  // 1) Alphabetisch sortierte, deduplizierte Basisliste (nach Name, case-insensitive)
  const sorted = useMemo(() => {
    const seen = new Set<string>();
    return (profiles as Profile[])
      .filter(p => {
        const key = (p.name || '').trim().toLowerCase();
        if (!key) return false;
        if (seen.has(key)) return false; // Duplikate im JSON abfangen
        seen.add(key);
        return true;
      })
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
  }, []);

  // 2) Filter anwenden: keine Auswahl → alle; sonst nur passende Icons
  const filtered = useMemo(() => {
    if (activeList.length === 0) return sorted;
    return sorted.filter(p => {
      const key = iconToCategoryKey(p.icon);
      return key ? activeList.includes(key) : false;
    });
  }, [sorted, activeList]);

  return (
    <section className="space-y-4">
      {/* Filter-Icons */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            type="button"
            onClick={() => toggle(c.key)}
            aria-pressed={active[c.key]}
            title={c.key}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition
              ${active[c.key] ? 'bg-gray-100' : 'bg-white opacity-60'}
            `}
          >
            <img src={c.icon} alt={c.key} className="w-5 h-5" />
            <span className="capitalize">{c.key}</span>
          </button>
        ))}
      </div>

      {/* Legende */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
        <span className="font-medium">Legende:</span>
        {CATEGORIES.map(c => (
          <span key={c.key} className="inline-flex items-center gap-2">
            <img src={c.icon} alt="" className="w-4 h-4" />
            <span>{c.legend}</span>
          </span>
        ))}
      </div>

      {/* Liste: 1 Profil pro Zeile, nach ~10 Zeilen Scroll */}
      <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
        {filtered.map(p => {
          const bg = p.bg || 'bg-gray-200';
          const iconName = (p.icon || '').replace('.svg','');
          return (
            <div
              key={`${p.name}__${iconName}`}
              className={`flex items-center justify-between gap-3 ${bg} rounded-xl shadow-sm px-3 py-2 min-h-14`}
            >
              {/* Links: Tier/Icon + Name */}
              <div className="flex items-center gap-3 min-w-0">
                {p.icon && (
                  <img
                    src={`/images/icons/${iconName}.svg`}
                    alt=""
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span className="font-medium truncate">{p.name}</span>
              </div>

              {/* Rechts: Social-Icons (nur vorhandene) */}
              <div className="flex items-center gap-3 shrink-0">
                {p.links?.instagram && (
                  <a href={p.links.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} auf Instagram`}>
                    <img src="/images/icons/instagram.svg" alt="" className="w-6 h-6" />
                  </a>
                )}
                {p.links?.tiktok && (
                  <a href={p.links.tiktok} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} auf TikTok`}>
                    <img src="/images/icons/tiktok.svg" alt="" className="w-6 h-6" />
                  </a>
                )}
                {p.links?.facebook && (
                  <a href={p.links.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} auf Facebook`}>
                    <img src="/images/icons/facebook.svg" alt="" className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 px-1 pb-2">
            Keine Profile für die gewählten Kategorien.
          </p>
        )}
      </div>
    </section>
  );
}
