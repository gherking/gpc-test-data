> **IMPORTANT** This is a placeholder version of the package, please wait until **v1.0.0** is released.

# gpc-test-data

![Downloads](https://img.shields.io/npm/dw/gpc-test-data?style=flat-square) ![Version@npm](https://img.shields.io/npm/v/gpc-test-data?label=version%40npm&style=flat-square) ![Version@git](https://img.shields.io/github/package-json/v/gherking/gpc-test-data/master?label=version%40git&style=flat-square) ![CI](https://img.shields.io/github/workflow/status/gherking/gpc-test-data/CI/master?label=ci&style=flat-square) ![Docs](https://img.shields.io/github/workflow/status/gherking/gpc-test-data/Docs/master?label=docs&style=flat-square)

This repository is a template to create precompilers for GherKing.

## Usage

```javascript
'use strict';
const compiler = require('gherking');
const { default: Template } = require('gpc-test-data');

let ast = await compiler.load('./features/src/login.feature');
ast = compiler.process(
  ast,
  new Template({
    // config
  })
);
await compiler.save('./features/dist/login.feature', ast, {
  lineBreak: '\r\n'
});
```

```typescript
'use strict';
import {load, process, save} from "gherking";
import Template from "gpc-test-data";

let ast = await load("./features/src/login.feature");
ast = process(
  ast,
  new Template({
    // config
  })
);
await save('./features/dist/login.feature', ast, {
  lineBreak: '\r\n'
});
```

## Other

This package uses [debug](https://www.npmjs.com/package/debug) for logging, use `gpc:test-data` :

```shell
DEBUG=gpc:test-data* gherking ...
```

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gpc-test-data/).