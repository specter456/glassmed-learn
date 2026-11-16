/**
 * User-input hardening helpers.
 *
 * React escapes everything it renders, so the goal here is not HTML encoding —
 * it is keeping malformed/oversized text out of forms and API payloads
 * (terminal escape sequences, NUL bytes, paste bombs, etc.).
 */

/**
 * Drops control characters (C0 + DEL) from a string, keeping tab/newline/
 * carriage return so multi-line input still works. Optionally caps the result
 * at `maxLength` characters.
 *
 * Implemented with code-point checks rather than a control-character regex so
 * the intent is explicit and the lint rule against control regexes stays on.
 */
export function stripControlChars(value: string, maxLength = Infinity): string {
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const isControl = code < 32 || code === 127;
    const isAllowedWhitespace = code === 9 || code === 10 || code === 13;
    if (isControl && !isAllowedWhitespace) continue;
    out += char;
    if (out.length >= maxLength) break;
  }
  return out;
}
