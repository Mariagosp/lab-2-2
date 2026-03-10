const { fibonacciGenerator, iteratorWithTimeout } = require("lab2");

const fib = fibonacciGenerator();

iteratorWithTimeout(fib, 2);