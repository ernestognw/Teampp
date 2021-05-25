const { OPCODES } = require("./utils");

const {
  SUM,
  SUB,
  MULT,
  DIV,
  EQ,
  NEQ,
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
  GOTO,
  GOTOF,
} = OPCODES;

class VirtualMachine {
  constructor(memory) {
    this.instructionPointer = 0;
    this.memory = memory;
  }

  exec = () => {
    while (this.instructionPointer < this.code.length) {
      const quadruple = this.code[this.instructionPointer];
      const opcode = quadruple[0];
      const operation = this[opcode];
      if (!operation) throw new Error("Unknown opcode");
      operation(quadruple);
      this.instructionPointer++;
    }
  };

  setCode = (code) => (this.code = code);

  [SUM] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] + this.memory.addresses[right];
  };

  [SUB] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] - this.memory.addresses[right];
  };

  [MULT] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] * this.memory.addresses[right];
  };

  [DIV] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] / this.memory.addresses[right];
  };

  [EQ] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] === this.memory.addresses[right];
  };

  [NEQ] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] != this.memory.addresses[right];
  };

  [GTE] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] >= this.memory.addresses[right];
  };

  [LTE] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] <= this.memory.addresses[right];
  };

  [GT] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] > this.memory.addresses[right];
  };

  [LT] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] < this.memory.addresses[right];
  };

  [AND] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] && this.memory.addresses[right];
  };

  [OR] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.memory.addresses[result] =
      this.memory.addresses[left] || this.memory.addresses[right];
  };

  [NOT] = (quadruple) => {
    const [_, toNegate] = quadruple;

    this.memory.addresses[toNegate] = !this.memory.addresses[toNegate];
  };

  [EQUAL] = (quadruple) => {
    const [_, result, toSet] = quadruple;

    this.memory.addresses[result] = this.memory.addresses[toSet];
  };

  [READ] = (quadruple) => {};

  [WRITE] = (quadruple) => {
    const [_, toWrite] = quadruple;

    console.log(this.memory.addresses[toWrite]);
  };

  [GOTO] = (quadruple) => {};

  [GOTOF] = (quadruple) => {};
}

module.exports = VirtualMachine;
