/** @jsxImportSource react */
import React, { useEffect, useState, useMemo } from "react";

type FileItem = { type: "file"; name: string; path: string; url: string; mime?: string; modified?: number };

export default function LatestOverlay() {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/lexikon_manifest.json");
        if (!res.ok) throw new Error(res.status + " " + res.statusText);
        const data = await res.json();
        const all = Array.isArray(data.items) ? data.items : [];
        const onlyFiles = all.filter((i: any) => i?.type === "file") as FileItem[];
        const sorted = onlyFiles.sort((a, b) => (b.modified || 0) - (a.modified || 0)).slice(0, 10);
        if (!cancelled) setFiles(sorted);
      } catch {
        if (!cancelled) setFiles([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const left = useMemo(() => files.slice(0, 5), [files]);
  const right = useMemo(() => files.slice(5, 10), [files]);

const LinkItem = ({ it }: { it: FileItem }) => {
  // it.path ist "" (root) oder z. B. "/Ausland"
  const clean = (it.path || '').replace(/^\/+/, '').replace(/\/+$/, ''); // "Ausland" | ""
  const slug  = clean ? clean.split('/').map(encodeURIComponent).join('/') : '';
  const href  = slug
    ? `/lexikon/${slug}?file=${encodeURIComponent(it.name)}`
    : `/lexikon?file=${encodeURIComponent(it.name)}`; // root-Datei

  return (
    <a href={href} className="block truncate hover:underline" title={it.name}>
      {it.name}
    </a>
  );
};



if (!files.length) return null;

return (
  <div className="absolute inset-x-6 top-6 md:top-8 z-20 pointer-events-auto">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-900/90">
 <div className="space-y-2 md:space-y-2.5 leading-relaxed">
        {left.map((it) => <LinkItem key={it.url} it={it} />)}
      </div>
 <div className="space-y-2 md:space-y-2.5 leading-relaxed">
        {right.map((it) => <LinkItem key={it.url} it={it} />)}
      </div>
    </div>
  </div>
);

}
