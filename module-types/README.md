# JavaScript Modules

In JS, a module is a file containing pieces of code that aim to be imported and used from other modules.

## CJS (CommonJS)

```js
const { foo } = require("./foo");

function bar() {
  foo();
}

exports.bar = bar;
```

- Module format used by NodeJS
- Does not work natively in web browsers
- Relies on synchronous imports (not statically analyzed)
- Mostly used for NodeJS executables and libraries

## ESM (ES Module)

```js
import { foo } from "./foo";

export function bar() {
  foo();
}
```

- **Standard** module format
- Works natively in most modern browsers through `<script type="module">`
- Statically analyzed and thus three-shakeable
- Mostly used for libraries (=re-used and re-bundled) and webapps

## AMD (Asynchronous module definition)

```js
define(["my-module"], function (fooModule) {
  function bar() {
    fooModule.foo();
  }

  return { bar };
});
```

- Module format used by RequireJS
- Relies on synchronous imports (not statically analyzed)
- Mostly used for RequireJS use, and thus targets NodeJS and browsers

## UMD (Universal module definition)

```js
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? // CommonJS
      factory(exports)
    : typeof define === "function" && define.amd
    ? // AMD
      define(["exports"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      // Browser's global object
      factory((global["my-module"] = {})));
})(this, function (exports, foo) {
  "use strict";
  function bar() {
    foo();
  }

  exports.bar = bar;
});
```

- Module format that tries to identify the module system it runs in at runtime
- Basically a mix between CJS, AMD and runtime's (whatever it is) global object
- Works in NodeJS (because CJS) and in browsers through `<script src="my-module.umd.js">`
- Mostly used for CDN distributed builds (mostly libs)

## IIFE (Immediately Invoked Function Expression - Not really a "module")

```js
(function () {
  function foo() {
    console.log("🎁");
  }

  function bar() {
    foo();
  }
})();
```

- Not really a module format: function immediately invoked as it is declared
- Works on every runtime (~depending on the code) as it has no dependencies
- Mostly used for final products = webapps and executables, not for libs

---

## What to use ?

Basically:

- Writing a webapp ?
  - --> write **ES Module**
  - if used through type=module scripts --> do not bundle
  - if bundled before use --> bundle to **IIFE**
- Writing server-side code / executable / CLI ?
  - if bundled before use --> write **ES Module**, bundle to **IIFE** (or sometimes **CommonJS**)
  - if not bundled before use --> write **CommonJS**
- Writing a lib (= code that aims to be reused) ?
  - --> write **ES Module**
  - --> (may depend on the lib you're writing) bundle to **ES Module** AND **UMD** AND **CommonJS**. .
