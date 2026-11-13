/**
 * Preloader → hero hand-off. The hero registers its paused entrance
 * timeline; the preloader starts it as its panels open. Either side may
 * arrive first. A timeline rebuilt after the intro (e.g. language switch)
 * jumps straight to its end state.
 */

interface Playable {
  play: () => unknown;
  progress: (value: number) => unknown;
}

type Phase = "waiting" | "playing" | "done";

let phase: Phase = "waiting";
let timeline: Playable | null = null;
const listeners = new Set<(phase: Phase) => void>();

function setPhase(next: Phase) {
  phase = next;
  listeners.forEach((listener) => listener(next));
}

export function registerHeroIntro(next: Playable): () => void {
  timeline = next;
  if (phase === "done") next.progress(1);
  else if (phase === "playing") next.play();
  return () => {
    if (timeline === next) timeline = null;
  };
}

/** Called by the preloader as it opens. */
export function startHeroIntro(): void {
  if (phase !== "waiting") return;
  setPhase("playing");
  timeline?.play();
}

/** Called when the hero entrance completes, or to skip it entirely. */
export function finishHeroIntro(skip = false): void {
  if (skip) timeline?.progress(1);
  if (phase !== "done") setPhase("done");
}

export function getIntroPhase(): Phase {
  return phase;
}

export function onIntroPhase(listener: (phase: Phase) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
