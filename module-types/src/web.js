import { add } from "./lib";

window.onload = () => {
  const sum = add(1, 2);

  document.body.innerText = sum;
};
