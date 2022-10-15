import { Tag } from "gherkin-ast";
import * as axios from "axios";
import { HTTPError } from "./error";

export const TAG = 'load_http';
export const tag = (path: string): Tag => new Tag(TAG, path);
export const isTag = (tag: Tag): boolean => !!tag && tag.name.toLowerCase() === TAG;

export async function load(url: string): Promise<unknown[]> {
  // Axios CJS is not aligned with the .d.ts
  // axios is not experted as default...
  const axiosFix = axios.default ? axios.default : axios;
  try {
    // @ts-ignore
    const r = await axiosFix.get(decodeURI(url));
    return [].concat(r.data);
  } catch(e) {
    throw new HTTPError(`Error during loading URL (${url}): ${e}`);
  }
}