const { types } = require("../types");
const { unaryOperators } = require("../operators");

const { INT, FLOAT, CHAR, BOOLEAN } = types;

const { NOT, EQUAL, READ, ...missing } = unaryOperators;

// Only assertion to ensure every operator is being used
if (Object.keys(missing).length > 0)
  throw new Error("Development: There are some unary operators not used");

const unaryCube = {
  [INT]: {
    [NOT]: null,
    [EQUAL]: INT,
    [READ]: INT,
  },
  [FLOAT]: {
    [NOT]: null,
    [EQUAL]: FLOAT,
    [READ]: FLOAT,
  },
  [CHAR]: {
    [NOT]: null,
    [EQUAL]: CHAR,
    [READ]: CHAR,
  },
  [BOOLEAN]: {
    [NOT]: BOOLEAN,
    [EQUAL]: BOOLEAN,
    [READ]: BOOLEAN,
  },
};

module.exports = { unaryCube };
