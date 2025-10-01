// src/lib/sound.ts
let bird: HTMLAudioElement | null = null;
let clickS: HTMLAudioElement | null = null;
let jingle: HTMLAudioElement | null = null;

// –12 dB ≈ Gain 0.25 (10^(-12/20) ≈ 0.251)
const GAIN = 0.28;

function makeSrc(path: string) {
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  return `${base.replace(/\/?$/, "/")}${path.replace(/^\//, "")}`;
}

export function initSounds(): void {
  try {
    if (!bird) {
      bird = new Audio(makeSrc("sounds/vogel.mp3"));
      bird.volume = GAIN;
    }
    if (!clickS) {
      clickS = new Audio(makeSrc("sounds/click.mp3"));
      clickS.volume = GAIN;
    }
    if (!jingle) {
      jingle = new Audio(makeSrc("sounds/jingle.mp3"));
      jingle.volume = GAIN;
    }
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
    try {
      clickS.currentTime = 0;
    } catch {}
  }
  safePlay(clickS);
}

export function playJingle(): void {
  initSounds();
  safePlay(jingle);
}
