Feature: Test
  Scenario Outline: Loading Data
    Given step <number>
    When step <string>
    Then step <boolean>
    And step <date>

    Examples: JSON
      | Number | string | boolean | date |

    Examples: CSV
      | Number | string | boolean | date | other |

    Examples: XLS
      | Number | string | boolean | date |

    Examples: XLSX
      | Number | string | boolean | date |
