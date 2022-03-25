import { PreCompiler } from "gherking";
import { Examples, TableCell, TableRow, Tag } from "gherkin-ast";
import * as json from "./json";
import * as csv from "./csv";
import * as xls from "./xls";
import { AmbiguousTagsError, EmptyDataError, UnknownFormatError } from "./error";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("gpc:test-data");

// TODO: define your configuration option, if necessary
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

  public prepareData(data: unknown[]): any[] {
    if (!this.config.ignoreKeyCase) {
      return data;
    }
    const preparedData: unknown[] = [];
    for (const entry of data as any[]) {
      const prepared: any = {};
      for (const key in entry) {
        prepared[key.toLowerCase()] = entry[key];
      }
      preparedData.push(prepared);
    }
    return preparedData;
  }

  public loadData(tag: Tag): unknown[] {
    if (json.isTag(tag)) {
      return json.load(tag.value);
    }
    if (csv.isTag(tag)) {
      return csv.load(tag.value);
    }
    if (xls.isTag(tag)) {
      const [path, sheet] = tag.value.split(",");
      return xls.load(path, sheet);
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
    return json.isTag(tag) || csv.isTag(tag) || xls.isTag(tag);
  }

  public postTag(tag: Tag): boolean {
    return this.config.keepTag || !this.isLoadTag(tag);
  }

  public onExamples(e: Examples): void {
    const loadTags = this.findTags(e.tags);
    if (loadTags.length > 1) {
      throw new AmbiguousTagsError(`Ambiguous tags on the example, only one allowed: ${loadTags.join()}!`);
    }
    if (loadTags.length) {
      const rawData = this.loadData(loadTags[0]);
      if (!rawData.length) {
        throw new EmptyDataError(`Data is empty: ${loadTags[0]}!`);
      }
      const preparedData = this.prepareData(rawData);
      const headers = e.header.cells.map(cell => this.config.ignoreKeyCase ? cell.value.toLowerCase() : cell.value);
      for (const data of preparedData) {
        const row = new TableRow();
        for (const h of headers) {
          if (h in data) {
            row.cells.push(new TableCell(String(data[h])));
          } else {
            row.cells.push(new TableCell(String(this.config.defaultValue)));
          }
        }
        e.body.push(row);
      }
    }
  }
}
