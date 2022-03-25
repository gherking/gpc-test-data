import * as json from "../src/json";
import * as csv from "../src/csv";
import * as xls from "../src/xls";
import { FileNotFoundError, FileTypeError, SheetNotFoundError } from "../src/error";

describe("Data Loading", () => {
  describe("JSON", () => {
    test('should have function to create load tag', () => {
      expect(json.tag('file').toString()).toBe('@load_json(file)');
    });

    test('should fail if not a JSON file is passed to it', () => {
      expect(() => json.load('tests/data/raw/raw.csv')).toThrowError(FileTypeError);
    });

    test('should fail if file cannot be found', () => {
      expect(() => json.load('tests/data/raw/other.json')).toThrowError(FileNotFoundError);
    });
  });

  describe("CSV", () => {
    test('should have function to create load tag', () => {
      expect(csv.tag('file').toString()).toBe('@load_csv(file)');
    });

    test('should fail if not a CSV file is passed to it', () => {
      expect(() => csv.load('tests/data/raw/raw.xls')).toThrowError(FileTypeError);
    });

    test('should fail if file cannot be found', () => {
      expect(() => csv.load('tests/data/raw/other.csv')).toThrowError(FileNotFoundError);
    });
  });

  describe("XLS", () => {
    test('should have function to create load tag', () => {
      expect(xls.tag('file').toString()).toBe('@load_xls(file)');
      expect(xls.tag('file', 'sheet').toString()).toBe('@load_xls(file,sheet)');
    });

    test('should fail if not a XLS file is passed to it', () => {
      expect(() => xls.load('tests/data/raw/raw.json')).toThrowError(FileTypeError);
    });

    test('should fail if file cannot be found', () => {
      expect(() => xls.load('tests/data/raw/other.xls')).toThrowError(FileNotFoundError);
    });

    test('should fail if sheet cannot be found', () => {
      expect(() => xls.load('tests/data/raw/raw.xls', 'no-sheet')).toThrowError(SheetNotFoundError);
      expect(() => xls.load('tests/data/raw/raw.xls', 42)).toThrowError(SheetNotFoundError);
    });
  });
});