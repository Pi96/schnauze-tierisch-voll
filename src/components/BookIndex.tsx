/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
import { fetchList } from '../lib/api';


type Item = { name: string; type: 'file'|'dir'; url: string; mime?: string };
export default function BookIndex() {
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(true);
useEffect(() => { (async () => { try {
const data = await fetchList('/');
setItems(data.items || data);
} finally { setLoading(false); } })(); }, []);


if (loading) return <div className="text-white/90">Lade Inhalte…</div>;
return (
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
{items.filter(i=>i.type==='dir').map(dir => (
<a key={dir.name} href={`/lexikon?path=${encodeURIComponent('/'+dir.name)}`}
className="block p-4 bg-white/90 rounded-2xl shadow hover:shadow-md">
<div className="font-semibold text-lg">{dir.name}</div>
<div className="text-sm text-neutral-600">Kategorie öffnen</div>
</a>
))}
</div>
);
}
