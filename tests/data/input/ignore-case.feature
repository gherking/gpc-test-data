Feature: Test
  Scenario Outline: Loading Data
    Given step <number>
    When step <string>
    Then step <boolean>
    And step <date>

    @load_json(tests/data/raw/raw.json)
    Examples: JSON
      | Number | string    | boolean | date        |
      | 0      | zero json | FALSE   | 2022.03.24. |

    @load_csv(tests/data/raw/raw.csv)
    Examples: CSV
      | Number | string | boolean | date | other |

    @load_xls(tests/data/raw/raw.xls)
    Examples: XLS
      | Number | string | boolean | date |

    @load_xls(tests/data/raw/raw.xlsx,data)
    Examples: XLSX
      | Number | string | boolean | date |

    @load_http(https://gherking.github.io/test_data/raw.json)
    Examples: HTTP
      | Number | string | boolean | date |