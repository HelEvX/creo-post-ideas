// SOURCE: chatGPT 5 (10/11/2025) 'Vue palette shuffle setup'

// Accepts "#rrggbb", "#rgb", or "rgba(r,g,b,a)"
export function anyToRgb(input) {
  const v = input.trim();

  // rgba(...)
  if (v.startsWith("rgba(")) {
    const nums = v
      .slice(5, -1)
      .split(",")
      .map((n) => parseFloat(n.trim()));
    // ignore alpha for WCAG contrast math
    return [nums[0], nums[1], nums[2]];
  }

  // rgb(...)
  if (v.startsWith("rgb(")) {
    const nums = v
      .slice(4, -1)
      .split(",")
      .map((n) => parseFloat(n.trim()));
    return [nums[0], nums[1], nums[2]];
  }

  // fallback: hex
  return hexToRgb(v);
}

// ---------- parsing / formatting ----------
export function hexToRgb(hex) {
  const s = hex.trim().replace(/^#/, "");
  if (![3, 6].includes(s.length)) throw new Error(`Bad hex: ${hex}`);
  const n =
    s.length === 3
      ? s
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : s;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return [r, g, b];
}

export function rgbToHex([r, g, b]) {
  const to = (v) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [h, s, l];
}

export function hslToRgb([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// ---------- WCAG utilities ----------
function getLuminance(rgb) {
  const srgb = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(anyToRgb(hex1));
  const l2 = getLuminance(anyToRgb(hex2));
  const [L, S] = [Math.max(l1, l2), Math.min(l1, l2)];
  return (L + 0.05) / (S + 0.05);
}

// ---------- color math ----------
export function mix(hexA, hexB, t) {
  const a = anyToRgb(hexA);
  const b = anyToRgb(hexB);
  const m = a.map((v, i) => v + (b[i] - v) * t);
  return rgbToHex(m);
}

export function tint(hex, t) {
  // towards white
  return mix(hex, "#ffffff", t);
}
export function shade(hex, t) {
  // towards black
  return mix(hex, "#000000", t);
}
export function tone(hex, t) {
  // towards gray 50%
  return mix(hex, "#808080", t);
}

export function alphaOver(bgHex, fgHex, alpha) {
  const bg = anyToRgb(bgHex);
  const fg = anyToRgb(fgHex);
  const out = bg.map((b, i) => (1 - alpha) * b + alpha * fg[i]);
  return rgbToHex(out);
}

// ---------- scales ----------
export function grayRamp11() {
  // 0..10 inclusive
  return Array.from({ length: 11 }, (_, i) => {
    const v = Math.round((i / 10) * 255);
    return rgbToHex([v, v, v]);
  });
}

export function buildScale(hex, steps = 11, mode = "tintshade") {
  // returns array[steps] from light to dark
  if (mode === "tintshade") {
    return Array.from({ length: steps }, (_, i) => {
      const t = i / (steps - 1);
      // first half = tint to white, second half = shade to black, blend around mid
      if (t <= 0.5) return tint(hex, t * 2 * 0.9); // keep extremes usable
      return shade(hex, (t - 0.5) * 2 * 0.9);
    });
  }
  if (mode === "tones") {
    return Array.from({ length: steps }, (_, i) => tone(hex, (i / (steps - 1)) * 0.9));
  }
  return Array.from({ length: steps }, () => hex);
}

// ------------------------------------------------------------
// BUILD BRAND SCALES — 6 anchors → 11-step ramps + neutral
// ------------------------------------------------------------
export function buildBrandScales(brandTokens) {
  if (!brandTokens || typeof brandTokens !== "object") {
    console.warn("buildBrandScales called with invalid data:", brandTokens);
    return null;
  }

  const prim = {
    base: brandTokens["color-primary"] || "#888888",
    dark: brandTokens["color-primary-dark"] || "#555555",
    light: brandTokens["color-primary-light"] || "#cccccc",
  };
  const sec = {
    base: brandTokens["color-secondary"] || "#aaaaaa",
    dark: brandTokens["color-secondary-dark"] || "#777777",
    light: brandTokens["color-secondary-light"] || "#dddddd",
  };

  // Each array goes light → dark
  const primary = blendScale(prim.light, prim.dark, 11);
  const primaryLight = blendScale(prim.light, prim.base, 11);
  const primaryDark = blendScale(prim.base, prim.dark, 11);

  const secondary = blendScale(sec.light, sec.dark, 11);
  const secondaryLight = blendScale(sec.light, sec.base, 11);
  const secondaryDark = blendScale(sec.base, sec.dark, 11);

  const neutral = [
    "#ffffff",
    "#f7f7f7",
    "#e9e9e9",
    "#d9d9d9",
    "#c4c4c4",
    "#a8a8a8",
    "#8b8b8b",
    "#6f6f6f",
    "#4a4a4a",
    "#2b2b2b",
    "#121212",
  ];

  console.log("Scales ready:", {
    primary,
    primaryLight,
    primaryDark,
    secondary,
    secondaryLight,
    secondaryDark,
    neutral,
  });

  return {
    primary,
    primaryLight,
    primaryDark,
    secondary,
    secondaryLight,
    secondaryDark,
    neutral,
  };
}

// helper to build stepped blend array between two hexes
function blendScale(c1, c2, steps = 11) {
  const arr = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    arr.push(mix(c1, c2, t)); // <— uses existing mix()
  }
  return arr;
}

// ------------------------------------------------------------
// Perceptual text color helper
// ------------------------------------------------------------

export function pickPerceptualTextColor(backgroundHex, darkTextHex, lightTextHex) {
  // Fallback
  if (!backgroundHex || !darkTextHex || !lightTextHex) {
    return darkTextHex || lightTextHex || "#000000";
  }

  // Background characteristics
  const [, s, l] = rgbToHsl(anyToRgb(backgroundHex)); // ignore hue
  const isRichMidTone = s >= 0.5 && l >= 0.35 && l <= 0.7;

  const contrastDark = getContrastRatio(darkTextHex, backgroundHex);
  const contrastLight = getContrastRatio(lightTextHex, backgroundHex);

  // Default winner: best contrast
  let winner = contrastLight >= contrastDark ? lightTextHex : darkTextHex;

  // Hybrid override:
  // if both are between 3.0 and 4.5 AND bg is saturated mid-tone,
  // we force light text because that usually looks more legible.
  const darkMid = contrastDark >= 3 && contrastDark < 4.5;
  const lightMid = contrastLight >= 3 && contrastLight < 4.5;

  if (isRichMidTone && darkMid && lightMid) {
    winner = lightTextHex;
  }

  return winner;
}

// Apply a token map to :root as CSS variables: --color-foo: #xxxxxx
export function applyTokensToCSS(tokenMap) {
  const r = document.documentElement.style;
  Object.entries(tokenMap).forEach(([k, v]) => r.setProperty(`--${k}`, v));
}

export function evaluateContrastVisual(fgHex, bgHex, minAA = 4.5) {
  if (!fgHex || !bgHex) {
    return { ratio: 0, level: "fail" };
  }

  const ratio = getContrastRatio(fgHex, bgHex);

  // 1) Pure WCAG ladder first
  if (ratio >= 7) {
    return { ratio, level: "AAA" }; // zeer goed
  }
  if (ratio >= minAA) {
    return { ratio, level: "AA" }; // goed
  }
  if (ratio >= 3) {
    return { ratio, level: "AA Large" }; // redelijk
  }

  // 2) Perceptual override on near-miss mid-tone backgrounds
  const [, s, l] = rgbToHsl(anyToRgb(bgHex));

  const isRichMidTone = s >= 0.45 && l >= 0.35 && l <= 0.72;

  const white = "#ffffff";
  const black = "#000000";

  const contrastWhite = getContrastRatio(white, bgHex);
  const contrastBlack = getContrastRatio(black, bgHex);

  const best = Math.max(contrastWhite, contrastBlack);

  // If background is a rich mid-toned color and best text is near acceptable
  // treat it as a perceptual pass
  if (isRichMidTone && best >= 3.2) {
    return { ratio, level: "perceptual-pass" };
  }

  // 3) Real fail
  return { ratio, level: "fail" };
}
