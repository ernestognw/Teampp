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
  inverseUnaryOperators,
  OPCODES,
} = require("./utils");

class Quadruples {
  constructor(semantics) {
    this.semantics = semantics;

    this.intermediateCode = [];
    this.tmpPointer = 1;

    this.operatorsStack = [];
    this.operationsStack = [];
    this.jumpStack = [];

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
   * @param {operator} string an operator
   * @returns boolean if the operator is a unary operator
   */
  isUnaryOperator = ({ operator }) => !!inverseUnaryOperators[operator];

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
          type
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
   * Retrieves last operator on operation stack
   * @returns Last operator
   */
  getLastOperation = () => this.operationsStack[this.operationsStack.length - 1];

  /**
   * Operates last standalone operator
   */
  operateStandalone = () => {
    const operator = this.operatorsStack.pop();

    const opcode = operatorToOpcode[operator];

    const left = "";

    const quadruple = [
      opcode,
      left,
      "", // Not right operator
      "", // Not result
    ];

    this.intermediateCode.push(quadruple);

    if (opcode === OPCODES.GOTO) {
      this.fillPendingJump();
      this.jumpStack.push(this.intermediateCode.length - 1);
    }
  };

  /**
   * Operates last unary operator with last one operations
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

    let tmp = "";

    if (
      opcode != OPCODES.READ &&
      opcode != OPCODES.WRITE &&
      opcode != OPCODES.GOTOF
    ) {
      tmp = `t${this.tmpPointer}`;
      this.pushToOperationsStack({
        value: `t${this.tmpPointer}`,
        type: resultType,
      });
      this.tmpPointer++;
    }

    if (opcode === OPCODES.GOTOF)
      this.jumpStack.push(this.intermediateCode.length);

    const quadruple = [
      opcode,
      left.value,
      "", // Not right operator
      tmp,
    ];

    this.intermediateCode.push(quadruple);
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

    let tmp = "";

    if (opcode != OPCODES.EQUAL) {
      // Equal is a special case
      tmp = `t${this.tmpPointer}`;
      this.tmpPointer++;
      this.pushToOperationsStack({
        value: tmp,
        type: resultType,
      });
    }

    const quadruple = [opcode, left.value, right.value, tmp];

    this.intermediateCode.push(quadruple);
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
      else if (this.isUnaryOperator({ operator: lastOperator }))
        this.operateUnary();
      else this.operateStandalone();
    }
  };

  /**
   * Fills a previously generated jump with the current quadruple
   * @param {boolean} usePop if going to use stack top as destination
   */
  fillPendingJump = (params = {}) => {
    const { usePop } = params;

    const target = this.jumpStack.pop();
    const index = this.intermediateCode[target].indexOf("");

    const to = usePop ? this.jumpStack.pop() : this.intermediateCode.length + 1;

    this.intermediateCode[target][index] = to;
  };

  /**
   * Validates that the last operation is for a specified type
   * @param {expectedType} type expected type
   */
  validateLastOperation = ({ expectedType }) => {
    const lastOperation = this.getLastOperation();

    if (expectedType != lastOperation.type)
      throw new Error(
        `${this.semantics.lineError()} 
      Type Mismatch: Value ${chalk.red(lastOperation.value)} is of type ${chalk.blue(
          lastOperation.type
        )}, but ${chalk.red(expectedType)} was expected
      `
      );
  };
}

module.exports = Quadruples;
