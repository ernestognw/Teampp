const { types } = require("../types");
const { binaryOperators } = require("../operators");

const { INT, FLOAT, CHAR, BOOLEAN } = types;

const {
  PLUS,
  DIV,
  MULT,
  MINUS,
  NOT_EQUAL,
  EQUAL_EQUAL,
  GTE,
  LTE,
  GT,
  LT,
  AND,
  OR,
  EQUAL,
  PARAM,
  VER,
  ADDDIM,
  ...missing
} = binaryOperators;

// Only assertion to ensure every operator is being used
if (Object.keys(missing).length > 0)
  throw new Error("Development: There are some binary operators not used");

const binaryPrecube = {
  [INT]: {
    [INT]: {
      [PLUS]: INT,
      [DIV]: INT,
      [MULT]: INT,
      [MINUS]: INT,
      [NOT_EQUAL]: BOOLEAN,
      [EQUAL_EQUAL]: BOOLEAN,
      [GTE]: BOOLEAN,
      [LTE]: BOOLEAN,
      [GT]: BOOLEAN,
      [LT]: BOOLEAN,
      [AND]: null,
      [OR]: null,
      [EQUAL]: INT,
      [PARAM]: INT,
      [VER]: INT,
      [ADDDIM]: INT,
    },
    [FLOAT]: {
      [PLUS]: FLOAT,
      [DIV]: FLOAT,
      [MULT]: FLOAT,
      [MINUS]: FLOAT,
      [NOT_EQUAL]: BOOLEAN,
      [EQUAL_EQUAL]: BOOLEAN,
      [GTE]: BOOLEAN,
      [LTE]: BOOLEAN,
      [GT]: BOOLEAN,
      [LT]: BOOLEAN,
      [AND]: null,
      [OR]: null,
      [EQUAL]: FLOAT,
      [PARAM]: FLOAT,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
    [CHAR]: {
      [PLUS]: INT,
      [DIV]: INT,
      [MULT]: INT,
      [MINUS]: INT,
      [NOT_EQUAL]: BOOLEAN,
      [EQUAL_EQUAL]: BOOLEAN,
      [GTE]: BOOLEAN,
      [LTE]: BOOLEAN,
      [GT]: BOOLEAN,
      [LT]: BOOLEAN,
      [AND]: null,
      [OR]: null,
      [EQUAL]: INT,
      [PARAM]: INT,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
    [BOOLEAN]: {
      [PLUS]: null,
      [DIV]: null,
      [MULT]: null,
      [MINUS]: null,
      [NOT_EQUAL]: null,
      [EQUAL_EQUAL]: null,
      [GTE]: null,
      [LTE]: null,
      [GT]: null,
      [LT]: null,
      [AND]: null,
      [OR]: null,
      [EQUAL]: null,
      [PARAM]: null,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
  },
  [FLOAT]: {
    [FLOAT]: {
      [PLUS]: FLOAT,
      [DIV]: FLOAT,
      [MULT]: FLOAT,
      [MINUS]: FLOAT,
      [NOT_EQUAL]: BOOLEAN,
      [EQUAL_EQUAL]: BOOLEAN,
      [GTE]: BOOLEAN,
      [LTE]: BOOLEAN,
      [GT]: BOOLEAN,
      [LT]: BOOLEAN,
      [AND]: null,
      [OR]: null,
      [EQUAL]: FLOAT,
      [PARAM]: FLOAT,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
    [CHAR]: {
      [PLUS]: FLOAT,
      [DIV]: FLOAT,
      [MULT]: FLOAT,
      [MINUS]: FLOAT,
      [NOT_EQUAL]: BOOLEAN,
      [EQUAL_EQUAL]: BOOLEAN,
      [GTE]: BOOLEAN,
      [LTE]: BOOLEAN,
      [GT]: BOOLEAN,
      [LT]: BOOLEAN,
      [AND]: null,
      [OR]: null,
      [EQUAL]: FLOAT,
      [PARAM]: FLOAT,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
    [BOOLEAN]: {
      [PLUS]: null,
      [DIV]: null,
      [MULT]: null,
      [MINUS]: null,
      [NOT_EQUAL]: null,
      [EQUAL_EQUAL]: null,
      [GTE]: null,
      [LTE]: null,
      [GT]: null,
      [LT]: null,
      [AND]: null,
      [OR]: null,
      [EQUAL]: null,
      [PARAM]: null,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
  },
  [CHAR]: {
    [CHAR]: {
      [PLUS]: INT,
      [DIV]: INT,
      [MULT]: INT,
      [MINUS]: INT,
      [NOT_EQUAL]: BOOLEAN,
      [EQUAL_EQUAL]: BOOLEAN,
      [GTE]: BOOLEAN,
      [LTE]: BOOLEAN,
      [GT]: BOOLEAN,
      [LT]: BOOLEAN,
      [AND]: null,
      [OR]: null,
      [EQUAL]: CHAR,
      [PARAM]: CHAR,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
    [BOOLEAN]: {
      [PLUS]: null,
      [DIV]: null,
      [MULT]: null,
      [MINUS]: null,
      [NOT_EQUAL]: null,
      [EQUAL_EQUAL]: null,
      [GTE]: null,
      [LTE]: null,
      [GT]: null,
      [LT]: null,
      [AND]: null,
      [OR]: null,
      [EQUAL]: null,
      [PARAM]: null,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
  },
  [BOOLEAN]: {
    [BOOLEAN]: {
      [PLUS]: null,
      [DIV]: null,
      [MULT]: null,
      [MINUS]: null,
      [NOT_EQUAL]: BOOLEAN,
      [EQUAL_EQUAL]: BOOLEAN,
      [GTE]: null,
      [LTE]: null,
      [GT]: null,
      [LT]: null,
      [AND]: BOOLEAN,
      [OR]: BOOLEAN,
      [EQUAL]: BOOLEAN,
      [PARAM]: BOOLEAN,
      [VER]: null, // Can only be done between integers
      [ADDDIM]: null, // Can only be done between integers
    },
  },
};

// To not repeat operators, just declare once in any order at binaryPrecube
// and fill every combination using binaryPrecube
const binaryCube = Object.entries(binaryPrecube).reduce((acc, [key, value]) => {
  acc[key] = { ...(acc[key] || {}), ...value };

  Object.entries(value).forEach(([subkey, subvalue]) => {
    acc[subkey] = {
      ...(acc[subkey] || {}),
      [subkey]: subvalue,
      [key]: { ...value[subkey] },
    };
  });

  return acc;
}, {});

module.exports = { binaryCube };
