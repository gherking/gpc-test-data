Feature: Test
  Scenario Outline: Loading Data
    Given step <number>
    When step <string>
    Then step <boolean>
    And step <date>

    Examples: JSON
      | number | string    | boolean | date        |
      | 0      | zero json | FALSE   | 2022.03.24. |
      | 1      | one json  | TRUE    | 42          |
      | 2      | 42        | FALSE   | 2022.03.26. |
      | 3      | 42        | TRUE    | 2022.03.27. |
      | 42     | four json | FALSE   | 2022.03.28. |
      | 5      | five json | 42      | 2022.03.29. |

    Examples: CSV
      | number | string    | boolean | date        | other |
      | 1      | one csv   | TRUE    | 2022.03.25. | 42    |
      | 2      | two csv   | FALSE   | 2022.03.26. | 42    |
      | 3      | three csv | TRUE    | 2022.03.27. | 42    |
      | 4      | four csv  | FALSE   | 2022.03.28. | 42    |
      | 5      | five csv  | TRUE    | 2022.03.29. | 42    |

    Examples: XLS
      | number | string    | boolean | date        |
      | 1      | one xls   | TRUE    | 2022.03.25. |
      | 2      | two xls   | FALSE   | 2022.03.26. |
      | 3      | three xls | TRUE    | 2022.03.27. |
      | 4      | four xls  | FALSE   | 2022.03.28. |
      | 5      | five xls  | TRUE    | 2022.03.29. |

    Examples: XLSX
      | number | string     | boolean | date        |
      | 1      | one xlsx   | TRUE    | 2022.03.25. |
      | 2      | two xlsx   | FALSE   | 2022.03.26. |
      | 3      | three xlsx | TRUE    | 2022.03.27. |
      | 4      | four xlsx  | FALSE   | 2022.03.28. |
      | 5      | five xlsx  | TRUE    | 2022.03.29. |

    Examples: HTTP
      | number | string    | boolean | date        |
      | 1      | one json  | TRUE    | 42          |
      | 2      | 42        | FALSE   | 2022.03.26. |
      | 3      | 42        | TRUE    | 2022.03.27. |
      | 42     | four json | FALSE   | 2022.03.28. |
      | 5      | five json | 42      | 2022.03.29. |