import esprima from "esprima";

import { Callstack } from "./callstack";

const program = `
  async function baz() {
    console.log('baz');
  }

  "totote";
  1+2+3;

  console.log('foo');
  console.log('bar');

  baz();
`;

const tree = esprima.parseScript(program, { range: true });
const callstack = new Callstack();
const heap = new Set();

function handleStatement(statement) {
  if (statement.type === esprima.Syntax.ExpressionStatement) {
    callstack.push(program.slice(...statement.range));
  } else if (statement.type === esprima.Syntax.CallExpression) {
    // handleStatement()
  }

  callstack.pop();
}

function handleBody(body) {
  for (const expression of tree.body) {
    handleStatement(statement);
  }
}

handleBody(program);

console.log(tree);
