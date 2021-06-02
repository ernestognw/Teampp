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
  ADDDIM,
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
    this.pendingDimensions = [];
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
   * Ensures scope access by writing to only stack variables. Otherwise, goes to global scope
   * @param {address} number
   * @param {value} any
   */
  write = ({ address, value }) => {
    const isInFunc = Object.values(
      this.memory.map[this.memory.segments.FUNCTION]
    ).some(({ low, high }) => address >= low && address <= high);
    const isInTemp = Object.values(
      this.memory.map[this.memory.segments.TEMP]
    ).some(({ low, high }) => address >= low && address <= high);

    if (isInFunc || isInTemp) this.currentMemory[address] = value;
    else {
      let back = 0;
      let previousValue;

      do {
        previousValue =
          this.previousMemories[this.previousMemories.length - back]?.[address];
        // console.log(this.previousMemories[this.previousMemories.length - back], previousValue);

        if (typeof previousValue !== "undefined") {
          this.previousMemories[this.previousMemories.length - back][address] =
          value;
          return;
        }
        
        back++;
        if (back > this.previousMemories.length) break;
      } while (typeof previousValue === "undefined");

      this.memory.addresses[address] = value;
    }
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
      // console.log(this.memory.addresses);
    }
    // console.log(this.pendingIndexes);
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
  addPendingIndexes = ({
    address,
    pop = true,
    minLength = 0,
    resetAll = true,
  }) => {
    if (this.pendingDimensions.length <= minLength) return address;

    const amountOfDimensions = this.pendingDimensions.pop();
    const indexesToReduce = this.pendingIndexes.splice(amountOfDimensions * -1);

    if (!pop) {
      this.pendingIndexes = [...this.pendingIndexes, ...indexesToReduce];
      this.pendingDimensions.push(amountOfDimensions);
    }

    if (resetAll) {
      this.pendingIndexes = [];
      this.pendingDimensions = [];
    }

    const m = [];
    indexesToReduce.reverse().forEach(({ max }, index) => {
      m.push((m[index - 1] || 1) * max);
    });
    m.pop();
    m.reverse().push(1);

    const offset = indexesToReduce
      .reverse()
      .reduce((acc, { index }, mIndex) => {
        acc += m[mIndex] * index;
        return acc;
      }, 0);

    // console.log(address + offset, address, offset);
    return address + offset;
  };

  [SUM] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) + this.accessMemory(right),
    });
  };

  [SUB] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) - this.accessMemory(right),
    });
  };

  [MULT] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) * this.accessMemory(right),
    });
  };

  [DIV] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) / this.accessMemory(right),
    });
  };

  [EQ] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) === this.accessMemory(right),
    });
  };

  [NEQ] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) != this.accessMemory(right),
    });
  };

  [GTE] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) >= this.accessMemory(right),
    });
  };

  [LTE] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) <= this.accessMemory(right),
    });
  };

  [GT] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) > this.accessMemory(right),
    });
  };

  [LT] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) < this.accessMemory(right),
    });
  };

  [AND] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) && this.accessMemory(right),
    });
  };

  [OR] = (quadruple) => {
    const [_, left, right, address] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(left) || this.accessMemory(right),
    });
  };

  [NOT] = (quadruple) => {
    const [_, toNegate] = quadruple;

    const result = this.addPendingIndexes({ address: toNegate });

    this.write({
      address: result,
      value: !this.accessMemory(result),
    });
  };

  [EQUAL] = (quadruple) => {
    const [_, address, toSet] = quadruple;

    const result = this.addPendingIndexes({ address });

    this.write({
      address: result,
      value: this.accessMemory(toSet),
    });
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
    const [_, address, target] = quadruple;

    const toCheck = this.addPendingIndexes({ address });

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

    this.write({
      address: variable,
      value: this.accessMemory(prevMemoryAddress),
    });
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

  [ADDDIM] = (quadruple) => {
    const [_, dimensionsAddress] = quadruple;

    const dimensions = this.accessMemory(dimensionsAddress);

    this.pendingDimensions.push(dimensions);
  };

  [VER] = (quadruple) => {
    const [_, indexAddress, maxAddress] = quadruple;

    const indexAddressAdvanced = this.addPendingIndexes({
      address: indexAddress,
      pop: false,
      minLength: 1,
      resetAll: false,
    });

    const index = this.accessMemory(indexAddressAdvanced);
    const max = this.accessMemory(maxAddress); // Maz is always a constant

    this.pendingIndexes.push({ index, max });

    if (index < 0 || index >= max)
      throw new Error("Execution error: Index out of bounds");
  };
}

module.exports = VirtualMachine;
