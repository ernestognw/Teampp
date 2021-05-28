const { types } = require("./utils");
const { INT, FLOAT, CHAR, BOOLEAN, STRING } = types;

class Memory {
  constructor() {
    this.addresses = {};
    this.segments = {
      GLOBAL: "global",
      LOCAL: "local",
      STACK: "stack",
      TEMP: "temp",
    };
    this.map = {
      [this.segments.GLOBAL]: {
        [INT]: {
          pointer: 5000,
          low: 5000,
          high: 9999,
        },
        [FLOAT]: {
          pointer: 10000,
          low: 10000,
          high: 14999,
        },
        [CHAR]: {
          pointer: 15000,
          low: 15000,
          high: 19999,
        },
        [BOOLEAN]: {
          pointer: 20000,
          low: 20000,
          high: 24999,
        },
        [STRING]: {
          pointer: 25000,
          low: 25000,
          high: 29999,
        },
      },
      [this.segments.LOCAL]: {
        [INT]: {
          pointer: 30000,
          low: 30000,
          high: 34999,
        },
        [FLOAT]: {
          pointer: 35000,
          low: 35000,
          high: 39999,
        },
        [CHAR]: {
          pointer: 40000,
          low: 40000,
          high: 44999,
        },
        [BOOLEAN]: {
          pointer: 45000,
          low: 45000,
          high: 49999,
        },
        [STRING]: {
          pointer: 50000,
          low: 50000,
          high: 54999,
        },
      },
      [this.segments.STACK]: {
        [INT]: {
          pointer: 55000,
          low: 55000,
          high: 59999,
        },
        [FLOAT]: {
          pointer: 60000,
          low: 60000,
          high: 64999,
        },
        [CHAR]: {
          pointer: 65000,
          low: 65000,
          high: 69999,
        },
        [BOOLEAN]: {
          pointer: 70000,
          low: 70000,
          high: 74999,
        },
        [STRING]: {
          pointer: 75000,
          low: 75000,
          high: 79999,
        },
      },
      [this.segments.TEMP]: {
        [INT]: {
          pointer: 80000,
          low: 80000,
          high: 84999,
        },
        [FLOAT]: {
          pointer: 85000,
          low: 85000,
          high: 89999,
        },
        [CHAR]: {
          pointer: 90000,
          low: 90000,
          high: 94999,
        },
        [BOOLEAN]: {
          pointer: 95000,
          low: 95000,
          high: 99999,
        },
        [STRING]: {
          pointer: 100000,
          low: 100000,
          high: 104999,
        },
      },
    };
  }

  /**
   * Increase temporary map pointer and returns the last available address
   * @param {string} type of the variable
   * @param {string} segment of of variables
   * @returns address
   */
  getAddress = ({ type, segment }) => {
    const map = this.map[segment][type];
    const address = map.pointer;

    if (address > map.high) throw new Error("Too many variables");

    this.map[segment][type].pointer++;

    return address;
  };
}

module.exports = Memory;
