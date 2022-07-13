import { Tag } from "gherkin-ast";
import axios from "axios";
import { HTTPError } from "./error";

export const TAG = 'load_http';
export const tag = (path: string): Tag => new Tag(TAG, path);
export const isTag = (tag: Tag): boolean => !!tag && tag.name.toLowerCase() === TAG;
export const getCommentText = (tag: Tag): string => `JSON data loaded from ${tag.value}`;

export async function load(url: string): Promise<unknown[]> {
  try {
    const r = await axios.get(decodeURI(url));
    return [].concat(r.data);
  } catch(e) {
    throw new HTTPError(`Error during loading URL (${url}): ${e}`);
  }
}