// Accepts "#rrggbb", "#rgb", "rgb(r,g,b)", or "rgba(r,g,b,a)"
// Returns [r,g,b,a] where a is 0..1
export function anyToRgb(input) {
  const v = String(input || "").trim();

  if (v.startsWith("rgba(")) {
    const nums = v
      .slice(5, -1)
      .split(",")
      .map((n) => parseFloat(n.trim()));
    return [nums[0], nums[1], nums[2], Number.isFinite(nums[3]) ? nums[3] : 1];
  }

  if (v.startsWith("rgb(")) {
    const nums = v
      .slice(4, -1)
      .split(",")
      .map((n) => parseFloat(n.trim()));
    return [nums[0], nums[1], nums[2], 1];
  }

  return hexToRgb(v);
}

// ---------- parsing / formatting ----------
export function hexToRgb(hex) {
  const s = String(hex || "")
    .trim()
    .replace(/^#/, "");
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
  return [r, g, b, 1];
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
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
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
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
  } else if (120 <= h && h < 180) {
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// ---------- WCAG utilities ----------
function getLuminance(rgba) {
  const srgb = [rgba[0], rgba[1], rgba[2]].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function compositeOver(bgRGBA, fgRGBA) {
  const a = Math.max(0, Math.min(1, fgRGBA[3] ?? 1));
  return [
    (1 - a) * bgRGBA[0] + a * fgRGBA[0],
    (1 - a) * bgRGBA[1] + a * fgRGBA[1],
    (1 - a) * bgRGBA[2] + a * fgRGBA[2],
    1,
  ];
}

export function getContrastRatio(fg, bg) {
  const fgRGBA = anyToRgb(fg);
  const bgRGBA = anyToRgb(bg);
  const fgVis = (fgRGBA[3] ?? 1) < 1 ? compositeOver(bgRGBA, fgRGBA) : fgRGBA;

  const l1 = getLuminance(fgVis);
  const l2 = getLuminance(bgRGBA);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ---------- scales ----------
export function grayRamp11() {
  return [
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
}

// ---------- perceptual anchor scale (lightness + asymmetric saturation) ----------
function buildAnchorScale(hex, steps = 11, whiteCapL = 0.97, blackCapL = 0.03) {
  const [h, s0, l0] = rgbToHsl(anyToRgb(hex));

  return Array.from({ length: steps }, (_, i) => {
    if (i === 5) return hex;

    const t = Math.abs(i - 5) / 5;

    if (i < 5) {
      // lighter side: preserve saturation for light anchors
      const l = l0 + (whiteCapL - l0) * t;
      const satLoss = l0 > 0.55 ? 0.05 * t : 0.15 * t;
      const s = Math.max(0, Math.min(1, s0 * (1 - satLoss)));
      return rgbToHex(hslToRgb([h, s, l]));
    }

    // darker side: limit oversaturation for dark anchors
    const l = l0 - (l0 - blackCapL) * t;
    const satGain = l0 < 0.45 ? 0.05 * t : 0.2 * t;
    const s = Math.max(0, Math.min(1, s0 * (1 + satGain)));
    return rgbToHex(hslToRgb([h, s, l]));
  });
}

// ------------------------------------------------------------
// BUILD BRAND SCALES — anchor-centered 0–10 ramps + neutral
// ------------------------------------------------------------
export function buildBrandScales(brandTokens) {
  if (!brandTokens) return null;

  const safe = (v, fallback) => v || fallback;

  const primaryBase = safe(brandTokens["color-primary"], "#888888");
  const secondaryBase = safe(brandTokens["color-secondary"], "#888888");

  const neutral = grayRamp11();

  return {
    primary: buildAnchorScale(primaryBase),
    primaryDark: buildAnchorScale(safe(brandTokens["color-primary-dark"], primaryBase)),
    primaryLight: buildAnchorScale(safe(brandTokens["color-primary-light"], primaryBase)),

    secondary: buildAnchorScale(secondaryBase),
    secondaryDark: buildAnchorScale(safe(brandTokens["color-secondary-dark"], secondaryBase)),
    secondaryLight: buildAnchorScale(safe(brandTokens["color-secondary-light"], secondaryBase)),

    tertiary: buildAnchorScale(
      safe(brandTokens["color-tertiary"], safe(brandTokens["color-secondary-dark"], secondaryBase))
    ),

    neutral,
  };
}

export function evaluateContrastVisual(fgHex, bgHex, targetAA = 4.5) {
  if (!fgHex || !bgHex) {
    return { ratio: 0, level: "fail", perceptual: false, score: 0 };
  }

  const ratio = getContrastRatio(fgHex, bgHex);

  const [, sBg] = rgbToHsl(anyToRgb(bgHex));
  const [, , lFg] = rgbToHsl(anyToRgb(fgHex));

  const isExtremeText = lFg <= 0.08 || lFg >= 0.92;
  const isBrandBg = sBg >= 0.35;

  let score = ratio;

  if (isExtremeText && isBrandBg) {
    score = Math.max(score, 3.0);
  }

  if (ratio >= 7.0) {
    return { ratio, level: "AAA", perceptual: false, score };
  }

  if (ratio >= targetAA) {
    return { ratio, level: "AA", perceptual: false, score };
  }

  if (score >= targetAA) {
    return { ratio, level: "perceptual-pass", perceptual: true, score };
  }

  if (ratio >= 3.0) {
    return { ratio, level: "AA Large", perceptual: false, score };
  }

  if (score >= 3.0) {
    return { ratio, level: "AA Large", perceptual: true, score };
  }

  return { ratio, level: "fail", perceptual: false, score };
}
