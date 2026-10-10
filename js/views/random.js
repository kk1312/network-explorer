import { gnp } from '../models/gnp.js';
import { createGraphCanvas } from '../ui/graphCanvas.js';
import { metricsTable } from '../ui/metricsTable.js';
import { metrics, computeAll } from '../metrics/index.js';

export function mount(root) {
  root.innerHTML = `
    <div class="view">
      <div id="stage"></div>
      <aside>
        <label>Nodes n = <b id="nv"></b><input type="range" id="rn" min="5" max="60" step="1" value="20"></label>
        <label>Mean degree c = <b id="cv"></b><input type="range" id="rc" min="0" max="6" step="0.1" value="2"></label>
        <div class="row"><button class="btn" id="again">New sample</button>
          <label>Colour and size by <select id="by"></select></label></div>
        <div class="wrap" id="table"></div>
        <p class="note">G(n,p) with p = c/(n−1). Nodes sit on a circle for now; a force layout is a good first thing to add.</p>
      </aside>
    </div>`;

  const $ = s => root.querySelector(s);
  const by = $('#by'), table = metricsTable($('#table'));
  by.innerHTML = metrics.map(m => `<option value="${m.id}">${m.label}</option>`).join('');
  let canvas = null;

  function draw() {
    const n = +$('#rn').value, c = +$('#rc').value;
    $('#nv').textContent = n; $('#cv').textContent = c.toFixed(1);
    canvas?.destroy();
    const g = gnp(n, c / (n - 1));
    canvas = createGraphCanvas($('#stage'), g);
    const res = computeAll(g);
    canvas.setValues(res[by.value]);
    table.update(res, g.n);
  }

  $('#rn').oninput = $('#rc').oninput = $('#again').onclick = by.onchange = draw;
  draw();

  return () => canvas?.destroy();
}
