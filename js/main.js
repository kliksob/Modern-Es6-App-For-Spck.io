import Loader from "./lib/Loader.js";
import routes from "./routes.js";
import Layout from "./Layout.js";

const pages = {};
Object.keys(routes).forEach(route => {
  pages[route] = {
    onmatch(attrs, path) {
      return routes[route].onmatch
        ? routes[route].onmatch(attrs, path)
        : routes[route];
    },
    render(vnode) {
      return m(Layout, vnode.attrs, vnode);
    }
  };
});
function bootRoutes() {
  m.route(document.querySelector("body > #app"), "/", pages);
}

export default function init() {
  const loader = new Loader();
  loader.addScript("./lib/vconsole.min.js", (e) => {
    window.vConsole = new VConsole();
    //console.log(e.message);
  });
  loader.addScript("./lib/mithril.min.js");
  loader.addScript("./lib/domq.min.js");
  loader.addStylesheet("./lib/spectre-icons.min.css");
  loader.addStylesheet("./lib/spectre.min.css");
  loader.initialize((r) => {
    // All script has done load
    // Boot your app here
  }).then(bootRoutes);
}