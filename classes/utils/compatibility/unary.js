const { types } = require("../types");
const { unaryOperators } = require("../operators");

const { INT, FLOAT, CHAR, BOOLEAN, STRING } = types;

const { NOT, EQUAL, READ, WRITE, GOTOF, ERA, RETURN, ...missing } =
  unaryOperators;

// Only assertion to ensure every operator is being used
if (Object.keys(missing).length > 0)
  throw new Error("Development: There are some unary operators not used");

const unaryCube = {
  [INT]: {
    [NOT]: null,
    [EQUAL]: INT,
    [READ]: INT,
    [WRITE]: INT,
    [GOTOF]: null,
    [ERA]: INT,
    [RETURN]: INT,
  },
  [FLOAT]: {
    [NOT]: null,
    [EQUAL]: FLOAT,
    [READ]: FLOAT,
    [WRITE]: FLOAT,
    [GOTOF]: null,
    [ERA]: FLOAT,
    [RETURN]: FLOAT
  },
  [CHAR]: {
    [NOT]: null,
    [EQUAL]: CHAR,
    [READ]: CHAR,
    [WRITE]: CHAR,
    [GOTOF]: null,
    [ERA]: CHAR,
    [RETURN]: CHAR,
  },
  [BOOLEAN]: {
    [NOT]: BOOLEAN,
    [EQUAL]: BOOLEAN,
    [READ]: BOOLEAN,
    [WRITE]: BOOLEAN,
    [GOTOF]: BOOLEAN,
    [ERA]: BOOLEAN,
    [RETURN]: BOOLEAN,
  },
  // String is only valid for write unary operations. NOT NECESSARY TO COMPARE
  [STRING]: {
    [WRITE]: true,
    [GOTOF]: null,
  },
};

module.exports = { unaryCube };
