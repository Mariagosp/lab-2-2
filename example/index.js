const { fibonacciGenerator, iteratorWithTimeout } = require("../src");

const fib = fibonacciGenerator();

iteratorWithTimeout(fib, 1);