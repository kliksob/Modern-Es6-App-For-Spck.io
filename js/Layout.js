export default {
  view(v) {
    return [
      m("header.navbar", [
      ]),
      m("main.content", v.children)
    ];
  }
};