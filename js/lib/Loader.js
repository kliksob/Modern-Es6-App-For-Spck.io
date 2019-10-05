export default class Loader {
  constructor() {
    this.script = [];
    this.stylesheet = [];
  }
  addScript(path, callback) {
    this.script.push({ path, callback });
    return this;
  }
  addStylesheet(path, callback) {
    this.stylesheet.push({ path, callback });
    return this;
  }
  initialize(cb) {
    return new Promise((resolve, reject) => {
      const jsentry = [];
      if(this.script.length >= 0) {
        this.script.forEach(script => {
          jsentry.push(this.createScriptTag(script.path)
            .then(r => {
              if(typeof script.callback == "function") {
                script.callback({
                  error: false,
                  message: r
                });
              }
            })
            .catch(e => {
              script.callback({
                error: true,
                message: e
              });
            })
          );
        });
      }
      const cssentry = [];
      if(this.stylesheet.length >= 0) {
        this.stylesheet.forEach(css => {
          cssentry.push(this.createStylesheetTag(css.path)
            .then(r => {
              if(typeof css.callback == "function") {
                css.callback({
                  error: false,
                  message: r
                });
              }
            })
            .catch(e => {
              css.callback({
                error: true,
                message: e
              });
            })
          );
        });
      }
      return Promise.all([].concat(jsentry, cssentry))
        .then(resolve)
        .then(() => {
          if(typeof cb == "function") cb(this);
        });
    });
  }
  createStylesheetTag(p) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = p;
      link.onerror = function (e) {
        link.onerror = link.onload = null;
        reject(e);
      };
      
      link.onload = function () {
        link.onerror = link.onload = null;
        resolve();
      };
      
      document.getElementsByTagName('head')[0].appendChild(link);
    });
  }
  createScriptTag(p) {
    return new Promise((resolve, reject) => {
      const scripts = document.createElement("script");
      scripts.async = true;
      scripts.src = p;
      scripts.type = "text/javascript";
      scripts.charset = "utf-8";
      scripts.onload = () => {
        scripts.onerror = scripts.onload = null;
        resolve("Success loading script "+p);
      };
      scripts.onerror = e => {
        scripts.onerror = scripts.onload = null;
        reject("Got Error while loading script "+p);
      };
      document
        .getElementsByTagName('head')[0]
        .appendChild(scripts);
    });
  }
}