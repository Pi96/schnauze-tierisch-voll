let bird: HTMLAudioElement | null = null;
let clickS: HTMLAudioElement | null = null;
let jingle: HTMLAudioElement | null = null;


export function initSounds() {
if (!bird) bird = new Audio('/sounds/vogel.mp3');
if (!clickS) clickS = new Audio('/sounds/click.mp3');
if (!jingle) jingle = new Audio('/sounds/jingle.mp3');
}


export function playBirdOnce() {
try { initSounds(); bird && bird.play().catch(() => {}); } catch {}
}
export function click() {
try { initSounds(); clickS && clickS.currentTime = 0; clickS.play().catch(() => {}); } catch {}
}
export function playJingle() {
try { initSounds(); jingle && jingle.play().catch(() => {}); } catch {}
}
