export default [
  /**
   * Bundling cli application
   * Producing a node executable bundle only: CJS
   */
  {
    input: ["src/cli.js"],
    output: [
      {
        file: "dist/cli.cjs.js",
        format: "cjs",
      },
    ],
  },
  /**
   * Bundling lib
   * Producing all types of modules as the lib might be used in NodeJS
   * as in a browser (= using ESModules, or RequireJS, or IIFE)
   */
  {
    input: ["src/lib.js"],
    output: [
      {
        file: "dist/lib.cjs.js",
        format: "cjs",
      },
      {
        file: "dist/lib.esm.js",
        format: "esm",
      },
      {
        file: "dist/lib.amd.js",
        format: "amd",
      },
      {
        file: "dist/lib.umd.js",
        format: "umd",
        name: "kinda-useless-math-lib",
      },
    ],
  },
  /**
   * Bundling webapp
   * Producing only bundles usable in browsers: IIFE or ESModule
   */
  {
    input: ["src/web.js"],
    output: [
      {
        file: "dist/web.esm.js",
        format: "esm",
      },
      {
        file: "dist/web.iife.js",
        format: "iife",
      },
    ],
  },
];
