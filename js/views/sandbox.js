// View contract: export mount(root) and return a cleanup function.
import { Graph } from '../core/graph.js';
import { createGraphCanvas } from '../ui/graphCanvas.js';
import { metricsTable } from '../ui/metricsTable.js';
import { metrics, computeAll } from '../metrics/index.js';

export function mount(root) {
  root.innerHTML = `
    <div class="view">
      <div id="stage"></div>
      <aside>
        <div class="row">
          <label>Colour and size by <select id="by"></select></label>
          <label><input type="checkbox" id="dir"> Directed</label>
          <button class="btn" id="clear">Clear</button>
        </div>
        <div class="wrap" id="table"></div>
        <p class="note">Click empty space to add a node. Click two nodes in turn to connect them. Double-click a node to delete it.</p>
      </aside>
    </div>`;

  const $ = s => root.querySelector(s);
  const g = Graph.from(
    [[300,200],[200,120],[200,290],[400,200],[500,120],[560,250],[460,320]].map(([x, y]) => ({ x, y })),
    [[0,1],[0,2],[0,3],[1,2],[3,4],[4,5],[4,6],[5,6]]
  );

  const canvas = createGraphCanvas($('#stage'), g, { editable: true });
  const table = metricsTable($('#table'));
  const by = $('#by');
  by.innerHTML = metrics.map(m => `<option value="${m.id}">${m.label}</option>`).join('');

  const update = () => {
    const res = computeAll(g);
    canvas.setValues(g.n ? res[by.value] : null);
    table.update(res, g.n);
  };

  g.subscribe(update);          // subscribed after the canvas, so it redraws first
  by.onchange = update;
  $('#dir').onchange = e => g.setDirected(e.target.checked);
  $('#clear').onclick = () => g.clear();
  update();

  return () => canvas.destroy();
}
