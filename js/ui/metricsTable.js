// A table with one row per node and one column per registered metric.
import { metrics } from '../metrics/index.js';

export function metricsTable(container) {
  const table = document.createElement('table');
  container.append(table);
  const fmt = v => (Number.isInteger(v) ? v : v.toFixed(3));

  return {
    update(results, n) {
      if (!n) { table.innerHTML = '<tr><td>Nothing to show yet.</td></tr>'; return; }
      const head = '<tr><th>Node</th>' + metrics.map(m => `<th>${m.label}</th>`).join('') + '</tr>';
      const rows = Array.from({ length: n }, (_, i) =>
        `<tr><td>${i + 1}</td>` + metrics.map(m => `<td>${fmt(results[m.id][i])}</td>`).join('') + '</tr>').join('');
      table.innerHTML = head + rows;
    },
  };
}
