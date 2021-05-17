const binaryOperators = {
  PLUS: "+",
  MINUS: "-",
  DIV: "/",
  MULT: "*",
  NOT_EQUAL: "!=",
  EQUAL_EQUAL: "==",
  GTE: ">=",
  LTE: "<=",
  GT: ">",
  LT: "<",
  AND: "&&",
  OR: "||",
  EQUAL: "=",
};

const unaryOperators = {
  NOT: "!",
  READ: 'read',
  WRITE: 'write',
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
  [operators.NOT]: -1,
  [operators.EQUAL]: -2,
  [operators.READ]: -3,
  [operators.WRITE]: -3,
};

// Only assertion to ensure every operator has code
if (Object.values(operators).some((operator) => !operatorsPriority[operator]))
  throw new Error(
    "Development: You have an operator with no priority specified"
  );

const invert = (object) =>
  Object.entries(object).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const inverseBinaryOperators = invert(binaryOperators);
const inverseUnaryOperators = invert(unaryOperators);

const inverseOperators = {
  ...inverseBinaryOperators,
  ...inverseUnaryOperators,
};

module.exports = {
  binaryOperators,
  unaryOperators,
  operators,
  inverseBinaryOperators,
  inverseUnaryOperators,
  inverseOperators,
  operatorsPriority,
};
