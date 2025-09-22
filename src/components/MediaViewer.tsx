/** @jsxImportSource react */
import React from 'react';
export default function MediaViewer({ item }: { item: { name:string; mime?:string; url?:string } }) {
if (!item) return null;
const { mime, url, name } = item;
if (mime?.startsWith('image/')) {
return <img src={url} alt={name} className="max-h-[60vh] rounded-2xl"/>;
}
// PDF/Text: als Link öffnen (später pdf.js/Markdown)
return (
<a href={url} target="_blank" className="underline text-blue-700">{name} öffnen</a>
);
}
