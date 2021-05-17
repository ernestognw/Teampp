const { types } = require("../types");
const { unaryOperators } = require("../operators");

const { INT, FLOAT, CHAR, BOOLEAN } = types;

const { NOT } = unaryOperators;

const unaryCube = {
  [INT]: {
    [NOT]: null,
  },
  [FLOAT]: {
    [NOT]: null,
  },
  [CHAR]: {
    [NOT]: null,
  },
  [BOOLEAN]: {
    [NOT]: BOOLEAN,
  },
};

module.exports = { unaryCube };
