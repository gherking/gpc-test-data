# gpc-test-data

![Downloads](https://img.shields.io/npm/dw/gpc-test-data?style=flat-square) ![Version@npm](https://img.shields.io/npm/v/gpc-test-data?label=version%40npm&style=flat-square) ![Version@git](https://img.shields.io/github/package-json/v/gherking/gpc-test-data/master?label=version%40git&style=flat-square) ![CI](https://img.shields.io/github/actions/workflow/status/gherking/gpc-test-data/ci.yml?branch=master&label=ci&style=flat-square) ![Docs](https://img.shields.io/github/actions/workflow/status/gherking/gpc-test-data/docs.yml?branch=master&label=docs&style=flat-square)

This precompiler can load external data (JSON, CSV, or XLS/XLSX) into the examples table.

## Usage

```javascript
'use strict';
const compiler = require('gherking');
const { default: TestData } = require('gpc-test-data');

let ast = await compiler.load('./features/src/login.feature');
ast = await compiler.process(
  ast,
  new TestData({
    defaultValue: "-"
  })
);
await compiler.save('./features/dist/login.feature', ast, {
  lineBreak: '\r\n'
});
```

```typescript
'use strict';
import {load, process, save} from "gherking";
import TestData from "gpc-test-data";

let ast = await load("./features/src/login.feature");
ast = await process(
  ast,
  new TestData({
    defaultValue: "-"
  })
);
await save('./features/dist/login.feature', ast, {
  lineBreak: '\r\n'
});
```

## Tags

In the feature file, for each Examples, one of the following tags can be set:

* `@load_json(path)` to load the data from a JSON file
* `@load_csv(path)` to load the data from a CSV file
* `@load_xls(path)` to load the data from an XLS/XLSX file, from the first sheet
* `@load_xls(path,sheet)` to load the data from an XLS/XLSX file, from the given sheet
* `@load_http(url)` to load the data from an HTTP source (a JSON response of an object array)

For each tag, the path must be either a relative (from `cwd`) or an absolute path to the file, including the file name and extension.

## Formats

There are some restrictions on the various data formats:

* For JSON, the content of the JSON file should be an array of objects, where the key of the object properties will be mapped to the examples columns.
* For CSV and XLS/XLSX, the first non-empty row must contain the header/column names, which will be mapped to the examples columns.
* For CSV, the [csv-parse](https://www.npmjs.com/package/csv-parse) tool is used to parse the CSV files, see its documentation for the particular specialties of its parsing and requirements for a CSV file (for parsing, an adaptive configuration is set - columns, skipping empty lines, trimming, auto-BOM, auto-delimiter).
* For XLS/XLSX, the [xlsx](https://www.npmjs.com/package/xlsx) tool is used to parse the XLS/XLSX files, see its documentation for the particular specialties of its parsing and requirements for an XLS/XLSX file (for parsing, an adaptive configuration if set - removing blank rows, skipping hidden rows, parsing number; additionally the CSV parsing options from the previous point).

## Configuration

The precompiler supports the following configuration options to be set:

|       Option       |       Type       | Description                                                                                           | Default |
| :----------------: | :--------------: | :---------------------------------------------------------------------------------------------------- | :------ |
|     `keepTag`      |    `boolean`     | Whether the load-tags should be kept or removed.                                                      | `false` |
|   `defaultValue`   | `string\|number` | The default value to be added to the table, if a column/value is not found.                           | `""`    |
|    `appendData`    |    `boolean`     | Whether the loaded data should be appended to the existing rows of the examples table or overwritten. | `true`  |
|  `ignoreKeyCase`   |    `boolean`     | Whether the casing of the example columns and data columns should be ignored.                         | `true`  |
| `addSourceComment` |    `boolean`     | Whether a comment should be added to the example, indicating the source and the data type.            | `false` |
|  `allowEmptyData`  |    `boolean`     | Whether empty data files are allowed to be loaded, or error should be thrown.                         | `false` |

## Other

This package uses [debug](https://www.npmjs.com/package/debug) for logging, use `gpc:test-data` :

```shell
DEBUG=gpc:test-data* gherking ...
```

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gpc-test-data/).