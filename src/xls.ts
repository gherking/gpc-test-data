import { existsSync } from "fs";
import { Tag } from "gherkin-ast";
import { FileNotFoundError, FileTypeError, SheetNotFoundError } from "./error";
import { readFile, utils } from "xlsx";
import * as csv from "./csv";

export const TAG = 'load_xls';
export const tag = (path: string, sheet?: string | number): Tag => new Tag(
  TAG,
  typeof sheet === "undefined" ? path : `${path},${sheet}`
);
export const isTag = (tag: Tag): boolean => !!tag && tag.name.toLowerCase() === TAG;
export const getCommentText = (tag: Tag): string => {
  const [path, sheet] = tag.value.split(",");
  const comment = [`XLS data loaded from ${path}`];
  comment.push(typeof sheet === "undefined" ? "from the first sheet" : `from the '${sheet}' sheet`);
  return comment.join(", ");
};

export function load(path: string, sheet?: string | number): unknown[] {
  if (!/\.xlsx?$/i.test(path)) {
    throw new FileTypeError(`The given file is not an XLS/XLSX file: ${path}!`);
  }
  if (!existsSync(path)) {
    throw new FileNotFoundError(`XLS file is not found: ${path}!`);
  }
  const xls = readFile(path, {
    sheets: sheet,
  });
  sheet = (!sheet || typeof sheet === "number") ? xls.SheetNames[+sheet || 0] : sheet;
  const xlsSheet = xls.Sheets[sheet];
  if (!xlsSheet) {
    throw new SheetNotFoundError(`Sheet (${sheet}) does not exist in XLS (${path}), available sheets: ${xls.SheetNames}!`);
  }
  return csv.loadString(utils.sheet_to_csv(xlsSheet, {
    blankrows: false,
    skipHidden: true,
    rawNumbers: true,
  }));
}