const { types } = require("../types");
const { unaryOperators } = require("../operators");

const { INT, FLOAT, CHAR, BOOLEAN } = types;

const { NOT, EQUAL, ...missing } = unaryOperators;

// Only assertion to ensure every operator is being used
if (Object.keys(missing).length > 0)
  throw new Error("Development: There are some unary operators not used");

const unaryCube = {
  [INT]: {
    [NOT]: null,
    [EQUAL]: INT,
  },
  [FLOAT]: {
    [NOT]: null,
    [EQUAL]: FLOAT,
  },
  [CHAR]: {
    [NOT]: null,
    [EQUAL]: CHAR,
  },
  [BOOLEAN]: {
    [NOT]: BOOLEAN,
    [EQUAL]: BOOLEAN,
  },
};

module.exports = { unaryCube };
