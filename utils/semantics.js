const chalk = require("chalk");

class Semantics {
  constructor(parentCtx) {
    this.parentCtx = parentCtx;

    this.genericTypes = {
      PROGRAM: "program",
      CLASS: "class",
      INT: "int",
      FLOAT: "float",
      CHAR: "char",
      VOID: "void",
    };
    this.main = {
      varsDirectory: {},
    };
    this.currentDirectory = this.main;
    this.currentType = null;
    this.pendingVars = [];
    this.globalDirectory = null;
    this.prevDirectoriesStack = [];
    this.currentVariableStack = [];
    this.currentVariableDimensionsToCheckStack = [];
    this.isPointPending = false;
    this.pointsAdvanced = 0;
    // this.tmpDimensionsToCheck = 0;
  }

  /**
   * Add variable to the current directory
   *
   * @param {id} string identifier of the variable
   * @param {type} string type of variable
   * @param {addNextLevel} boolean whether is going to start a new sub variable directory
   * @param {isFunction} boolean whether the variable is for a function or not
   * @param {isGlobal} boolean whether to set this variable as the global directory. Can only be used once
   */
  addVar = ({
    id,
    type,
    isFunction = false,
    addNextLevel = false,
    isGlobal = false,
    dimensions = 0,
  }) => {
    const typeExists = this.validateGenericType({ type });

    let varsDirectory = {};

    if (!typeExists) {
      const { varsDirectory: classVarsDirectory } = this.validateId({
        id: type,
        expectedType: this.genericTypes.CLASS,
      });

      // When type is not generic, it is needed to copy a pointer to the varsDirectory
      // of the variable, since they will not change, and will be useful to address
      // future calls such as foo.bar
      varsDirectory = { ...classVarsDirectory };
    }

    if (!!this.currentDirectory.varsDirectory[id]) {
      throw new Error(
        `Variable ${chalk.red(id)} already exists in ${chalk.blue(
          this.currentDirectory.name
        )} scope`
      );
    }

    this.currentDirectory.varsDirectory[id] = {
      name: id,
      type,
      isFunction,
      dimensions,
      varsDirectory,
      // previousDirectory: this.currentDirectory
    };

    if (addNextLevel) {
      this.prevDirectoriesStack.push(this.currentDirectory);
      this.currentDirectory = this.currentDirectory.varsDirectory[id];
    }

    if (isGlobal) {
      if (this.globalDirectory)
        throw new Error("Cannot define global directory twice");
      this.globalDirectory = this.currentDirectory;
    }
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
  validateGenericType = ({ type }) =>
    Object.values(this.genericTypes).some((value) => value === type);

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
   * If variable is not present at current directory, it will try to use globalDirectory
   *
   * @param {id} string id of the variable
   * @param {expectedType} string the type that the variable is expected to have
   * @returns {toCheck} object variable directory
   */
  validateId = ({ id, expectedType }) => {
    let toCheck = this.currentDirectory.varsDirectory[id];
    const scope = this.currentDirectory.name;

    if (!toCheck) {
      // Try global scope
      toCheck = this.globalDirectory.varsDirectory[id];
    }

    if (!toCheck) {
      throw new Error(
        `Identifier ${chalk.blue(
          id
        )} not declared neither in global or ${chalk.red(
          scope
        )} scope at line ${this.parentCtx.yylineno}.`
      );
    }

    if (expectedType && toCheck.type !== expectedType) {
      throw new Error(
        `Identifier ${chalk.blue(id)} is not of type ${chalk.yellow(
          expectedType
        )}, but is ${chalk.red(toCheck.type)} line ${
          lithis.parentCtx.yylineno
        }.`
      );
    }

    return toCheck;
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
    this.currentDirectory = this.prevDirectoriesStack.pop();
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

    let currentVariable = this.currentVariableStack[
      this.currentVariableStack.length - 1
    ];

    const toCheck = currentVariable.varsDirectory[id];
    const variableName = currentVariable.name;

    if (!toCheck) {
      throw new Error(
        `Error at line ${this.parentCtx.yylineno}. Identifier ${chalk.blue(
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
      this.currentVariableStack.push(variable);
      this.currentVariableDimensionsToCheckStack.push(0);
    } else {
      this.currentVariableStack[
        this.currentVariableStack.length - 1
      ] = variable;
    }

    this.isPointPending = false; // At this point, every point needed decisions were made. So reset
  };

  /**
   * Resets current variable at the end of a variable use and checks if dimensions
   * are correct
   */
  resetCurrentVariable = () => {
    let currentVariable = this.currentVariableStack[
      this.currentVariableStack.length - 1
    ];
    let currentVariableDimensionsToCheck = this
      .currentVariableDimensionsToCheckStack[
      this.currentVariableDimensionsToCheckStack.length - 1
    ];

    console.log(this.currentVariableStack);

    if (currentVariable.dimensions !== currentVariableDimensionsToCheck) {
      throw new Error(
        `Error at line ${this.parentCtx.yylineno}. Identifier ${chalk.blue(
          currentVariable.name
        )} is trying to use ${chalk.red(
          currentVariableDimensionsToCheck
        )} dimensions but has ${chalk.green(currentVariable.dimensions)}`
      );
    }

    for (let i = 0; i < this.pointsAdvanced + 1; i++) {
      this.currentVariableStack.pop();
      this.currentVariableDimensionsToCheckStack.pop();
      this.pointsAdvanced = 0;
    }
  };

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
    this.currentVariableDimensionsToCheckStack[
      this.currentVariableDimensionsToCheckStack.length - 1
    ]++;
  };
}

module.exports = Semantics;
