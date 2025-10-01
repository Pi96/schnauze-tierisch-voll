/** @jsxImportSource react */
import React, { useEffect, useMemo, useState } from "react";
import MediaViewer from "./MediaViewer";

type Item =
  | { type: "dir"; name: string; path: string }
  | { type: "file"; name: string; path: string; url: string; mime?: string; size?: number; modified?: number };

export default function LexikonManifestClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState("");
  const [active, setActive] = useState<Extract<Item, { type: "file" }> | null>(null);

  // aktuellen Ordnerpfad aus URL
// Pfad ohne trailing slash
const currentPath = useMemo(() => {
  const raw = window.location.pathname.replace(/^\/lexikon\/?/, "");
  const trimmed = raw.replace(/\/+$/, "");
  return "/" + (trimmed ? decodeURIComponent(trimmed) : "");
}, [window.location.pathname]);

// gewünschte Datei aus ?file=
const fileParam = useMemo(() => {
  const usp = new URLSearchParams(window.location.search);
  const f = usp.get("file");
  return f ? decodeURIComponent(f) : "";
}, [window.location.search]);

useEffect(() => {
  let cancelled = false;
  (async () => {
    try {
      const res = await fetch("/lexikon_manifest.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      const data = await res.json();
      if (cancelled) return;

      const all = Array.isArray(data.items) ? (data.items as Item[]) : [];
      setItems(all);

      // Dateien im aktuellen Ordner
      const hereFiles = all.filter((i) => i.type === "file" && i.path === currentPath) as Extract<Item, { type: "file" }>[];

      // 1) Falls ?file= gesetzt ist, diese Datei wählen (falls vorhanden)
      const byParam = fileParam ? hereFiles.find(f => f.name === fileParam) : null;

      // 2) sonst erstes Bild, 3) sonst erste Datei
      const firstImg = hereFiles.find(f => (f.mime || "").startsWith("image/"));
      setActive(byParam || firstImg || hereFiles[0] || null);
    } catch (e: any) {
      if (!cancelled) setErr(e?.message || "Manifest konnte nicht geladen werden.");
    }
  })();
  return () => { cancelled = true; };
}, [currentPath, fileParam]);


  if (err) return <div className="text-red-600">Fehler: {err}</div>;
  if (!items.length) return <div>Lade Inhalte…</div>;

  const depth = (p: string) => p.split("/").filter(Boolean).length;
  const curDepth = depth(currentPath);

  const hereFiles = items.filter((i): i is Extract<Item, { type: "file" }> => i.type === "file" && i.path === currentPath);
  const subdirs = items.filter(i => i.type === "dir" && i.path.startsWith(currentPath) && depth(i.path) === curDepth + 1);

  // Breadcrumbs
  const parts = currentPath.split("/").filter(Boolean);
  const crumbPaths = parts.map((_, idx) => "/" + parts.slice(0, idx + 1).join("/"));

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-neutral-600">
        <a className="underline" href="/lexikon">/</a>
        {parts.map((c, i) => (
          <span key={i}>
            {" / "}
            <a className="underline" href={`/lexikon/${crumbPaths[i].split("/").filter(Boolean).join("/")}`}>{c}</a>
          </span>
        ))}
      </nav>

      {/* Oben: Inline-Viewer, falls Datei gewählt */}
      {active && (
        <section className="mb-4">
          <MediaViewer item={{ name: active.name, url: active.url, mime: active.mime }} />
        </section>
      )}

      {/* Unterordner */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Unterordner</h2>
        {subdirs.length === 0 ? (
          <div className="text-neutral-500">Keine Unterordner.</div>
        ) : (
          <ul className="grid md:grid-cols-2 gap-3">
            {subdirs
              .sort((a, b) => a.name.localeCompare(b.name, "de"))
              .map((d) => {
                const slug = d.path.split("/").filter(Boolean).join("/");
                return (
                  <li key={d.path}>
                    <a href={`/lexikon/${slug}`} className="block p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100">
                      📁 {d.name}
                    </a>
                  </li>
                );
              })}
          </ul>
        )}
      </section>

      {/* Dateien */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Dateien</h2>
        {hereFiles.length === 0 ? (
          <div className="text-neutral-500">Keine Dateien in diesem Ordner.</div>
        ) : (
          <ul className="grid md:grid-cols-2 gap-3">
            {hereFiles
              .sort((a, b) => a.name.localeCompare(b.name, "de"))
              .map((f) => (
                <li key={f.url}>
<button
  onClick={() => {
    setActive(f);
    const usp = new URLSearchParams(window.location.search);
    usp.set("file", f.name);
    window.history.replaceState({}, "", `${window.location.pathname}?${usp.toString()}`);
  }}
  className="w-full text-left p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100"
>
  📄 {f.name}
</button>
                  {/* optional: Direkt öffnen */}
                  <div className="text-xs text-neutral-500">
                    <a href={f.url} target="_blank" rel="noreferrer" className="underline">im neuen Tab öffnen</a>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}
