// Poisson (Erdos-Renyi) random graph G(n, p): each pair is linked with probability p.
import { Graph } from '../core/graph.js';
import { circular } from '../layout/circular.js';

export function gnp(n, p) {
  const edges = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (Math.random() < p) edges.push([i, j]);
  return Graph.from(circular(n), edges);
}
