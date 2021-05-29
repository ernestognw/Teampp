const chalk = require("chalk");
const Quadruples = require("./quadruples.js");
const {
  genericTypes,
  inverseGenericTypes,
  inverseTypes,
  operators,
} = require("./utils");

class Semantics {
  constructor(grammar, memory) {
    this.grammar = grammar;

    this.main = {
      varsDirectory: {},
    };
    this.currentDirectory = this.main;
    this.constantsDirectory = {};
    this.currentType = null;
    this.pendingVars = [];
    this.currentFunctionCall = {};
    this.paramPointer = 0;
    this.previousDirectoriesStack = [];
    this.currentVariableStack = [];
    this.isPointPending = false;
    this.pointsAdvanced = 0;
    this.callingFunction = "";

    this.genericTypes = genericTypes;

    this.quadruples = new Quadruples(this);
    this.memory = memory;
  }

  /**
   * Add variable to the current directory
   *
   * @param {id} string identifier of the variable
   * @param {type} string type of variable
   * @param {addNextLevel} boolean whether is going to start a new sub variable directory
   * @param {isFunction} boolean whether the variable is for a function or not
   * @param {dimensions} number number of dimensions for the variable
   * @param {addToParams} boolean whether to add the variable to param array
   */
  addVar = ({
    id,
    type,
    isFunction = false,
    addNextLevel = false,
    dimensions = 0,
    addToParams = false,
  }) => {
    const typeExists = this.validateGenericType({ type });

    let varsDirectory = {};

    if (addToParams) {
      if (this.currentDirectory.varsDirectory[id]?.isParam)
        throw new Error(
          `${this.lineError()} Param ${chalk.red(
            id
          )} already exists in ${chalk.blue(
            this.currentDirectory.name
          )} function declaration.`
        );
    }

    if (!typeExists) {
      const { varsDirectory: classVarsDirectory } = this.validateId({
        id: type,
        expectedType: genericTypes.CLASS,
      });

      // When type is not generic, it is needed to copy a pointer to the varsDirectory
      // of the variable, since they will not change, and will be useful to address
      // future calls such as foo.bar
      varsDirectory = { ...classVarsDirectory };
    }

    if (!!this.currentDirectory.varsDirectory[id]) {
      throw new Error(
        `${this.lineError()} Variable ${chalk.red(
          id
        )} already exists in ${chalk.blue(this.currentDirectory.name)} scope.`
      );
    }

    let address;
    if (this.validateType({ type })) {
      address = this.memory.getAddress({
        type,
        segment: isFunction
          ? this.memory.segments.STACK
          : this.memory.segments.LOCAL,
      });
    }

    this.currentDirectory.varsDirectory[id] = {
      name: id,
      type,
      isFunction,
      dimensions,
      varsDirectory,
      address,
      params: [],
      isParam: addToParams,
    };

    if (isFunction) {
      this.currentDirectory.varsDirectory[id].target =
        this.quadruples.intermediateCode.length;
      this.currentDirectory.varsDirectory[id].varsDirectory[id] =
        this.currentDirectory.varsDirectory[id];
    }

    if (addToParams)
      this.currentDirectory.params.push(
        this.currentDirectory.varsDirectory[id]
      );

    if (addNextLevel)
      this.advanceToDirectory({
        name: id,
      });
  };

  /**
   * Adds dimension to current variable
   */
  addDimensionToLastPendingVar = () => {
    this.pendingVars[this.pendingVars.length - 1].dimensions++;
  };

  /**
   *
   * @param {type} string a type
   * @returns boolean if the type is a generic type
   */
  validateGenericType = ({ type }) => !!inverseGenericTypes[type];

  /**
   *
   * @param {type} string a type
   * @returns boolean if the type is a type
   */
  validateType = ({ type }) => !!inverseTypes[type];

  /**
   * Add function by using the current type saved previously
   *
   * @param {id} name of the function
   */
  addFunction = ({ id }) => {
    this.addVar({
      id,
      type: this.currentType,
      isFunction: true,
      addNextLevel: true,
    });
    this.currentType = null;
  };

  /**
   * Gets variable from current directory and validates it against an expected type (if present)
   * If variable is not present at current directory, it will try check previous directory scopes
   * until it finds it or goes to the root, at which it will throw an error
   *
   * @param {id} string id of the variable
   * @param {expectedType} string the type that the variable is expected to have
   * @param {expectFunction} boolean if function is expected
   * @returns {toCheck} object variable directory
   */
  validateId = ({ id, expectedType, expectFunction = false }) => {
    const scope = this.currentDirectory.name;
    const directory = this.currentDirectory;
    const toCheck = this.checkOnPreviousScope({
      directory,
      id,
    });

    if (!toCheck) {
      throw new Error(
        `${this.lineError()} Identifier ${chalk.blue(
          id
        )} not declared in ${chalk.red(scope)} scope.`
      );
    }

    if (expectFunction && !toCheck.isFunction) {
      throw new Error(
        `${this.lineError()} Cannot call identifier ${chalk.blue(
          id
        )} since it is not a function.`
      );
    }

    if (expectedType && toCheck.type !== expectedType) {
      throw new Error(
        `${this.lineError()} Identifier ${chalk.blue(
          id
        )} is not of type ${chalk.yellow(expectedType)}, but is ${chalk.red(
          toCheck.type
        )}.`
      );
    }

    return toCheck;
  };

  /**
   * Validates that the current variable is a function or not
   * @param {boolean} isFunction Wheter to expect the var to be a function or not
   */
  validateCurrentVariableFunction = ({ isFunction }) => {
    const currentVariable = this.getCurrentVariable();

    if (currentVariable.isFunction !== isFunction)
      throw new Error(
        `${this.lineError()} Identifier ${chalk.blue(id)} is ${
          isFunction ? "not" : ""
        } a function`
      );
  };

  /**
   * Add a variable to pending vars. Using during vars declaration when the type hasn't been specified
   *
   * @param {name} string name of the variable to push into pending vars
   */
  pushToPendingVars = ({ name }) => {
    this.pendingVars.push({ name, dimensions: 0 });
  };

  /**
   * Takes pending vars and registers them into current directory with specified type
   *
   * @param {type} string type to assing to every single pending var
   */
  addPendingVars = ({ type }) => {
    this.pendingVars.forEach(({ name, dimensions }) => {
      this.addVar({
        id: name,
        type,
        dimensions,
      });
    });

    // Reset pending vars
    this.pendingVars = [];
  };

  /**
   * Goes to the previous directory. Used when a block ends
   */
  backDirectory = () => {
    this.currentDirectory = this.previousDirectoriesStack.pop();
  };

  /**
   * Checks if a subvariable is available under currentVariable
   * Its useful for when using variables with submethods or subvariables like foo.bar
   *
   * @param {id} string id of the variable
   * @param {expectedType} string the type that the variable is expected to have
   * @returns {toCheck} object variable directory
   */
  validateCurrentVariable = ({ id }) => {
    if (!this.isPointPending) {
      // If there is not a current variable
      // we validate as a normal variable
      return this.validateId({ id });
    }

    let currentVariable = this.getCurrentVariable();

    const toCheck = currentVariable.varsDirectory[id];
    const variableName = currentVariable.name;

    if (!toCheck) {
      throw new Error(
        `${this.lineError()} Identifier ${chalk.blue(
          id
        )} not declared in ${chalk.red(variableName)}`
      );
    }

    return toCheck;
  };

  /**
   * Whenever there is a variable usage, we need to track it
   * so at the end we verify if it has the properties expected.
   * This function sets the current variable to be checked
   *
   * @param {id} string variable id to check
   */
  setCurrentVariable = ({ id }) => {
    const variable = this.validateCurrentVariable({ id }); // Check if variable is available in current scope

    if (!this.isPointPending) {
      this.currentVariableStack.push({ ...variable, dimensionsToCheck: 0 });
    } else {
      let currentVariable = this.getCurrentVariable();

      if (currentVariable.isFunction)
        throw new Error(
          `${this.lineError()} You cannot access to ${chalk.red(
            id
          )} property of ${chalk.blue(
            currentVariable.name
          )} since it is a function.`
        );

      // Do not use currentVariable on the next line since it is just a copy of
      // the correct directory. Doing it will make this update to not have effect
      this.currentVariableStack[this.currentVariableStack.length - 1] = {
        ...variable,
        // Preserve dimensions to check
        dimensionsToCheck: this.getCurrentVariable().dimensionsToCheck,
      };
    }

    this.isPointPending = false; // At this point, every point needed decisions were made. So reset
  };

  /**
   * Gets current variable
   */
  getCurrentVariable = () =>
    this.currentVariableStack[this.currentVariableStack.length - 1];

  /**
   * Tells the semantics to search for a subdirectory when there is a point
   * in calls such as foo.bar
   */
  searchForSubvariable = () => {
    this.isPointPending = true;
    this.pointsAdvanced++;
  };

  /**
   * Adds a dimension to currentVariableDimensionsToCheck in order to know
   * if the variable has enough dimensions at the end of declaration
   */
  addDimensionToCheck = () => {
    this.getCurrentVariable().dimensionsToCheck++;
  };

  /**
   * Returns a generic error string with the line in which the error was detected
   */
  lineError = () =>
    `Semantic error at line ${chalk.yellow(this.grammar.yylineno)}.`;

  /**
   * Enters into a directory
   * @param {name} string name of the directory to enter
   */
  advanceToDirectory = ({ name }) => {
    this.previousDirectoriesStack.push(this.currentDirectory);
    this.currentDirectory = this.checkOnPreviousScope({
      directory: this.currentDirectory,
      id: name,
    });
  };

  /**
   *
   */
  validateParam = () => {
    const directory = this.checkOnPreviousScope({
      directory: this.currentDirectory,
      id: this.callingVariable
    });
    const name = directory.name;
    const expectedParams = directory.params;
    const param = expectedParams[this.paramPointer];

    if (!param)
      throw new Error(`
    ${this.lineError()} Function ${chalk.blue(name)} expected ${chalk.red(
        expectedParams.length
      )} params.
      `);

    const { type: expectedType, name: paramName } = param;
    const { type, value } = this.quadruples.getLastOperation();

    if (type !== expectedType)
      throw new Error(`
    ${this.lineError()} Function ${chalk.blue(name)} expected ${chalk.red(
        expectedType
      )} type in parameter ${chalk.green(
        this.paramPointer + 1
      )} but received ${chalk.red(type)}.
        `);

    this.paramPointer++;

    this.quadruples.pushToOperationsStack({
      type: expectedType,
      value: paramName,
    });
    this.quadruples.pushToOperationsStack({
      type,
      value,
    });
    this.quadruples.pushToOperatorsStack({
      operator: operators.PARAM,
    });
    this.quadruples.checkOperation({ priority: -3 });
  };

  resetParamPointer = () => {
    const name = this.currentDirectory.name;
    const expectedParams = this.currentDirectory.params;

    if (this.paramPointer < expectedParams.length)
      throw new Error(`
    ${this.lineError()} Function ${chalk.blue(name)} expected ${chalk.red(
        expectedParams.length
      )} params.
      `);

    this.paramPointer = 0;
  };

  /**
   *
   * @param {number} value to set
   * @param {type} type of constant
   */
  setConstant = ({ value, type }) => {
    const address =
      this.constantsDirectory[value] ||
      this.memory.getAddress({
        type,
        segment: this.memory.segments.GLOBAL,
      });

    this.constantsDirectory[value] = address;
    this.memory.addresses[address] = value;
    this.quadruples.pushToOperationsStack({
      value: address,
      type,
    });
  };

  /**
   * Founds a variable in
   *
   * @param {directory} object directory to start checking backwards
   * @param {id} string name of the variable to check
   * @returns
   */
  checkOnPreviousScope = ({ directory, id }) => {
    let back = -1;

    do {
      if (back >= 0)
        directory =
          this.previousDirectoriesStack[
            this.previousDirectoriesStack.length - back - 1
          ];

      back++;
      if (directory?.varsDirectory[id]) return directory.varsDirectory[id];
    } while (directory);
  };

  addGoSub = ({ functionName }) => {
    const validated = this.validateId({ id: functionName });

    this.quadruples.jumpStack.push(validated.target);
    this.quadruples.operatorsStack.push(this.quadruples.operators.GOSUB);
    this.quadruples.checkOperation({ priority: -3 });
  };

  validateReturn = ({ returnType, func }) => {
    if (returnType !== func.type)
      throw new Error(`
    ${this.lineError()} Function ${chalk.blue(
        func.name
      )} expected to return ${chalk.green(
        func.type
      )} type but it returns ${chalk.red(returnType)} instead.
      `);
  };
}

module.exports = Semantics;
