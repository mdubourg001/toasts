const memoize = fun => {
  const cache = {};

  return (...args) => {
    const key = JSON.stringify(...args);

    if (!cache[key]) cache[key] = fun(...args);

    return cache[key];
  };
};

const measure = fun => {
  return (...args) => {
    const start = new Date();
    const result = fun(...args);
    console.debug(new Date() - start);

    return result;
  };
};

// ======= //

const square = n => {
  let total = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      total++;
    }
  }
  return total;
};

const memoSquare = memoize(square);

measure(square)(40000);
measure(square)(40000);

measure(memoSquare)(40000);
measure(memoSquare)(40000);
