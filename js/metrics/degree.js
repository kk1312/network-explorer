// Metric contract: { id, label, compute(graph) -> number[] } with one value per node.
export default {
  id: 'degree',
  label: 'Degree',               // in-degree when the graph is directed
  compute(g) { return g.adjacency().into.map(a => a.length); },
};
