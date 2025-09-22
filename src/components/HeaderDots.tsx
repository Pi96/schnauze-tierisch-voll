/** @jsxImportSource react */
import React from 'react';
import { click, playJingle } from '../lib/sound';


type Props = { onOpen: () => void };
export default function HeaderDots({ onOpen }: Props) {
return (
<button aria-label="Menü öffnen" onClick={() => { click(); onOpen(); }}
className="p-3 rounded-xl bg-white/80 hover:bg-white shadow">
<span className="block w-1.5 h-1.5 bg-neutral-900 rounded-full mb-0.5"></span>
<span className="block w-1.5 h-1.5 bg-neutral-900 rounded-full mb-0.5"></span>
<span className="block w-1.5 h-1.5 bg-neutral-900 rounded-full"></span>
</button>
);
}
