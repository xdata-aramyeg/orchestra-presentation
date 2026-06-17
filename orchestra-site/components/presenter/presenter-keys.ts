/**
 * Keyboard-guard helpers shared by the deck and the HUD.
 *
 * The hotkeys must never fight with text entry or the backtick easter-egg
 * terminal. `isTypingTarget` mirrors the terminal's own guard (input / textarea
 * / select / contentEditable), and `isTerminalOpen` detects the terminal's
 * modal dialog so the `P` hotkey stands down while it is on screen.
 */

export function isTypingTarget(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    node.isContentEditable === true
  );
}

export function isTerminalOpen(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.querySelector('[role="dialog"][aria-modal="true"]'),
  );
}

/** True when a global hotkey should be ignored (modifiers, typing, terminal). */
export function shouldIgnoreHotkey(event: KeyboardEvent): boolean {
  if (event.metaKey || event.ctrlKey || event.altKey) return true;
  if (isTypingTarget(document.activeElement)) return true;
  if (isTerminalOpen()) return true;
  return false;
}
