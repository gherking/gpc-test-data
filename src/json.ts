import { readFileSync, existsSync } from "fs";
import { Tag } from "gherkin-ast";
import { FileNotFoundError, FileTypeError } from "./error";

export const TAG = 'load_json';
export const tag = (path: string): Tag => new Tag(TAG, path);
export const isTag = (tag: Tag): boolean => !!tag && tag.name.toLowerCase() === TAG;
export const getCommentText = (tag: Tag): string => `JSON data loaded from ${tag.value}`;

export function load(path: string): unknown[] {
  if (!/\.json$/i.test(path)) {
    throw new FileTypeError(`The given file is not a JSON file: ${path}!`);
  }
  if (!existsSync(path)) {
    throw new FileNotFoundError(`JSON file is not found: ${path}!`);
  }
  const data = JSON.parse(readFileSync(path, { encoding: "utf-8" }));
  return [].concat(data);
}