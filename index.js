const { readFileSync } = require("fs");
const { Parser } = require("jison");

const filepaths = process.argv.slice(2);

const files = filepaths.map((filepath) => readFileSync(filepath, "utf8"));

if (!files || files.length === 0) {
  console.log("Files missing");
  return;
}

const grammar = readFileSync("./grammar.jison", "utf8");
const parser = new Parser(grammar);

files.forEach((file) => {
  try {
    parser.parse(file);
  } catch (err) {
    console.log(err);
  }
});
