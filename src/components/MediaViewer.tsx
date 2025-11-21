/** @jsxImportSource react */
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Item = { name: string; url: string; mime?: string };

export default function MediaViewer({ item }: { item: Item }) {
  const mime = item.mime || guessMime(item.name);

  if (mime.startsWith("image/")) {
    return (
      <figure>
        <img
          src={item.url}
          alt={item.name}
          className="max-h-[70vh] w-auto rounded-xl object-contain"
        />
        <figcaption className="text-sm text-neutral-600 mt-1">
          {item.name}
        </figcaption>
      </figure>
    );
  }

  if (mime === "text/markdown" || isMarkdown(item.name)) {
    return <MarkdownInline url={withRaw(item.url)} name={item.name} />;
  }

  if (mime === "text/plain" || isText(item.name)) {
    return <PlainTextInline url={withRaw(item.url)} name={item.name} />;
  }

  if (mime === "application/pdf" || item.name.toLowerCase().endsWith(".pdf")) {
    return (
      <div className="w-full h-[70vh]">
        <iframe
          src={item.url}
          className="w-full h-full rounded-xl"
          title={item.name}
        />
      </div>
    );
  }

  return (
    <a
      className="underline"
      href={item.url}
      target="_blank"
      rel="noreferrer"
    >
      {item.name} öffnen
    </a>
  );
}

function withRaw(url: string) {
  // erzwinge Roh-Antwort für .md/.txt (um Vite/Astro-Markdown-Transform zu umgehen)
  return url.includes("?") ? `${url}&raw=1` : `${url}?raw=1`;
}

function guessMime(name: string) {
  const ext = name.toLowerCase().split(".").pop() || "";
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    svg: "image/svg+xml",
    md: "text/markdown",
    txt: "text/plain",
    pdf: "application/pdf",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
  };
  return map[ext] || "application/octet-stream";
}
function isMarkdown(name: string) {
  return name.toLowerCase().endsWith(".md");
}
function isText(name: string) {
  return name.toLowerCase().endsWith(".txt");
}

function PlainTextInline({ url, name }: { url: string; name: string }) {
  const [text, setText] = useState<string>("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        setText(await res.text());
      } catch {
        setErr("Text konnte nicht geladen werden.");
      }
    })();
  }, [url]);

  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <figure>
      <pre className="bg-neutral-50 rounded-xl p-4 overflow-auto max-h-[60vh] whitespace-pre-wrap">
        {text}
      </pre>
      <figcaption className="text-sm text-neutral-600 mt-1">
        {name}
      </figcaption>
    </figure>
  );
}

function MarkdownInline({ url, name }: { url: string; name: string }) {
  const [md, setMd] = useState<string>("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const text = await res.text();
        setMd(text);
        setLoading(false);
      } catch {
        setErr("Markdown konnte nicht geladen werden.");
        setLoading(false);
      }
    })();
  }, [url]);

  if (err) return <div className="text-red-600">{err}</div>;
  if (loading) return <div className="text-sm text-neutral-500">Lade Inhalt…</div>;

  return (
    <figure>
      <div className="prose max-w-none">
        <ReactMarkdown>{md}</ReactMarkdown>
      </div>
      <figcaption className="text-sm text-neutral-600 mt-1">
        {name}
      </figcaption>
    </figure>
  );
}
