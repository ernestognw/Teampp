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
  SUM: 0x1,
  SUB: 0x2,
  MULT: 0x3,
  DIV: 0x4,
  EQ: 0x5,
  NEQ: 0x6,
  GTE: 0x7,
  LTE: 0x8,
  GT: 0x9,
  LT: 0xA,
  AND: 0xB,
  OR: 0xC,
  NOT: 0xD,
  EQUAL: 0xC,
  READ: 0xE,
  WRITE: 0xF,
  GOTO: 0x10,
  GOTOF: 0x11,
  ERA: 0x12,
  PARAM: 0x13,
  GOSUB: 0x14,
  ENDFUNC: 0x15,
  RETURN: 0x16,
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
