const { operators } = require("./operators");

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
} = operators;

const OPCODES = {
  SUM: "SUM",
  SUB: "SUB",
  MULT: "MULT",
  DIV: "DIV",
  EQ: "EQ",
  NEQ: "NEQ",
  GTE: "GTE",
  LTE: "LTE",
  GT: "GT",
  LT: "LT",
  AND: "AND",
  OR: "OR",
};

const operatorToOpcode = {
  [PLUS]: OPCODES.SUM,
  [DIV]: OPCODES.DIV,
  [MULT]: OPCODES.MULT,
  [MINUS]: OPCODES.SUB,
  [NOT_EQUAL]: OPCODES.NEQ,
  [EQUAL_EQUAL]: OPCODES.EQ,
  [GTE]: OPCODES.GTE,
  [LTE]: OPCODES.LTE,
  [GT]: OPCODES.GT,
  [LT]: OPCODES.LT,
  [AND]: OPCODES.AND,
  [OR]: OPCODES.OR,
};

module.exports = { operatorToOpcode };
