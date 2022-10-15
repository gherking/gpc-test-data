import { readFileSync, existsSync } from "fs";
import { Tag } from "gherkin-ast";
import { FileNotFoundError, FileTypeError } from "./error";
import { detect } from "csv-string";
import { parse } from "csv-parse/sync";

export const TAG = 'load_csv';
export const tag = (path: string): Tag => new Tag(TAG, path);
export const isTag = (tag: Tag): boolean => !!tag && tag.name.toLowerCase() === TAG;
export const getCommentText = (tag: Tag): string => `CSV data loaded from ${tag.value}`;

export function loadString(csvString: string): unknown[] {
  return parse(csvString, {
    columns: true,
    skipEmptyLines: true,
    trim: true,
    delimiter: detect(csvString),
    bom: true,
  });
}

export function load(path: string): unknown[] {
  if (!/\.csv$/i.test(path)) {
    throw new FileTypeError(`The given file is not a CSV file: ${path}!`);
  }
  if (!existsSync(path)) {
    throw new FileNotFoundError(`CSV file is not found: ${path}!`);
  }
  const csvString = readFileSync(path, { encoding: "utf-8" });
  return loadString(csvString);
}