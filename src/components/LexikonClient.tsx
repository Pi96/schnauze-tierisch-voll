/** @jsxImportSource react */
import React, { useEffect, useMemo, useState } from 'react';
import { fetchList } from '../lib/api';
import MediaViewer from './MediaViewer';

type Item = { name: string; type: 'file'|'dir'; url?: string; mime?: string; path?: string };

export default function LexikonClient() {
  const [path, setPath] = useState<string>('/');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeFile, setActiveFile] = useState<Item | null>(null);

  // path aus URL lesen
  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    const p = usp.get('path') || '/';
    setPath(p);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError('');
      try {
        const data = await fetchList(path);
        const list: Item[] = data.items || data || [];
        if (!cancelled) {
          setItems(list);
          // falls eine Datei dabei ist, nimm die erste als Vorschau
          const firstFile = list.find(i => i.type === 'file') || null;
          setActiveFile(firstFile);
        }
      } catch (e:any) {
        if (!cancelled) setError('Konnte Inhalte nicht laden.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [path]);

  const go = (newPath:string) => {
    const usp = new URLSearchParams(window.location.search);
    usp.set('path', newPath);
    const url = `${window.location.pathname}?${usp.toString()}`;
    history.pushState({}, '', url);
    setPath(newPath);
  };

  if (loading) return <div>Lade Inhalte…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const dirs = items.filter(i => i.type === 'dir');
  const files = items.filter(i => i.type === 'file');

  // Breadcrumbs aus path
  const crumbs = path.split('/').filter(Boolean);
  const crumbPaths = crumbs.map((_, idx) => '/' + crumbs.slice(0, idx+1).join('/'));

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-neutral-600">
        <button className="underline" onClick={() => go('/')}>/</button>
        {crumbs.map((c, i) => (
          <span key={i}>
            {' / '}
            <button className="underline" onClick={() => go(crumbPaths[i])}>{c}</button>
          </span>
        ))}
      </nav>

      {/* Viewer oben */}
      {activeFile && (
        <section className="mb-4">
          <MediaViewer item={{
            name: activeFile.name,
            mime: activeFile.mime,
            url: activeFile.url
          }} />
        </section>
      )}

      {/* Ordner */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Ordner</h2>
        {dirs.length === 0 ? <div className="text-neutral-500">Keine Unterordner.</div> :
          <ul className="grid md:grid-cols-2 gap-3">
            {dirs.map(d => {
              // aus API: d.url ist /api/list?path=/...  -> wir brauchen nur den path
              const newPath = (d.url && d.url.includes('path=')) ? decodeURIComponent(d.url.split('path=')[1]) : (path.endsWith('/') ? path + d.name : path + '/' + d.name);
              return (
                <li key={d.name}>
                  <button onClick={() => go(newPath)} className="w-full text-left p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100">
                    📁 {d.name}
                  </button>
                </li>
              );
            })}
          </ul>
        }
      </section>

      {/* Dateien */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Dateien</h2>
        {files.length === 0 ? <div className="text-neutral-500">Keine Dateien in diesem Ordner.</div> :
          <ul className="grid md:grid-cols-2 gap-3">
            {files.map(f => (
              <li key={f.name}>
                <button
                  onClick={() => setActiveFile(f)}
                  className="w-full text-left p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100"
                  title="Vorschau oben anzeigen"
                >
                  📄 {f.name}
                </button>
              </li>
            ))}
          </ul>
        }
      </section>
    </div>
  );
}
