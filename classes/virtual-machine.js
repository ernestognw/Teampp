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
  VER,
} = OPCODES;

class VirtualMachine {
  constructor(memory) {
    this.instructionPointer = 0;
    this.memory = memory;
    this.currentMemory = this.memory.addresses;
    this.backStack = [];
    this.methodAddresses = [];
    this.previousMemories = [];
    this.returns = [];
    this.pendingIndexes = [];
    this.deep = 0;
  }

  /**
   * Access the current memory, and if there is no variable there, it tries to go up to next scope
   * until it finds the needed variable
   * @param {number} address address to access
   * @returns
   */
  accessMemory = (address) => {
    this.previousMemories.push(this.currentMemory);

    let back = 0;
    let value;

    do {
      value =
        this.previousMemories[this.previousMemories.length - back]?.[address];
      // console.log(this.previousMemories[this.previousMemories.length - back], value);

      back++;
      if (back > this.previousMemories.length) break;
    } while (typeof value === "undefined");

    this.previousMemories.pop();

    return value;
  };

  /**
   * Executes intermediate code previously set
   */
  exec = async () => {
    while (this.instructionPointer < this.code.length) {
      const quadruple = this.code[this.instructionPointer];
      const opcode = quadruple[0];
      const operation = this[opcode];
      if (!operation) throw new Error("Unknown opcode");
      await operation(quadruple);
      this.instructionPointer++;
    }
    // console.log(this.memory.addresses);
  };

  /**
   * Sets intermediate code
   * @param {array[quadruple]} code
   * @returns
   */
  setCode = (code) => (this.code = code);

  /**
   * Add previous indexes when accessing an array
   * @param {string} string
   */
  addPendingIndexes = ({ address }) => {
    if (this.pendingIndexes.length === 0) return address;

    const m = [];
    this.pendingIndexes.reverse().forEach(({ max }, index) => {
      m.push((m[index - 1] || 1) * max);
    });
    m.pop();
    m.reverse().push(1);

    const offset = this.pendingIndexes.reverse().reduce((acc, { index }, mIndex) => {
      acc += m[mIndex] * index;
      return acc;
    }, 0);

    this.pendingIndexes = [];

    return address + offset;
  };

  [SUM] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) + this.accessMemory(right);
  };

  [SUB] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) - this.accessMemory(right);
  };

  [MULT] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) * this.accessMemory(right);
  };

  [DIV] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) / this.accessMemory(right);
  };

  [EQ] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) === this.accessMemory(right);
  };

  [NEQ] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) != this.accessMemory(right);
  };

  [GTE] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) >= this.accessMemory(right);
  };

  [LTE] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) <= this.accessMemory(right);
  };

  [GT] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) > this.accessMemory(right);
  };

  [LT] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) < this.accessMemory(right);
  };

  [AND] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) && this.accessMemory(right);
  };

  [OR] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] =
      this.accessMemory(left) || this.accessMemory(right);
  };

  [NOT] = (quadruple) => {
    const [_, toNegate] = quadruple;

    const result = this.addPendingIndexes({ address: toNegate });

    this.currentMemory[result] = !this.accessMemory(result);
  };

  [EQUAL] = (quadruple) => {
    const [_, address, toSet] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.currentMemory[result] = this.accessMemory(toSet);
  };

  [READ] = async (quadruple) => {
    const [_, address] = quadruple;

    const toSet = this.addPendingIndexes({ address });

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

    this.currentMemory[toSet] = result;
  };

  [WRITE] = (quadruple) => {
    const [_, address] = quadruple;

    const toWrite = this.addPendingIndexes({ address });

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
    this.previousMemories.push(this.currentMemory);
    this.currentMemory = this.currentMemory[methodAddress]; // Move to activation record
    this.methodAddresses.push(methodAddress);
    this.deep++;
    if (this.deep > 5000)
      throw new Error(
        "Execution error: Stack overflow. Did you forget your base case?"
      );
  };

  [PARAM] = (quadruple) => {
    const [_, variable, address] = quadruple;

    const prevMemoryAddress = this.addPendingIndexes({ address });

    this.currentMemory[variable] = this.accessMemory(prevMemoryAddress);
  };

  [GOSUB] = (quadruple) => {
    this.backStack.push(this.instructionPointer);

    this[GOTO](quadruple);
  };

  [ENDFUNC] = () => {
    this.instructionPointer = this.backStack.pop();
    this.currentMemory = this.previousMemories.pop();

    const { value, address } = this.returns.pop();

    this.currentMemory[address] = value;
    this.deep--;
  };

  [RETURN] = (quadruple) => {
    const [_, address] = quadruple;
    const methodEnded = this.methodAddresses.pop();

    const variable = this.addPendingIndexes({ address });

    this.returns.push({
      value: this.accessMemory(variable),
      address: methodEnded,
    });

    while (this.code[this.instructionPointer][0] != ENDFUNC)
      this.instructionPointer++;

    this.instructionPointer--;
  };

  [VER] = (quadruple) => {
    const [_, address, max] = quadruple;

    const index = this.accessMemory(address);

    this.pendingIndexes.push({ index, max });

    if (index < 0 || index >= max)
      throw new Error("Execution error: Index out of bounds");
  };
}

module.exports = VirtualMachine;
