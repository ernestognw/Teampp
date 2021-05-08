const operators = {
  PLUS: "+",
  DIV: "/",
  MULT: "*",
  MINUS: "-",
  NOT_EQUAL: "!",
  EQUAL_EQUAL: 3,
  GTE: ">=",
  LTE: "<=",
  GT: ">",
  LT: "<",
  AND: "&&",
  OR: "||",
  // NOT: "!",
};

const operatorsPriority = {
  [operators.PLUS]: 2,
  [operators.MINUS]: 2,
  [operators.DIV]: 1,
  [operators.MULT]: 1,
  [operators.NOT_EQUAL]: 3,
  [operators.EQUAL_EQUAL]: 3,
  [operators.GTE]: 3,
  [operators.LTE]: 3,
  [operators.GT]: 3,
  [operators.LT]: 3,
  [operators.AND]: 4,
  [operators.OR]: 4,
};

const inverseOperators = Object.entries(operators).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {}
);

module.exports = { operators, inverseOperators, operatorsPriority };
