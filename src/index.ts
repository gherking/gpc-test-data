import { PreCompiler } from "gherking";
import { Comment, Examples, TableCell, TableRow, Tag } from "gherkin-ast";
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
  addSourceComment?: boolean;
}

const DEFAULT_CONFIG: TestDataConfig = {
  keepTag: false,
  defaultValue: "",
  appendData: true,
  ignoreKeyCase: true,
  addSourceComment: false,
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

  public getCommentText(tag: Tag): string {
    if (http.isTag(tag)) {
      return http.getCommentText(tag);
    }
    if (json.isTag(tag)) {
      return json.getCommentText(tag);
    }
    if (csv.isTag(tag)) {
      return csv.getCommentText(tag);
    }
    if (xls.isTag(tag)) {
      return xls.getCommentText(tag);
    }
    throw new UnknownFormatError(`Unknow data format load tag: ${tag.toString()}!`);
  }

  public async loadData(tag: Tag): Promise<unknown[]> {
    if (http.isTag(tag)) {
      return await http.load(tag.value);
    }
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
      const tag = loadTags[0];
      const rawData = await this.loadData(tag);
      if (!rawData.length) {
        throw new EmptyDataError(`Data is empty: ${tag}!`);
      }
      if (this.config.addSourceComment) {
        e.precedingComment = new Comment(
          (e.precedingComment ? e.precedingComment.text + '\n' : '') +
          `# gpc-test-data: ${this.getCommentText(tag)}`
        );
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
