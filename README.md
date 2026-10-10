# Network explorer

An interactive network science playground. Plain HTML, CSS and JavaScript (ES modules). There is no build step and no dependencies.

## Structure

```
index.html            the central page: header, nav, and an empty <main id="app">
css/
  tokens.css          colours (light and dark)
  base.css            page layout
  components.css      buttons, canvas, table, form controls
js/
  main.js             entry point and hash router
  core/graph.js       the Graph class (nodes, edges, directed flag, subscribe)
  metrics/            one file per centrality, plus index.js (the registry)
  models/             random graph generators (gnp.js)
  layout/             node placement (circular.js)
  ui/                 reusable components (graphCanvas.js, metricsTable.js)
  views/              one file per page of the app (sandbox.js, random.js)
```

## Run locally

Browsers block ES modules on `file://`, so serve the folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Extending it

- **New metric:** copy `js/metrics/degree.js`, change `id`, `label` and `compute(graph)`, then import it in `js/metrics/index.js`. It appears in the tables and colour menus.
- **New random graph model:** add a file in `js/models/` that returns a `Graph`, then call it from a view.
- **New view:** add a file in `js/views/` that exports `mount(root)` and returns a cleanup function, then add one line to `routes` in `js/main.js`.
- **Force layout or charts:** import d3 as an ES module, for example `import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm"`.

## TODO

- Add display of adjacency matrix, section for graph laplacian and the spectral partitions of the graph in sandbox.
- Include more metrics, have options for how many metrics I want to see at one time in sandbox.
- Start developing a guided walkthrough for basics where we start with a graph, then show its representation, look at each metric
- Similar walkthrough for large scale graph structure, random graphs, processes on random graphs