// Reusable SVG drawing of a Graph. Pass `editable: true` to let people edit it:
// click empty space = add node, click two nodes in turn = add edge, double-click a node = delete it.
// Call setValues(array) to size and shade nodes by a metric.
const R = (v, max) => 8 + 10 * (max > 0 ? v / max : 0);

export function createGraphCanvas(container, graph, { editable = false } = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 600 440');
  svg.classList.add('canvas');
  container.append(svg);

  let values = null, selected = null;

  function render() {
    const max = values ? Math.max(...values, 1e-9) : 0;
    const r = i => (values && values[i] !== undefined ? R(values[i], max) : 12);
    const shade = i => (values && values[i] !== undefined ? 0.3 + 0.7 * values[i] / max : 0.7);
    const d = graph.directed;
    let h = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--dim)"/></marker></defs>';
    for (const [a, b] of graph.edges) {
      const A = graph.nodes[a], B = graph.nodes[b];
      const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, rb = r(b) + (d ? 3 : 0);
      h += `<line class="ed" x1="${A.x}" y1="${A.y}" x2="${B.x - dx / L * rb}" y2="${B.y - dy / L * rb}" ${d ? 'marker-end="url(#ah)"' : ''}/>`;
    }
    graph.nodes.forEach((p, i) => {
      h += `<g data-i="${i}"><circle class="nd${selected === i ? ' sel' : ''}" cx="${p.x}" cy="${p.y}" r="${r(i)}" fill-opacity="${shade(i)}"/><text x="${p.x}" y="${p.y - r(i) - 5}">${i + 1}</text></g>`;
    });
    svg.innerHTML = h;
  }

  function toSvgPoint(e) {
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }

  if (editable) {
    svg.addEventListener('click', e => {
      const g = e.target.closest('[data-i]');
      if (!g) { selected = null; const p = toSvgPoint(e); graph.addNode(p.x, p.y); return; }
      const i = +g.dataset.i;
      if (selected === null) selected = i;
      else { if (selected !== i) graph.addEdge(selected, i); selected = null; }
      render();
    });
    svg.addEventListener('dblclick', e => {
      const g = e.target.closest('[data-i]');
      if (g) { selected = null; graph.removeNode(+g.dataset.i); }
    });
  }

  const unsubscribe = graph.subscribe(render);
  render();

  return {
    setValues(v) { values = v; render(); },
    render,
    destroy() { unsubscribe(); svg.remove(); },
  };
}
