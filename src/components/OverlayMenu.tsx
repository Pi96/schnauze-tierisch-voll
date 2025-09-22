/** @jsxImportSource react */
import React from 'react';
import nav from '../data/navigation.json';
import { click, playJingle } from '../lib/sound';


export default function OverlayMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
if (!open) return null;
return (
<div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
<nav className="absolute left-4 top-4 right-4 bg-white rounded-2xl p-6 shadow-xl" onClick={e => e.stopPropagation()}>
<ul className="grid gap-3">
{nav.map(item => (
<li key={item.path}>
<a href={item.path} onClick={() => { click(); if (item.path === '/podcast') playJingle(); }}
className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100">
<img src={`/images/icons/${item.icon}.svg`} alt="" className="w-6 h-6"/>
<span className="text-lg">{item.label}</span>
</a>
</li>
))}
<li className="mt-2 pt-2 border-t">
<a className="mr-4 underline" href="/impressum">Impressum</a>
<a className="underline" href="/datenschutz">Datenschutz</a>
</li>
</ul>
</nav>
</div>
);
}
