// Reusable SVG drawing of a Graph.
// With editable: true, in the default "edit" mode:
//   click empty space ............ add a node
//   click a node, then another ... add an edge
//   press and drag a node ........ move it
// In "delete" mode (see setMode), click a node or an edge to remove it.
// Call setValues(array) to size and shade nodes by a metric.
const R = (v, max) => 8 + 10 * (max > 0 ? v / max : 0);
const DRAG_PX = 4;                       // movement below this is a click, not a drag
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function createGraphCanvas(container, graph, { editable = false } = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 600 440');
  svg.classList.add('canvas');
  svg.dataset.mode = 'edit';
  container.append(svg);

  let values = null, selected = null, mode = 'edit', down = null;

  function render() {
    const max = values ? Math.max(...values, 1e-9) : 0;
    const r = i => (values && values[i] !== undefined ? R(values[i], max) : 12);
    const shade = i => (values && values[i] !== undefined ? 0.3 + 0.7 * values[i] / max : 0.7);
    const d = graph.directed;
    let h = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--dim)"/></marker></defs>';
    graph.edges.forEach(([a, b], k) => {
      const A = graph.nodes[a], B = graph.nodes[b];
      const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, rb = r(b) + (d ? 3 : 0);
      const geo = `x1="${A.x}" y1="${A.y}" x2="${B.x - dx / L * rb}" y2="${B.y - dy / L * rb}"`;
      if (editable) h += `<line class="hit" data-e="${k}" ${geo}/>`;     // wide invisible target
      h += `<line class="ed" ${geo} ${d ? 'marker-end="url(#ah)"' : ''}/>`;
    });
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
    svg.addEventListener('pointerdown', e => {
      const g = e.target.closest('[data-i]'), ed = e.target.dataset.e;
      down = { i: g ? +g.dataset.i : null, ed: ed === undefined ? null : +ed, x: e.clientX, y: e.clientY, moved: false };
      svg.setPointerCapture(e.pointerId);    // keep receiving events while the DOM is redrawn
    });

    svg.addEventListener('pointermove', e => {
      if (!down) return;
      if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) < DRAG_PX) return;
      down.moved = true;
      if (mode === 'edit' && down.i !== null) {
        const p = toSvgPoint(e), node = graph.nodes[down.i];
        node.x = clamp(p.x, 12, 588); node.y = clamp(p.y, 12, 428);   // positions don't affect structure, so no emit
        render();
      }
    });

    svg.addEventListener('pointerup', e => {
      const d = down; down = null;
      if (!d || d.moved) return;             // a drag is not a click
      if (mode === 'delete') {
        selected = null;
        if (d.i !== null) graph.removeNode(d.i);
        else if (d.ed !== null) graph.removeEdge(d.ed);
        return;
      }
      if (d.i === null) {                    // empty space (clicks on an edge do nothing)
        if (d.ed === null) { selected = null; const p = toSvgPoint(e); graph.addNode(p.x, p.y); }
        return;
      }
      if (selected === null) selected = d.i;
      else { if (selected !== d.i) graph.addEdge(selected, d.i); selected = null; }
      render();
    });

    svg.addEventListener('pointercancel', () => { down = null; });
  }

  const unsubscribe = graph.subscribe(render);
  render();

  return {
    setValues(v) { values = v; render(); },
    setMode(m) { mode = m; selected = null; svg.dataset.mode = m; render(); },   // 'edit' or 'delete'
    render,
    destroy() { unsubscribe(); svg.remove(); },
  };
}