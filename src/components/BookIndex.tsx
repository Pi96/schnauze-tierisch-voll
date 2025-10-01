/** @jsxImportSource react */
import React, { useEffect, useState, useMemo } from "react";

type ManifestItem =
  | { type: "dir"; name: string; path: string }
  | { type: "file"; name: string; path: string; url: string; mime?: string; size?: number; modified?: number };

export default function BookIndex() {
  const [items, setItems] = useState<ManifestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/lexikon_manifest.json");
        if (!res.ok) throw new Error(res.status + " " + res.statusText);
        const data = await res.json();
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Manifest konnte nicht geladen werden.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const topLevelDirs = useMemo(() => {
    // depth = 1 → /Kategorie
    const depth = (p: string) => p.split("/").filter(Boolean).length;
    const set = new Map<string, ManifestItem>();
    items.forEach(i => {
      if (i.type === "dir" && depth(i.path) === 1) set.set(i.path, i);
      // Falls es nur Dateien in einer Kategorie gibt (kein dir-Eintrag), trotzdem Kategorie anzeigen:
      if (i.type === "file" && depth(i.path) === 1 && !set.has(i.path)) {
        const name = i.path.split("/").filter(Boolean).pop() || i.path;
        set.set(i.path, { type: "dir", name, path: i.path });
      }
    });
    // alphabetisch
    return Array.from(set.values()).sort((a, b) => a.name.localeCompare(b.name, "de"));
  }, [items]);

  if (loading) return <div className="text-white/90">Lade Kategorien…</div>;
  if (err) return <div className="text-red-100 bg-red-700/50 p-3 rounded-xl">Fehler: {err}</div>;
  if (!topLevelDirs.length) return <div className="text-white/90">Noch keine Kategorien.</div>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {topLevelDirs.map(dir => {
        const slug = dir.path.split("/").filter(Boolean).join("/");
        return (
          <a key={dir.path} href={`/lexikon/${slug}`}
             className="block p-4 bg-white/90 rounded-2xl shadow hover:shadow-md">
            <div className="font-semibold text-lg">{dir.name}</div>
            <div className="text-sm text-neutral-600">Kategorie öffnen</div>
          </a>
        );
      })}
    </div>
  );
}
