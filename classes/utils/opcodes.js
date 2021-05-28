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
  NOT,
  EQUAL,
  READ,
  WRITE,
  GOTOF,
  GOTO,
  ERA,
  PARAM,
  GOSUB,
  ENDFUNC,
  RETURN
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
  NOT: "NOT",
  EQUAL: "EQUAL",
  READ: "READ",
  WRITE: "WRITE",
  GOTO: "GOTO",
  GOTOF: "GOTOF",
  ERA: "ERA",
  PARAM: "PARAM",
  GOSUB: "GOSUB",
  ENDFUNC: "ENDFUNC",
  RETURN: "RETURN",
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
  [NOT]: OPCODES.NOT,
  [EQUAL]: OPCODES.EQUAL,
  [READ]: OPCODES.READ,
  [WRITE]: OPCODES.WRITE,
  [GOTO]: OPCODES.GOTO,
  [GOTOF]: OPCODES.GOTOF,
  [ERA]: OPCODES.ERA,
  [PARAM]: OPCODES.PARAM,
  [GOSUB]: OPCODES.GOSUB,
  [ENDFUNC]: OPCODES.ENDFUNC,
  [RETURN]: OPCODES.RETURN,
};

// Only assertion to ensure every operator is being used
if (Object.values(operators).some(operator => !operatorToOpcode[operator]))
  throw new Error("Development: There are some operators not translated to opcodes");

module.exports = { OPCODES, operatorToOpcode };
