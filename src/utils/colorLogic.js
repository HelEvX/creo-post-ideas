// src/utils/colorLogic.js
import { anyToRgb, getContrastRatio } from "./colorBlender.js";

/**
 * Decide whether "dark" text or "light" text should be used on a given background.
 *
 * IMPORTANT SEMANTICS (DO NOT MISREAD):
 * - return value refers to TEXT polarity, not background color
 * - "dark"  => background is light → use dark text
 * - "light" => background is dark → use light text
 *
 * This function does NOT answer:
 *   "is the background dark?"
 * It answers:
 *   "which text color is more readable on this background?"
 *
 * Uses WCAG contrast and a perceptual heuristic:
 * for mid-to-dark backgrounds, white may be preferred
 * even when contrast ratios are close.
 *
 * @param {string} bgColor   background color (hex / rgb / rgba)
 * @param {string} darkText  main dark text color (e.g. --color-text)
 * @param {string} lightText main light text color (e.g. --color-text-inverse)
 * @returns {"dark"|"light"|null}
 */

export function getTextModeForBackground(bgColor, darkText, lightText) {
  if (!bgColor || !darkText || !lightText) return null;

  const bg = bgColor.trim();
  const dark = darkText.trim();
  const light = lightText.trim();

  const cDark = getContrastRatio(dark, bg);
  const cLight = getContrastRatio(light, bg);

  // crude relative lightness (0 = black, 1 = white)
  let rel = 1;
  try {
    const [r, g, b] = anyToRgb(bg);
    rel = (r + g + b) / (255 * 3);
  } catch (e) {
    // if parsing fails, just fall back to pure contrast comparison
  }

  // Same perceptual heuristic as you had in SocialPostMockup:
  // if background is darker than ~70% AND white has "almost ok" contrast → prefer white text
  if (rel < 0.72 && cLight >= 2.2) {
    return "light";
  }

  // otherwise pick the one with higher contrast
  return cLight >= cDark ? "light" : "dark";
}

/**
 * Find the first color in availableColors that has a better contrast ratio
 * with staticColor than currentContrast.
 *
 * @param {string} colorToChange     current hex/rgb(a) color (e.g. "#ffffff")
 * @param {string} staticColor       the other color in the pair
 * @param {string[]} availableColors array of hex colors to search in
 * @param {number} currentContrast   current contrast ratio
 * @returns {string} new color (or original colorToChange if no improvement)
 */
export function findBetterContrast(colorToChange, staticColor, availableColors, currentContrast) {
  if (!availableColors || !availableColors.length || !staticColor) {
    return colorToChange;
  }

  const normalize = (c) => (c || "").trim().toLowerCase();

  const normalizedList = availableColors.map(normalize);
  const currentNorm = normalize(colorToChange);

  let startIndex = normalizedList.indexOf(currentNorm);
  if (startIndex === -1) {
    startIndex = 0;
  }

  const total = availableColors.length;

  for (let step = 1; step <= total; step++) {
    const idx = (startIndex + step) % total;
    const candidate = availableColors[idx];

    const ratio = getContrastRatio(candidate, staticColor);

    if (ratio > currentContrast) {
      return candidate;
    }
  }

  return colorToChange;
}
