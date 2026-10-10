// The one data structure everything else builds on.
// Nodes are indexed 0..n-1. Edges are [from, to] pairs (unordered if undirected).
export class Graph {
  constructor({ directed = false } = {}) {
    this.directed = directed;
    this.nodes = [];            // { x, y } positions, used only for drawing
    this.edges = [];            // [from, to]
    this.listeners = new Set();
  }

  static from(nodes, edges, opts) {
    const g = new Graph(opts);
    g.nodes = nodes;
    g.edges = edges;
    return g;
  }

  get n() { return this.nodes.length; }

  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit() { this.listeners.forEach(fn => fn(this)); }

  hasEdge(a, b) {
    return this.edges.some(([u, v]) => (u === a && v === b) || (!this.directed && u === b && v === a));
  }

  addNode(x = 0, y = 0) { this.nodes.push({ x, y }); this.emit(); return this.n - 1; }

  addEdge(a, b) {
    if (a === b || this.hasEdge(a, b)) return false;
    this.edges.push([a, b]); this.emit(); return true;
  }

  removeNode(i) {
    this.nodes.splice(i, 1);
    this.edges = this.edges
      .filter(([a, b]) => a !== i && b !== i)
      .map(([a, b]) => [a > i ? a - 1 : a, b > i ? b - 1 : b]);
    this.emit();
  }

  removeEdge(k) { this.edges.splice(k, 1); this.emit(); }

  clear() { this.nodes = []; this.edges = []; this.emit(); }

  setDirected(flag) {
    this.directed = flag;
    if (!flag) {                // drop reverse duplicates when going undirected
      const seen = new Set();
      this.edges = this.edges.filter(([a, b]) => {
        const k = Math.min(a, b) + ',' + Math.max(a, b);
        return seen.has(k) ? false : (seen.add(k), true);
      });
    }
    this.emit();
  }

  // out[i]: nodes reachable from i. into[i]: nodes that point to i.
  // For undirected graphs both lists are the neighbour lists.
  adjacency() {
    const out = this.nodes.map(() => []), into = this.nodes.map(() => []);
    for (const [a, b] of this.edges) {
      out[a].push(b); into[b].push(a);
      if (!this.directed) { out[b].push(a); into[a].push(b); }
    }
    return { out, into };
  }
}