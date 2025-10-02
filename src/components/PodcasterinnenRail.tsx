/** @jsxImportSource react */
import React from 'react';
import list from '../data/podcasterinnen.json';

export default function PodcasterinnenRail() {
  return (
    <div className="flex gap-4 overflow-x-auto py-2 items-center text-sm">
      {list.map((p) => {
        const bg = p.bg || 'bg-gray-100'; // Fallback-Farbe
        return (
          <div
            key={p.name}
            className={`flex items-center gap-3 shrink-0 ${bg} rounded-xl shadow-sm px-3 py-2`}
          >
            {/* Podcasterinnen-Icon (halb so groß) */}
            {p.icon && (
              <img
                src={`/images/icons/${p.icon}.svg`}
                alt={p.icon}
                className="w-6 h-6 object-contain"
              />
            )}

            <div className="flex items-center gap-3">
              <span className="font-medium">{p.name}</span>

              {/* Social-Links mit festen SVGs (doppelt so groß) */}
              {p.links?.instagram && (
                <a
                  href={p.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} auf Instagram`}
                >
                  <img src="/images/icons/instagram.svg" alt="" className="w-8 h-8" />
                </a>
              )}
              {p.links?.tiktok && (
                <a
                  href={p.links.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} auf TikTok`}
                >
                  <img src="/images/icons/tiktok.svg" alt="" className="w-6 h-6" />
                </a>
              )}
              {p.links?.facebook && (
                <a
                  href={p.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} auf Facebook`}
                >
                  <img src="/images/icons/facebook.svg" alt="" className="w-8 h-8" />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
