import convert from 'color-convert';

export function generatePalette(hex, step = 10) {
  const [h, s, l] = convert.hex.hsl(hex);
  const palette = [];

  for (let lightness = 0; lightness <= 100; lightness += step) {
    palette.push([h, s, lightness]);
  }

  return palette;
}
