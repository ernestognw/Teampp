const chalk = require("chalk");
const Quadruples = require("./quadruples.js");
const { genericTypes, inverseGenericTypes } = require("./utils");

class Semantics {
  constructor(grammar) {
    this.grammar = grammar;

    this.main = {
      varsDirectory: {},
    };
    this.currentDirectory = this.main;
    this.currentType = null;
    this.pendingVars = [];
    this.previousDirectoriesStack = [];
    this.currentVariableStack = [];
    this.isPointPending = false;
    this.pointsAdvanced = 0;

    this.genericTypes = genericTypes;

    this.quadruples = new Quadruples(this);
  }

  /**
   * Add variable to the current directory
   *
   * @param {id} string identifier of the variable
   * @param {type} string type of variable
   * @param {addNextLevel} boolean whether is going to start a new sub variable directory
   * @param {isFunction} boolean whether the variable is for a function or not
   * @param {dimensions} number number of dimensions for the variable
   */
  addVar = ({
    id,
    type,
    isFunction = false,
    addNextLevel = false,
    dimensions = 0,
  }) => {
    const typeExists = this.validateGenericType({ type });

    let varsDirectory = {};

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

    this.currentDirectory.varsDirectory[id] = {
      name: id,
      type,
      isFunction,
      dimensions,
      varsDirectory,
      previousDirectory: this.currentDirectory,
    };

    if (addNextLevel) {
      this.previousDirectoriesStack.push(this.currentDirectory);
      this.currentDirectory = this.currentDirectory.varsDirectory[id];
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
  validateGenericType = ({ type }) => !!inverseGenericTypes[type];

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
   * @returns {toCheck} object variable directory
   */
  validateId = ({ id, expectedType }) => {
    const scope = this.currentDirectory.name;

    let directory = this.currentDirectory;
    let toCheck = this.currentDirectory.varsDirectory[id];

    while (!toCheck && directory) {
      directory = directory.previousDirectory;
      if (directory) {
        toCheck = directory.varsDirectory[id];
      }
    }

    if (!toCheck) {
      throw new Error(
        `${this.lineError()} Identifier ${chalk.blue(
          id
        )} not declared neither in ${chalk.red(scope)} scope.`
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
        dimensionsToCheck: this.currentVariableStack[
          this.currentVariableStack.length - 1
        ].dimensionsToCheck,
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
   * Resets current variable at the end of a variable use and checks if dimensions
   * are correct
   */
  resetCurrentVariable = () => {
    let currentVariable = this.getCurrentVariable();

    if (currentVariable.dimensions !== currentVariable.dimensionsToCheck) {
      throw new Error(
        `${this.lineError()} Identifier ${chalk.blue(
          currentVariable.name
        )} is trying to use ${chalk.red(
          currentVariable.dimensionsToCheck
        )} dimensions but has ${chalk.green(currentVariable.dimensions)}.`
      );
    }

    for (let i = 0; i < this.pointsAdvanced + 1; i++) {
      this.currentVariableStack.pop();
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
    this.getCurrentVariable().dimensionsToCheck++;
  };

  /**
   * Takes a directory, COPIES IT, and remove the references so it can be logged in console
   * for debugging purposes
   *
   * @param {directory} object Directory to copy
   */
  removePreviousDirectories = (directory) => {
    // If directory has no varsDirectory, it is a varsDirectory
    if (!directory.varsDirectory) {
      const keys = Object.keys(directory);

      // When is a varsDirectory, it could be empty, in that case, we just return empty
      if (keys.length === 0) return {};

      // Otherwise we return the variables with the previousDirectories removed
      return keys.reduce((acc, key) => {
        acc[key] = { ...this.removePreviousDirectories(directory[key]) };
        return acc;
      }, {});
    }

    // If it has a varsDirectory, it is a variable directory
    // with a previousDirectory so we remove it
    delete directory.previousDirectory;

    return {
      ...directory,
      varsDirectory: {
        ...this.removePreviousDirectories(directory.varsDirectory),
      },
    };
  };

  /**
   * Returns a generic error string with the line in which the error was detected
   */
  lineError = () =>
    `Semantic error at line ${chalk.yellow(this.grammar.yylineno)}.`;
}

module.exports = Semantics;
