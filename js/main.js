// Entry point: a tiny hash router. Add a view by importing it and adding one line to `routes`.
import * as sandbox from './views/sandbox.js';
import * as random from './views/random.js';

const routes = {
  sandbox: { label: 'Build a network', view: sandbox },
  random:  { label: 'Random graphs',   view: random },
};

const app = document.getElementById('app');
const nav = document.getElementById('nav');
let cleanup = null;

nav.innerHTML = Object.entries(routes)
  .map(([id, r]) => `<a href="#${id}" data-id="${id}">${r.label}</a>`).join('');

function go() {
  const hash = location.hash.slice(1);
  const id = hash in routes ? hash : 'sandbox';
  cleanup?.();                       // let the previous view tidy up
  app.innerHTML = '';
  cleanup = routes[id].view.mount(app);
  nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.id === id));
}

addEventListener('hashchange', go);
go();
