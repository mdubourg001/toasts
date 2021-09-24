export class Callstack {
  arr: string[] = [];
  step: number = 0;

  push(el) {
    this.arr.push(el);
    this.step++;

    console.log(`[STEP ${this.step}]`);
    console.log(this.toString());
  }

  pop() {
    this.arr.pop();
  }

  toString() {
    let res = "";
    const ordered = [...this.arr].reverse();

    res += "-".repeat(this.longestTaskName + 4) + "\n";
    for (const task of ordered) {
      res += `  ${task}  \n`;
      res += "-".repeat(this.longestTaskName + 4) + "\n";
    }

    return res;
  }

  get longestTaskName() {
    if (this.arr.length === 0) {
      return 0;
    }

    return [...this.arr].sort((a, b) => (a.length > b.length ? -1 : 1))[0]
      .length;
  }
}
