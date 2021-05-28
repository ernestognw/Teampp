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
  ERA,
  PARAM,
  GOSUB,
  ENDFUNC,
  RETURN,
} = OPCODES;

class VirtualMachine {
  constructor(memory) {
    this.instructionPointer = 0;
    this.memory = memory;
    this.currentMemory = this.memory.addresses;
    this.backStack = [];
    this.methodAddresses = [];
  }

  accessMemory = (address) =>
    this.currentMemory[address] || this.memory.addresses[address];

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

    this.currentMemory[result] =
      this.accessMemory(left) + this.accessMemory(right);
  };

  [SUB] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) - this.accessMemory(right);
  };

  [MULT] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) * this.accessMemory(right);
  };

  [DIV] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) / this.accessMemory(right);
  };

  [EQ] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) === this.accessMemory(right);
  };

  [NEQ] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) != this.accessMemory(right);
  };

  [GTE] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) >= this.accessMemory(right);
  };

  [LTE] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) <= this.accessMemory(right);
  };

  [GT] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) > this.accessMemory(right);
  };

  [LT] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) < this.accessMemory(right);
  };

  [AND] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) && this.accessMemory(right);
  };

  [OR] = (quadruple) => {
    const [_, left, right, result] = quadruple;

    this.currentMemory[result] =
      this.accessMemory(left) || this.accessMemory(right);
  };

  [NOT] = (quadruple) => {
    const [_, toNegate] = quadruple;

    this.currentMemory[toNegate] = !this.accessMemory(toNegate);
  };

  [EQUAL] = (quadruple) => {
    const [_, result, toSet] = quadruple;

    this.currentMemory[result] = this.accessMemory(toSet);
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

    this.accessMemory(toSet) = result;
  };

  [WRITE] = (quadruple) => {
    const [_, toWrite] = quadruple;

    console.log(this.accessMemory(toWrite));
  };

  [GOTO] = (quadruple) => {
    const [_, target] = quadruple;

    this.instructionPointer = target - 1;
  };

  [GOTOF] = (quadruple) => {
    const [_, toCheck, target] = quadruple;

    if (!this.accessMemory(toCheck)) this.instructionPointer = target - 1;
  };

  [ERA] = (quadruple) => {
    const [_, methodAddress] = quadruple;

    this.currentMemory[methodAddress] = {}; // Activation Record
    this.currentMemory = this.accessMemory(methodAddress); // Move to activation record
    this.methodAddresses.push(methodAddress);
  };

  [PARAM] = (quadruple) => {
    const [_, variable, prevMemoryAddress] = quadruple;

    this.currentMemory[variable] = this.accessMemory(prevMemoryAddress);
  };

  [GOSUB] = (quadruple) => {
    this.backStack.push(this.instructionPointer);

    this[GOTO](quadruple);
  };

  [ENDFUNC] = () => {
    this.instructionPointer = this.backStack.pop();
    this.currentMemory = this.memory.addresses;
  };

  [RETURN] = (quadruple) => {
    const [_, variable] = quadruple;
    const methodEnded = this.methodAddresses.pop();

    this.memory.addresses[methodEnded] = this.accessMemory(variable);

    while(this.code[this.instructionPointer][0] != ENDFUNC)
      this.instructionPointer++
    

    this.instructionPointer--;
  };
}

module.exports = VirtualMachine;
