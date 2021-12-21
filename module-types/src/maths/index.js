function parse(n) {
  const parsed = Number.parseFloat(n, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function add(a, b) {
  return parse(a) + parse(b);
}

export function substract(a, b) {
  return parse(a) - parse(b);
}
