const chalk = require("chalk");
const {
  inverseOperators,
  inverseTypes,
  types,
  operatorToOpcode,
  unaryCube,
  binaryCube,
  operatorsPriority,
  inverseBinaryOperators,
  OPCODES,
} = require("./utils");

class Quadruples {
  constructor(semantics) {
    this.semantics = semantics;

    this.intermediateCode = [];
    this.tmpPointer = 1;

    this.operatorsStack = [];
    this.operationsStack = [];

    this.types = types;
  }

  /**
   *
   * @param {operator} string an operator
   * @returns boolean if the operator is a valid operator
   */
  validateOperator = ({ operator }) => !!inverseOperators[operator];

  /**
   *
   * @param {operator} string an operator
   * @returns boolean if the operator is a binary operator
   */
  isBinaryOperator = ({ operator }) => !!inverseBinaryOperators[operator];

  /**
   *
   * @param {type} string a type
   * @returns boolean if the type is a generic type
   */
  validateType = ({ type }) => !!inverseTypes[type];

  /**
   * Validates an operator and push it to operators stack
   *
   * @param {string} operator operator to push
   */
  pushToOperatorsStack = ({ operator }) => {
    if (!this.validateOperator({ operator }))
      throw new Error(
        `${this.semantics.lineError()} Operator ${chalk.red(
          operator
        )} is not a valid operator`
      );

    this.operatorsStack.push(operator);
  };

  /**
   * Validates a value and its type and push it to operations stack
   *
   * @param {string} operator operator to push
   */
  pushToOperationsStack = ({ type, value }) => {
    if (!this.validateType({ type }))
      throw new Error(
        `${this.semantics.lineError()} Type ${chalk.red(
          operator
        )} is not a valid type`
      );

    this.operationsStack.push({ type, value });
  };

  /**
   * Retrieves last operator on operators stack
   * @returns Last operator
   */
  getLastOperator = () => this.operatorsStack[this.operatorsStack.length - 1];

  /**
   * Operates last unary operator with last two operations
   */
  operateUnary = () => {
    const left = this.operationsStack.pop();
    const operator = this.operatorsStack.pop();

    const resultType = unaryCube[left.type][operator];

    if (!resultType)
      throw new Error(
        `${this.semantics.lineError()} 
        Type Mismatch: Value ${chalk.red(left.value)} of type ${chalk.blue(
          left.type
        )} cannot be operated using ${chalk.red(operator)} operator
        `
      );

    const opcode = operatorToOpcode[operator];

    this.intermediateCode.push([
      opcode,
      left.value,
      "", // Not right operator
      `t${this.tmpPointer}`,
    ]);
    this.pushToOperationsStack({
      value: `t${this.tmpPointer}`,
      type: resultType,
    });
    this.tmpPointer++;
  };

  /**
   * Operates last binary operator with last two operations
   */
  operateBinary = () => {
    const right = this.operationsStack.pop();
    const left = this.operationsStack.pop();
    const operator = this.operatorsStack.pop();

    const resultType = binaryCube[right.type][left.type][operator];

    if (!resultType)
      throw new Error(
        `${this.semantics.lineError()} 
        Type Mismatch: Value ${chalk.red(right.value)} of type ${chalk.blue(
          right.type
        )} cannot be operated with value ${chalk.red(
          left.value
        )} of type ${chalk.blue(left.type)} using ${chalk.red(
          operator
        )} operator
        `
      );

    const opcode = operatorToOpcode[operator];

    if (opcode == OPCODES.EQUAL) {
      // EQUAL opcode is a binary special case WTF
      this.intermediateCode.push([
        opcode,
        right.value,
        "", // Not right value
        left.value,
      ]);
    } else {
      this.intermediateCode.push([
        opcode,
        left.value,
        right.value,
        `t${this.tmpPointer}`,
      ]);
      this.pushToOperationsStack({
        value: `t${this.tmpPointer}`,
        type: resultType,
      });
      this.tmpPointer++;
    }
  };

  /**
   * Finish an operation block and checks hierarchy on the operators stack
   * to operate accordingly
   *
   * @param {number} priority priority of the operation in which this function was called
   */
  checkOperation = ({ priority }) => {
    const lastOperator = this.getLastOperator();

    if (
      // Validation because it could be fake bottom
      this.validateOperator({ operator: lastOperator }) &&
      // Check priority
      operatorsPriority[lastOperator] == priority
    ) {
      if (this.isBinaryOperator({ operator: lastOperator }))
        this.operateBinary();
      else this.operateUnary();
    }
  };
}

module.exports = Quadruples;
