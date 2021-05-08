const types = {
  INT: "int",
  FLOAT: "float",
  CHAR: "char",
  BOOLEAN: "boolean",
};

const genericTypes = {
  PROGRAM: "program",
  CLASS: "class",
  VOID: "void",
  ...types,
};

const inverseTypes = Object.entries(types).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const inverseGenericTypes = Object.entries(genericTypes).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {}
);

module.exports = { types, inverseTypes, genericTypes, inverseGenericTypes };
