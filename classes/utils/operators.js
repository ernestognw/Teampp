const operators = {
  PLUS: "+",
  DIV: "/",
  MULT: "*",
  MINUS: "-",
  NOT_EQUAL: "!",
  EQUAL_EQUAL: "!=",
  GTE: ">=",
  LTE: "<=",
  GT: ">",
  LT: "<",
  AND: "&&",
  OR: "||",
  // NOT: "!",
};

const inverseOperators = Object.entries(operators).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {}
);

module.exports = { operators, inverseOperators };
