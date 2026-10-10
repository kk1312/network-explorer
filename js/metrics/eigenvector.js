// Power iteration on (A + I), which has the same leading eigenvector as A
// but avoids oscillation on bipartite graphs. Scaled so the largest value is 1.
export default {
  id: 'eigenvector',
  label: 'Eigenvector',
  compute(g) {
    const { into } = g.adjacency();
    let x = Array(g.n).fill(1);
    for (let t = 0; t < 300; t++) {
      const y = x.map((v, k) => v + into[k].reduce((s, j) => s + x[j], 0));
      const m = Math.max(...y) || 1;
      x = y.map(v => v / m);
    }
    return x;
  },
};
