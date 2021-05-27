const { OPCODES, types } = require("./utils");
const readline = require("readline");

const question = (int) =>
  new Promise((resolve) => {
    int.question("", (variable) => {
      int.close();
      resolve(variable);
    });
  });

const { INT, FLOAT, CHAR, BOOLEAN, STRING } = types;

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

  exec = async () => {
    while (this.instructionPointer < this.code.length) {
      const quadruple = this.code[this.instructionPointer];
      const opcode = quadruple[0];
      const operation = this[opcode];
      if (!operation) throw new Error("Unknown opcode");
      await operation(quadruple);
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

  [READ] = async (quadruple) => {
    const [_, toSet] = quadruple;

    const int = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let result = await question(int);

    const [type] = Object.entries(
      this.memory.map[this.memory.segments.LOCAL]
    ).find(([_, { low, high }]) => toSet >= low && toSet <= high);

    if (type == INT) result = parseInt(result);
    if (type == FLOAT) result = parseFloat(result);
    if (type == CHAR) result = result[0];
    if (type == BOOLEAN) result = result !== "false";
    if (type == STRING) result = result.toString();

    this.memory.addresses[toSet] = result;
  };

  [WRITE] = (quadruple) => {
    const [_, toWrite] = quadruple;

    console.log(this.memory.addresses[toWrite]);
  };

  [GOTO] = (quadruple) => {};

  [GOTOF] = (quadruple) => {};
}

module.exports = VirtualMachine;
