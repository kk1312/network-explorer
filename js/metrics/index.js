// Metric registry. To add a metric: create a file with the same shape as degree.js,
// import it here, and add it to the list. The UI picks it up automatically.
import degree from './degree.js';
import eigenvector from './eigenvector.js';

export const metrics = [degree, eigenvector];

export const computeAll = g =>
  Object.fromEntries(metrics.map(m => [m.id, m.compute(g)]));
