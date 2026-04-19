"use strict";
const DEFAULT_PALETTE = {
    dominant: { r: 20, g: 20, b: 30 },
    vibrant: { r: 60, g: 40, b: 80 },
    dark: { r: 10, g: 10, b: 15 },
    muted: { r: 35, g: 35, b: 45 },
    brightest: { r: 80, g: 70, b: 100 },
};
const CANVAS_SIZE = 100;
const MIN_PIXEL_COUNT = 100;
const QUANTIZE_BUCKETS = 12;
const TOP_COLORS_LIMIT = 5;
const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min)
        return { h: 0, s: 0, l: l * 100 };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        default:
            h = (r - g) / d + 4;
    }
    return { h: (h / 6) * 360, s: s * 100, l: l * 100 };
};
const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    if (s === 0) {
        const v = Math.round(l * 255);
        return { r: v, g: v, b: v };
    }
    const hue2rgb = (p, q, t) => {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
};
// ─── Quantization ─────────────────────────────────────────────────────────────
const quantizeColors = (pixels, bucketCount = 16) => {
    const bucketSize = 256 / bucketCount;
    const histogram = new Map();
    for (const { r, g, b } of pixels) {
        const key = `${Math.floor(r / bucketSize)},${Math.floor(g / bucketSize)},${Math.floor(b / bucketSize)}`;
        const bin = histogram.get(key);
        if (bin) {
            const n = ++bin.count;
            bin.color.r = Math.round((bin.color.r * (n - 1) + r) / n);
            bin.color.g = Math.round((bin.color.g * (n - 1) + g) / n);
            bin.color.b = Math.round((bin.color.b * (n - 1) + b) / n);
        }
        else {
            histogram.set(key, { color: { r, g, b }, count: 1 });
        }
    }
    return Array.from(histogram.values())
        .sort((a, b) => b.count - a.count)
        .map(({ color }) => color);
};
const extractPixels = (data, width, height) => {
    const pixels = [];
    const halfWidth = Math.floor(width / 2);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < halfWidth; x++) {
            const i = (y * width + x) * 4;
            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
            if (a < 128)
                continue;
            if (r < 15 && g < 15 && b < 15)
                continue;
            if (r > 240 && g > 240 && b > 240)
                continue;
            pixels.push({ r, g, b });
        }
    }
    return pixels;
};
const findVibrant = (candidates) => {
    let vibrant = candidates[0];
    let maxSaturation = 0;
    for (const color of candidates) {
        const brightness = (color.r + color.g + color.b) / 3;
        if (brightness < 30 || brightness > 225)
            continue;
        const { s } = rgbToHsl(color.r, color.g, color.b);
        if (s > maxSaturation) {
            maxSaturation = s;
            vibrant = color;
        }
    }
    return maxSaturation < 20 && candidates.length > 1 ? candidates[1] : vibrant;
};
const findBrightest = (candidates) => candidates.reduce((best, color) => color.r + color.g + color.b > best.r + best.g + best.b ? color : best, candidates[0]);
const analyzePaletteFromBitmap = (bitmap) => {
    const canvas = new OffscreenCanvas(CANVAS_SIZE, CANVAS_SIZE);
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return DEFAULT_PALETTE;
    ctx.drawImage(bitmap, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const { data } = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const pixels = extractPixels(data, CANVAS_SIZE, CANVAS_SIZE);
    if (pixels.length < MIN_PIXEL_COUNT)
        return DEFAULT_PALETTE;
    const topColors = quantizeColors(pixels, QUANTIZE_BUCKETS);
    if (topColors.length === 0)
        return DEFAULT_PALETTE;
    const top = topColors.slice(0, TOP_COLORS_LIMIT);
    const dominant = topColors[0];
    const vibrant = findVibrant(top);
    const brightest = findBrightest(top);
    const dominantHsl = rgbToHsl(dominant.r, dominant.g, dominant.b);
    const dark = hslToRgb(dominantHsl.h, Math.min(dominantHsl.s * 1.2, 100), Math.max(dominantHsl.l * 0.15, 5));
    const muted = hslToRgb(dominantHsl.h, dominantHsl.s * 0.4, dominantHsl.l * 0.7);
    return { dominant, vibrant, dark, muted, brightest };
};
self.onmessage = ({ data: { type, imageBitmap, id } }) => {
    if (type !== 'analyze')
        return;
    try {
        const palette = analyzePaletteFromBitmap(imageBitmap);
        self.postMessage({ type: 'palette', palette, id });
    }
    catch (error) {
        console.error('Palette analysis error:', error);
        self.postMessage({ type: 'palette', palette: DEFAULT_PALETTE, id });
    }
    finally {
        imageBitmap.close();
    }
};
