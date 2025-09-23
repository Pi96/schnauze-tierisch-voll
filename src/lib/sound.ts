let bird: HTMLAudioElement | null = null;
let clickS: HTMLAudioElement | null = null;
let jingle: HTMLAudioElement | null = null;

function makeSrc(path: string) {
  // Falls dein Projekt ein BASE_URL hat (Astro), werden die Audios korrekt referenziert.
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  return `${base.replace(/\/?$/, "/")}${path.replace(/^\//, "")}`;
}

export function initSounds(): void {
  try {
    if (!bird) bird = new Audio(makeSrc("sounds/vogel.mp3"));
    if (!clickS) clickS = new Audio(makeSrc("sounds/click.mp3"));
    if (!jingle) jingle = new Audio(makeSrc("sounds/jingle.mp3"));
  } catch {
    // noop
  }
}

function safePlay(a: HTMLAudioElement | null): void {
  if (!a) return;
  try {
    const p = a.play();
    if (p && typeof (p as Promise<void>).catch === "function") {
      (p as Promise<void>).catch(() => {});
    }
  } catch {
    // noop
  }
}

export function playBirdOnce(): void {
  initSounds();
  safePlay(bird);
}

export function click(): void {
  initSounds();
  if (clickS) {
    // Wichtig: Klammern oder separates if, sonst "Invalid assignment target"
    try {
      clickS.currentTime = 0;
    } catch {
      // Einige Browser erlauben currentTime erst nach Metadata-Load
    }
  }
  safePlay(clickS);
}

export function playJingle(): void {
  initSounds();
  safePlay(jingle);
}
