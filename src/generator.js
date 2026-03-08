"use strict";

function* fibonacciGenerator() {
  let [prev, curr] = [0, 1];

  while (true) {
    yield curr;

    let next = prev + curr;
    prev = curr;
    curr = next;
  }
}

module.exports = { fibonacciGenerator };
