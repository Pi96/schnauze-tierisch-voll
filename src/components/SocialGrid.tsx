/** @jsxImportSource react */
import React from 'react';
import socials from '../data/socials.json';
export default function SocialGrid() {
return (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
{socials.map(s => (
<a key={s.id} href={s.url} target="_blank" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow hover:shadow-md">
<img src={`/images/icons/${s.icon}.svg`} alt="" className="w-6 h-6"/>
<span className="font-medium">{s.label}</span>
</a>
))}
</div>
);
}
