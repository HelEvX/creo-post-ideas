// SOURCE: chatGPT 5 (10/11/2025) 'Vue palette shuffle setup'

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
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const [L, S] = [Math.max(l1, l2), Math.min(l1, l2)];
  return (L + 0.05) / (S + 0.05);
}

// ---------- color math ----------
export function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA),
    b = hexToRgb(hexB);
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
  const bg = hexToRgb(bgHex),
    fg = hexToRgb(fgHex);
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

// Build per-brand swatch book from the six base colors and a neutral ramp
export function buildBrandScales(brandTokens) {
  // expected keys present in brand JSON (base/dark/light for primary/secondary)
  // color-primary, color-primary-dark, color-primary-light, color-secondary, color-secondary-dark, color-secondary-light
  const prim = {
    base: brandTokens["color-primary"],
    dark: brandTokens["color-primary-dark"],
    light: brandTokens["color-primary-light"],
  };
  const sec = {
    base: brandTokens["color-secondary"],
    dark: brandTokens["color-secondary-dark"],
    light: brandTokens["color-secondary-light"],
  };

  const neutrals = grayRamp11(); // #000..#fff fixed

  // for each of the 6 anchors, generate 11-step tint/shade scales
  const scales = {
    primary: buildScale(prim.base, 11, "tintshade"),
    primaryDark: buildScale(prim.dark, 11, "tintshade"),
    primaryLight: buildScale(prim.light, 11, "tintshade"),
    secondary: buildScale(sec.base, 11, "tintshade"),
    secondaryDark: buildScale(sec.dark, 11, "tintshade"),
    secondaryLight: buildScale(sec.light, 11, "tintshade"),
    neutral: neutrals,
  };

  return scales;
}

// Apply a token map to :root as CSS variables: --color-foo: #xxxxxx
export function applyTokensToCSS(tokenMap) {
  const r = document.documentElement.style;
  Object.entries(tokenMap).forEach(([k, v]) => r.setProperty(`--${k}`, v));
}
