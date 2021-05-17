const binaryOperators = {
  PLUS: "+",
  DIV: "/",
  MULT: "*",
  MINUS: "-",
  NOT_EQUAL: "!=",
  EQUAL_EQUAL: "==",
  GTE: ">=",
  LTE: "<=",
  GT: ">",
  LT: "<",
  AND: "&&",
  OR: "||",
};

const unaryOperators = {
  NOT: "!",
};

const operators = {
  ...binaryOperators,
  ...unaryOperators,
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
  [operators.NOT]: 0,
};

const invert = (object) =>
  Object.entries(object).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const inverseBinaryOperators = invert(binaryOperators);
const inverseUnaryOperators = invert(unaryOperators);

const inverseOperators = { ...inverseBinaryOperators, ...inverseUnaryOperators };

module.exports = {
  binaryOperators,
  unaryOperators,
  operators,
  inverseBinaryOperators,
  inverseUnaryOperators,
  inverseOperators,
  operatorsPriority,
};
