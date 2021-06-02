const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const { copySync } = require('fs-extra')
const { Parser } = require("jison");

const grammar = readFileSync("./grammar.jison", "utf8");
const parser = new Parser(grammar);

const dirname = "./dist";

if (!existsSync(dirname)) mkdirSync(dirname);

copySync("./classes", "./dist/classes", { overwrite: true });
writeFileSync(`${dirname}/raw.js`, parser.generate());
