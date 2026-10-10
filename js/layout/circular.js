// Place n nodes evenly on a circle. A force layout can live beside this later.
export function circular(n, cx = 300, cy = 220, r = 180) {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}
