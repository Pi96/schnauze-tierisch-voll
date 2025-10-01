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
  const slug = it.path.split("/").filter(Boolean).join("/");
  // Link zeigt auf den Ordner + gewünschte Datei als ?file=
  const href = `/lexikon/${slug}?file=${encodeURIComponent(it.name)}`;
  return (
    <a href={href} className="block truncate hover:underline" title={it.name}>
      {it.name}
    </a>
  );
};

  if (!files.length) return null;

  return (
    <div className="pointer-events-none select-none">
      <div className="absolute left-6 top-10 w-48 text-sm text-neutral-900/90 space-y-1 pointer-events-auto">
        {left.map((it) => <LinkItem key={it.url} it={it} />)}
      </div>
      <div className="absolute right-6 bottom-10 w-48 text-sm text-neutral-900/90 text-right space-y-1 pointer-events-auto">
        {right.map((it) => <LinkItem key={it.url} it={it} />)}
      </div>
    </div>
  );
}
