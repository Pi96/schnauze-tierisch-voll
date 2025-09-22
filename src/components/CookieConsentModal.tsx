/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
export default function CookieConsentModal(){
const [open, setOpen] = useState(false);
useEffect(()=>{ if(!localStorage.getItem('stf_cookie_ok')) setOpen(true); },[]);
if(!open) return null;
return (
<div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
<div className="bg-white rounded-2xl p-5 max-w-lg w-full shadow-xl">
<h3 className="text-lg font-semibold mb-2">Cookies & Datenschutz</h3>
<p className="text-sm text-neutral-700 mb-4">Wir nutzen nur technisch notwendige Cookies. Details in der <a href="/datenschutz" className="underline">Datenschutzerklärung</a>.</p>
<div className="text-right">
<button onClick={()=>{ localStorage.setItem('stf_cookie_ok','1'); setOpen(false); }}
className="px-4 py-2 rounded-xl bg-brand-primary text-white">Akzeptieren</button>
</div>
</div>
</div>
);
}
