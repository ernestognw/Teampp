const chalk = require("chalk");
const {
  inverseOperators,
  inverseTypes,
  types,
  genericTypes,
  operatorToOpcode,
  unaryCube,
  binaryCube,
  operatorsPriority,
  inverseBinaryOperators,
  inverseUnaryOperators,
  operators,
  OPCODES,
} = require("./utils");

class Quadruples {
  constructor(semantics) {
    this.semantics = semantics;

    this.intermediateCode = [[OPCODES.GOTO, null, null, null]];

    this.operatorsStack = [];
    this.operationsStack = [];
    this.jumpStack = [];

    this.types = types;

    this.operators = operators;
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
  validateType = ({ type }) =>
    !!inverseTypes[type] || type === genericTypes.VOID;

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
  getLastOperation = () =>
    this.operationsStack[this.operationsStack.length - 1];

  /**
   * Operates last standalone operator
   */
  operateStandalone = () => {
    const operator = this.operatorsStack.pop();

    const opcode = operatorToOpcode[operator];

    const left = null;

    const quadruple = [
      opcode,
      left,
      null, // Not right operator
      null, // Not result
    ];

    this.intermediateCode.push(quadruple);

    if (opcode === OPCODES.GOTO) {
      this.fillPendingJump();
      this.jumpStack.push(this.intermediateCode.length - 1);
    }
    if (opcode === OPCODES.GOSUB) {
      this.jumpStack.push(this.intermediateCode.length - 1);
      this.fillPendingJump({ usePop: true });
    }
  };

  /**
   * Operates last unary operator with last one operations
   */
  operateUnary = () => {
    const left = this.operationsStack.pop();
    const operator = this.operatorsStack.pop();

    const isVoid = left.type === genericTypes.VOID;

    const resultType = !isVoid && unaryCube[left.type][operator];

    if (!resultType && !isVoid)
      throw new Error(
        `${this.semantics.lineError()} 
        Type Mismatch: Value ${chalk.red(left.value)} of type ${chalk.blue(
          left.type
        )} cannot be operated using ${chalk.red(operator)} operator
        `
      );

    const opcode = operatorToOpcode[operator];

    const leftAddress =
      this.semantics.checkOnPreviousScope({
        directory: this.semantics.currentDirectory,
        id: left.value,
      })?.address || left.value;

    if (
      opcode != OPCODES.READ &&
      opcode != OPCODES.WRITE &&
      opcode != OPCODES.GOTOF &&
      opcode != OPCODES.RETURN
    ) {
      if (!isVoid)
        this.pushToOperationsStack({
          value: leftAddress,
          type: resultType,
        });
    }

    if (opcode === OPCODES.GOTOF) {
      this.jumpStack.push(this.intermediateCode.length);
      this.operationsStack.pop();
    }

    const quadruple = [
      opcode,
      leftAddress,
      null, // Not right operator,
      null,
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

    const resultType =
      right.type != genericTypes.VOID &&
      left.type != genericTypes.VOID &&
      binaryCube[right.type][left.type][operator];

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

    let tmp = null;

    if (
      opcode != OPCODES.EQUAL &&
      opcode != OPCODES.PARAM &&
      opcode != OPCODES.ADDDIM &&
      opcode != OPCODES.VER
    ) {
      // Equal is a special case
      tmp = this.semantics.memory.getAddress({
        type: resultType,
        segment: this.semantics.memory.segments.TEMP,
      });

      this.pushToOperationsStack({
        value: tmp,
        type: resultType,
      });
    }

    let leftDirectory = this.semantics.currentDirectory;

    if (opcode == OPCODES.PARAM)
      leftDirectory = this.semantics.checkOnPreviousScope({
        directory: this.semantics.currentDirectory,
        id: this.semantics.callingVariable,
      });

    const leftVar = this.semantics.checkOnPreviousScope({
      directory: leftDirectory || this.semantics.currentDirectory,
      id: left.value,
    });

    const rightVar = this.semantics.checkOnPreviousScope({
      directory: this.semantics.currentDirectory,
      id: right.value,
    });

    const leftAddress = leftVar?.address || left.value;
    const rightAddress = rightVar?.address || right.value;

    const quadruple = [opcode, leftAddress, rightAddress, tmp];

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
    const index = this.intermediateCode[target].indexOf(null);

    const to = usePop ? this.jumpStack.pop() : this.intermediateCode.length;

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
      Type Mismatch: Value ${chalk.red(
        lastOperation.value
      )} is of type ${chalk.blue(lastOperation.type)}, but ${chalk.red(
          expectedType
        )} was expected
      `
      );
  };

  /**
   * Adds go sub for functions
   * @param {string} functionName name of the function to operate
   */
  addGoSub = ({ functionName }) => {
    const validated = this.semantics.validateId({ id: functionName });

    this.jumpStack.push(validated.target);
    this.operatorsStack.push(this.operators.GOSUB);
    this.checkOperation({ priority: -3 });
  };

  /**
   * Adds corresponding operators to access an index of an array
   * @param {dimensions} array of dimensions
   * @param {dimensionToCheck} array of dimensions to check
   * @param {address} number of address to apply dimensions
   */
  addArrayIndex = ({ dimensions, dimensionsToCheck, address }) => {
    if (dimensions.length === 0) return;

    this.semantics.setConstant({ type: types.INT, value: dimensions.length });
    this.operationsStack.push({ type: types.INT, value: address });
    this.operatorsStack.push(this.operators.ADDDIM);
    this.checkOperation({ priority: -3 });

    dimensions.forEach((dimension, index) =>
      this.addVer({
        dimension,
        dimensionToCheck: dimensionsToCheck[index],
      })
    );
  };

  /**
   * Add verification operation for arrays
   * @param {object} dimension data about the current accesed dimension
   * @param {dimensionToCheck} dimension variable or address accessing the current dimension
   */
  addVer = ({ dimension, dimensionToCheck }) => {
    this.pushToOperationsStack(dimensionToCheck);
    this.semantics.setConstant({ type: types.INT, value: dimension.size });
    this.operatorsStack.push(this.operators.VER);
    this.checkOperation({ priority: -3 });
  };
}

module.exports = Quadruples;
