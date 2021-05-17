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
} = binaryOperators;

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
    },
    [BOOLEAN]: {
      [PLUS]: "",
      [DIV]: "",
      [MULT]: "",
      [MINUS]: "",
      [NOT_EQUAL]: "",
      [EQUAL_EQUAL]: "",
      [GTE]: "",
      [LTE]: "",
      [GT]: "",
      [LT]: "",
      [AND]: "",
      [OR]: "",
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
    },
  },
};

// To not repeat operators, just declare once in any order at binaryPrecube
// and fill every combination using binaryPrecube
const binaryCube = Object.entries(binaryPrecube).reduce((acc, [key, value]) => {
  acc[key] = { ...(acc[key] ?? {}), ...value };

  Object.entries(value).forEach(([subkey, subvalue]) => {
    acc[subkey] = {
      ...(acc[subkey] ?? {}),
      [subkey]: subvalue,
      [key]: { ...value[subkey] },
    };
  });

  return acc;
}, {});

module.exports = { binaryCube }
