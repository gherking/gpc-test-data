Feature: Test
  Scenario Outline: Loading Data
    Given step <number>
    When step <string>
    Then step <boolean>
    And step <date>

    @load_json(tests/data/raw/empty.json)
    Examples: JSON
      | Number | string | boolean | date |

    @load_csv(tests/data/raw/empty.csv)
    Examples: CSV
      | Number | string | boolean | date | other |

    @load_xls(tests/data/raw/empty.xls)
    Examples: XLS
      | Number | string | boolean | date |

    @load_xls(tests/data/raw/empty.xlsx,data)
    Examples: XLSX
      | Number | string | boolean | date |
