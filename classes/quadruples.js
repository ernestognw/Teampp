const chalk = require("chalk");
const { inverseOperators, inverseTypes, types } = require("./utils");

class Quadruples {
  constructor(semantics) {
    this.semantics = semantics;

    this.intermediateCode = [];
    this.tmps = [];

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
   * @param {type} string a type
   * @returns boolean if the type is a generic type
   */
  validateType = ({ type }) => !!inverseTypes[type];

  pushToOperatorsStack = ({ operator }) => {
    if (!this.validateOperator({ operator }))
      throw new Error(
        `${this.semantics.lineError()} Operator ${chalk.red(operator)} is not a valid operator`
      );

    this.operatorsStack.push(operator);
  };

  pushToOperationsStack = ({ type, value }) => {
    if (!this.validateType({ type }))
      throw new Error(
        `${this.semantics.lineError()} Type ${chalk.red(operator)} is not a valid type`
      );

    this.operationsStack.push({ type, value });
  };
}

module.exports = Quadruples;
