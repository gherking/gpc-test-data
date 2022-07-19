import { load, process } from "gherking";
import { Document, Examples, pruneID, tag } from "gherkin-ast";
import TestData, { TestDataConfig } from "../src";
import * as json from "../src/json";
import { AmbiguousTagsError, EmptyDataError, UnknownFormatError } from "../src/error";

const cleanLocationInfo = (ast: Document): void => {
  // @ts-ignore
  delete ast.sourceFile;
  // @ts-ignore
  delete ast.targetFile;
  // @ts-ignore
  delete ast.sourceFolder;
  // @ts-ignore
  delete ast.targetFolder;
}

const loadTestFeatureFile = async (folder: "input" | "expected", file: string): Promise<Document> => {
  const ast = await load(`./tests/data/${folder}/${file}`);
  cleanLocationInfo(ast[0]);
  return ast[0];
}

const checkConfig = async (testCase: string, config: Partial<TestDataConfig>): Promise<void> => {
  const input = await loadTestFeatureFile("input", `${testCase}.feature`);
  const expected = await loadTestFeatureFile("expected", `${testCase}.feature`);
  const actual = await process(input, new TestData(config));

  cleanLocationInfo(actual[0]);
  // @ts-ignore
  delete expected.uri;
  // @ts-ignore
  delete actual[0].uri;

  pruneID(actual);
  pruneID(expected);

  expect(actual).toHaveLength(1);
  expect(actual[0]).toEqual(expected);
}

describe("Test Data", () => {
  test("should load various type of test data ignoring key case", async () => {
    await checkConfig("ignore-case", {
      defaultValue: 42,
      ignoreKeyCase: true,
      appendData: false,
    });
  });

  test("should load various type of test data with case sensitive keys", async () => {
    await checkConfig("case-sensitive", {
      defaultValue: 42,
      ignoreKeyCase: false,
    });
  });

  test('should find load tags', () => {
    const testData = new TestData();
    // @ts-ignore
    expect(testData.findTags()).toEqual([]);
    expect(testData.findTags([])).toEqual([]);
  });

  test("should fail if multiple load tags set", () => {
    const examples = new Examples('Examples', 'Name');
    const testData = new TestData();
    examples.tags = [
      json.tag('file'),
      json.tag('other'),
    ];

    expect(() => testData.onExamples(examples)).rejects.toThrowError(AmbiguousTagsError);
  });

  test("should fail if data is empty", () => {
    const examples = new Examples('Examples', 'Name');
    const testData = new TestData();
    examples.tags = [
      json.tag('tests/data/raw/empty.json'),
    ];

    expect(() => testData.onExamples(examples)).rejects.toThrowError(EmptyDataError);
  });

  test("should fail if unknow format tag is found", () => {
    const testData = new TestData();
    expect(() => testData.loadData(tag('load_other', 'file'))).rejects.toThrowError(UnknownFormatError);
  })
});