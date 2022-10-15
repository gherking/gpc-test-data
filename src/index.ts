import { PreCompiler } from "gherking";
import { Examples, TableCell, TableRow, Tag } from "gherkin-ast";
import * as json from "./json";
import * as csv from "./csv";
import * as xls from "./xls";
import * as http from "./http";
import { AmbiguousTagsError, EmptyDataError, UnknownFormatError } from "./error";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("gpc:test-data");

export interface TestDataConfig {
  keepTag?: boolean;
  defaultValue?: string | number;
  appendData?: boolean;
  ignoreKeyCase?: boolean;
}

const DEFAULT_CONFIG: TestDataConfig = {
  keepTag: false,
  defaultValue: "",
  appendData: true,
  ignoreKeyCase: true,
};

export type DataType = string | number | boolean;
export interface Data {
  [key: string]: DataType;
}

export default class TestData implements PreCompiler {
  private config: TestDataConfig;

  constructor(config?: Partial<TestDataConfig>) {
    debug("Intialize");
    /* istanbul ignore next */
    this.config = {
      ...DEFAULT_CONFIG,
      ...(config || {}),
    };
  }

  public prepareData(data: Data[]): Data[] {
    if (!this.config.ignoreKeyCase) {
      return data;
    }
    const preparedData: Data[] = [];
    for (const entry of data) {
      const prepared: Data = {};
      for (const key in entry) {
        prepared[key.toLowerCase()] = entry[key];
      }
      preparedData.push(prepared);
    }
    return preparedData;
  }

  public async loadData(tag: Tag): Promise<Data[]> {
    debug("loadData(tag: %s)", tag);
    if (http.isTag(tag)) {
      debug("loadData - HTTP: %s", tag.value);
      return await http.load(tag.value) as Data[];
    }
    if (json.isTag(tag)) {
      debug("loadData - JSON: %s", tag.value);
      return json.load(tag.value) as Data[];
    }
    if (csv.isTag(tag)) {
      debug("loadData - CSV: %s", tag.value);
      return csv.load(tag.value) as Data[];
    }
    if (xls.isTag(tag)) {
      debug("loadData - JSON: %s", tag.value);
      const [path, sheet] = tag.value.split(",");
      return xls.load(path, sheet) as Data[];
    }
    throw new UnknownFormatError(`Unknow data format load tag: ${tag.toString()}!`);
  }

  public findTags(tags: Tag[]): Tag[] {
    if (!Array.isArray(tags) || !tags.length) {
      return [];
    }
    return tags.filter(this.isLoadTag);
  }

  public isLoadTag(tag: Tag): boolean {
    return json.isTag(tag) || csv.isTag(tag) || xls.isTag(tag) || http.isTag(tag);
  }

  public postTag(tag: Tag): boolean {
    return this.config.keepTag || !this.isLoadTag(tag);
  }

  public async onExamples(e: Examples): Promise<void> {
    const loadTags = this.findTags(e.tags);
    if (loadTags.length > 1) {
      throw new AmbiguousTagsError(`Ambiguous tags on the example, only one allowed: ${loadTags.join()}!`);
    }
    if (loadTags.length) {
      const rawData = await this.loadData(loadTags[0]);
      if (!rawData.length) {
        throw new EmptyDataError(`Data is empty: ${loadTags[0]}!`);
      }
      const preparedData = this.prepareData(rawData);
      const headers = e.header.cells.map(cell => {
        return this.config.ignoreKeyCase ? cell.value.toLowerCase() : cell.value;
      });
      const body: TableRow[] = this.config.appendData ? e.body : [];
      for (const data of preparedData) {
        const row = new TableRow();
        for (const h of headers) {
          if (h in data) {
            row.cells.push(new TableCell(String(data[h])));
          } else {
            row.cells.push(new TableCell(String(this.config.defaultValue)));
          }
        }
        body.push(row);
      }
      e.body = body;
    }
  }
}
