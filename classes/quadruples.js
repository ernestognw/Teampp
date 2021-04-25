const chalk = require("chalk");

class Quadruples {
  constructor(parentCtx) {
    this.parentCtx = parentCtx;

    this.intermediateCode = [];
    this.tmps = [];

    this.operatorsStack = [];
    this.operationsStack = [];
    this.typesStack = [];

    this.operators = {
      PLUS: "+",
      DIV: "/",
      MULT: "*",
      MINUS: "-",
      NOT_EQUAL: "!",
      EQUAL_EQUAL: "!=",
      GTE: ">=",
      LTE: "<=",
      GT: ">",
      LT: "<",
      AND: "&&",
      OR: "||",
      NOT: "!",
      OPEN_PARENTHESIS: "(",
      CLOSE_PARENTHESIS: ")",
    };

    this.inverseOperators = Object.entries(this.operators).reduce(
      (acc, [key, value]) => {
        acc[value] = key;
        return acc;
      },
      {}
    );
  }

  /**
   *
   * @param {operator} string an operator
   * @returns boolean if the operator is a valid operator
   */
  validateOperator = ({ operator }) => !!this.inverseOperators[operator];

  pushToOperatorsStack = ({ operator }) => {
    if (!this.validateOperator({ operator }))
      throw new Error(
        `Operator ${chalk.red(operator)} is not a valid operator`
      );

    this.operatorsStack.push(operator);
  };

  /**
   * Returns a generic error string with the line in which the error was detected
   */
  lineError = () =>
    `Semantic error at line ${chalk.yellow(this.parentCtx.yylineno)}.`;
}

module.exports = Quadruples;
