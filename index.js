const { readFileSync } = require('fs');
const { Parser } = require('jison');

const filepaths = process.argv.slice(2)

const files = filepaths.map(filepath => readFileSync(filepath, 'utf8'))

if (!files || files.length === 0) {
  console.log('Files missing')
  return;
}

const bnf = readFileSync('grammar.jison', 'utf8');
const parser = new Parser(bnf);

files.forEach(file => parser.parse(file))
