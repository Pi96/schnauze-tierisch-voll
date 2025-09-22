/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
import { fetchLatest } from '../lib/api';


type Item = { name: string; path: string; url?: string };
export default function LatestOverlay() {
const [items, setItems] = useState<Item[]>([]);
useEffect(() => { (async () => {
try { const data = await fetchLatest(10); setItems(data.items || data); } catch {}
})(); }, []);


const left = items.slice(0,5);
const right = items.slice(5,10);
const LinkItem = ({it}:{it:Item}) => (
<a href={`/lexikon?path=${encodeURIComponent(it.path)}`} className="block truncate hover:underline">{it.name}</a>
);


return (
<div className="pointer-events-none select-none">
<div className="absolute left-6 top-10 w-48 text-sm text-neutral-900/90 space-y-1 pointer-events-auto">
{left.map(it => <LinkItem key={it.path+it.name} it={it}/>) }
</div>
<div className="absolute right-6 bottom-10 w-48 text-sm text-neutral-900/90 text-right space-y-1 pointer-events-auto">
{right.map(it => <LinkItem key={it.path+it.name} it={it}/>) }
</div>
</div>
);
}
