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
  const currentPath = useMemo(() => {
    const p = window.location.pathname.replace(/^\/lexikon\/?/, "");
    return "/" + (p ? decodeURIComponent(p) : "");
  }, [window.location.pathname]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/lexikon_manifest.json", { cache: "no-store" });
        if (!res.ok) throw new Error(res.status + " " + res.statusText);
        const data = await res.json();
        if (!cancelled) {
          const all = Array.isArray(data.items) ? (data.items as Item[]) : [];
          setItems(all);
          // wenn im Ordner eine Bilddatei existiert → initial anzeigen
          const hereFiles = all.filter((i) => i.type === "file" && i.path === currentPath) as Extract<Item, { type: "file" }>[];
          const firstImg = hereFiles.find(f => (f.mime || "").startsWith("image/"));
          setActive(firstImg || hereFiles[0] || null);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Manifest konnte nicht geladen werden.");
      }
    })();
    return () => { cancelled = true; };
  }, [currentPath]);

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
                    onClick={() => setActive(f)}
                    className="w-full text-left p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100"
                    title="Oben anzeigen"
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
