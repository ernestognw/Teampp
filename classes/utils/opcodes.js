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
  RETURN,
  VER,
  ADDDIM,
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
  LT: 0xa,
  AND: 0xb,
  OR: 0xc,
  NOT: 0xd,
  EQUAL: 0xe,
  READ: 0xf,
  WRITE: 0x10,
  GOTO: 0x11,
  GOTOF: 0x12,
  ERA: 0x13,
  PARAM: 0x14,
  GOSUB: 0x15,
  ENDFUNC: 0x16,
  RETURN: 0x17,
  RETURN: 0x18,
  VER: 0x19,
  ADDDIM: 0x1a,
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
  [VER]: OPCODES.VER,
  [ADDDIM]: OPCODES.ADDDIM,
};

// Only assertion to ensure every operator is being used
if (Object.values(operators).some((operator) => !operatorToOpcode[operator]))
  throw new Error(
    "Development: There are some operators not translated to opcodes"
  );

module.exports = { OPCODES, operatorToOpcode };
