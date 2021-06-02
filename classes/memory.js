const { genericTypes } = require("./utils");
const { INT, FLOAT, CHAR, BOOLEAN, STRING, VOID } = genericTypes;

class Memory {
  constructor() {
    this.addresses = {};
    this.segments = {
      GLOBAL: "global",
      LOCAL: "local",
      STACK: "stack",
      TEMP: "temp",
      FUNCTION: "function",
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
        [VOID]: {
          pointer: 55000,
          low: 55000,
          high: 59999,
        },
      },
      [this.segments.STACK]: {
        [INT]: {
          pointer: 60000,
          low: 60000,
          high: 64999,
        },
        [FLOAT]: {
          pointer: 65000,
          low: 65000,
          high: 69999,
        },
        [CHAR]: {
          pointer: 70000,
          low: 70000,
          high: 74999,
        },
        [BOOLEAN]: {
          pointer: 75000,
          low: 75000,
          high: 79999,
        },
        [STRING]: {
          pointer: 80000,
          low: 80000,
          high: 84999,
        },
        [VOID]: {
          pointer: 85000,
          low: 85000,
          high: 89999,
        },
      },
      [this.segments.TEMP]: {
        [INT]: {
          pointer: 90000,
          low: 90000,
          high: 94999,
        },
        [FLOAT]: {
          pointer: 95000,
          low: 95000,
          high: 99999,
        },
        [CHAR]: {
          pointer: 100000,
          low: 100000,
          high: 104999,
        },
        [BOOLEAN]: {
          pointer: 105000,
          low: 105000,
          high: 109999,
        },
        [STRING]: {
          pointer: 110000,
          low: 110000,
          high: 114999,
        },
      },
      [this.segments.FUNCTION]: {
        [INT]: {
          pointer: 115000,
          low: 115000,
          high: 119999,
        },
        [FLOAT]: {
          pointer: 120000,
          low: 120000,
          high: 124999,
        },
        [CHAR]: {
          pointer: 125000,
          low: 125000,
          high: 129999,
        },
        [BOOLEAN]: {
          pointer: 130000,
          low: 130000,
          high: 134999,
        },
        [STRING]: {
          pointer: 135000,
          low: 135000,
          high: 139999,
        },
      },
    };
  }

  /**
   * Increase temporary map pointer and returns the last available address
   * @param {string} type of the variable
   * @param {string} segment of variables
   * @param {number} advance addresses to occupy
   * @returns address
   */
  getAddress = ({ type, segment, advance = 1 }) => {
    const map = this.map[segment][type];
    const address = map.pointer;

    this.map[segment][type].pointer += advance;

    if (this.map[segment][type].pointer > map.high)
      throw new Error("Too many variables");

    return address;
  };
}

module.exports = Memory;
