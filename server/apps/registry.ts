const appLoaders = [
  () => import("./notebook/index.js"),
  () => import("./finance/index.js"),
  () => import("./ghtrending/index.js"),
  () => import("./createapp/index.js"),
  () => import("./notes/index.js"),
  () => import("./claude-code/index.js"),
  () => import("./codex/index.js")
];
export {
  appLoaders
};
