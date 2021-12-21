import { add, substract } from "./maths/index";

const command = process.argv[2];
const args = process.argv.slice[3];

if (command === "add") {
  const sum = add(...args);
  console.log(sum);
}
//
else if (command === "substract") {
  const sum = substract(...args);
  console.log(sum);
}
//
else {
  throw "Unknown command.";
}
