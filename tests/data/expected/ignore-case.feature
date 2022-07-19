Feature: Test
  Scenario Outline: Loading Data
    Given step <number>
    When step <string>
    Then step <boolean>
    And step <date>

    Examples: JSON
      | Number | string     | boolean | date        |
      | 1      | one json   | TRUE    | 2022.03.25. |
      | 2      | two json   | FALSE   | 2022.03.26. |
      | 3      | three json | TRUE    | 2022.03.27. |
      | 4      | four json  | FALSE   | 2022.03.28. |
      | 5      | five json  | TRUE    | 2022.03.29. |

    Examples: CSV
      | Number | string    | boolean | date        | other |
      | 1      | one csv   | TRUE    | 2022.03.25. | 42    |
      | 2      | two csv   | FALSE   | 2022.03.26. | 42    |
      | 3      | three csv | TRUE    | 2022.03.27. | 42    |
      | 4      | four csv  | FALSE   | 2022.03.28. | 42    |
      | 5      | five csv  | TRUE    | 2022.03.29. | 42    |

    Examples: XLS
      | Number | string    | boolean | date        |
      | 1      | one xls   | TRUE    | 2022.03.25. |
      | 2      | two xls   | FALSE   | 2022.03.26. |
      | 3      | three xls | TRUE    | 2022.03.27. |
      | 4      | four xls  | FALSE   | 2022.03.28. |
      | 5      | five xls  | TRUE    | 2022.03.29. |

    Examples: XLSX
      | Number | string     | boolean | date        |
      | 1      | one xlsx   | TRUE    | 2022.03.25. |
      | 2      | two xlsx   | FALSE   | 2022.03.26. |
      | 3      | three xlsx | TRUE    | 2022.03.27. |
      | 4      | four xlsx  | FALSE   | 2022.03.28. |
      | 5      | five xlsx  | TRUE    | 2022.03.29. |

    Examples: HTTP
      | Number | string     | boolean | date        |
      | 1      | one json   | TRUE    | 2022.03.25. |
      | 2      | two json   | FALSE   | 2022.03.26. |
      | 3      | three json | TRUE    | 2022.03.27. |
      | 4      | four json  | FALSE   | 2022.03.28. |
      | 5      | five json  | TRUE    | 2022.03.29. | 