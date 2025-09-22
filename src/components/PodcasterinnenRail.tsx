/** @jsxImportSource react */
import React from 'react';
import list from '../data/podcasterinnen.json';
export default function PodcasterinnenRail(){
return (
<div className="flex gap-4 overflow-x-auto py-2 items-center text-sm">
{list.map(p => (
<div key={p.name} className="flex items-center gap-2 shrink-0">
<img src={p.avatar || '/images/icons/user.svg'} alt="" className="w-6 h-6 rounded-full object-cover"/>
<div className="flex items-center gap-2">
<span className="font-medium">{p.name}</span>
{p.links?.instagram && <a href={p.links.instagram} target="_blank" className="underline">IG</a>}
{p.links?.tiktok && <a href={p.links.tiktok} target="_blank" className="underline">TT</a>}
{p.links?.facebook && <a href={p.links.facebook} target="_blank" className="underline">FB</a>}
</div>
</div>
))}
</div>
);
}
