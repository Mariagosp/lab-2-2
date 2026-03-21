function memoize(fn, options = {}) {
  const cache = new Map();

  const maxSize = options.maxSize || Infinity;
  const ttl = options.ttl || null;
  const policy = options.policy || "LRU";
  const customEvict = options.eviction;

  function getSize() {
    return cache.size;
  }

  function evict() {
    if (customEvict) {
      customEvict(cache);
      return;
    }

    let keyToDelete = null;

    if (policy === "LRU") {
      // least Recently used
      let oldestTime = Infinity;

      for (const [key, _] of cache) {
        if (cache[key]?.lastUsed < oldestTime) {
          oldestTime = cache[key].lastUsed;
          keyToDelete = key;
        }
      }
    }

    if (policy === "LFU") {
      // least Frequently used
      let minCount = Infinity;

      for (const [key, entry] of cache) {
        if (cache[key].frequency < minCount) {
          minCount = cache[key].frequency;
          keyToDelete = key;
        }
      }
    }

    if (keyToDelete !== null) {
      delete cache[keyToDelete];
    }
  }

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const entry = cache.get(key);

      if (ttl && Date.now() - entry.createdAt > ttl) {
        console.log("ttl is up!");

        cache.delete(key);
      } else {
        console.log("take from cache");

        entry.lastUsed = Date.now();
        entry.frequency++;

        return entry.value;
      }
    }

    const result = fn(...args);

    console.log("count from 0");
    cache.set(key, {
      value: result,
      lastUsed: Date.now(),
      frequency: 1,
      createdAt: Date.now(),
    });

    if (getSize() > maxSize) {
      evict();
    }

    return result;
  };
}

function slowAdd(a, b) {
  console.log("Counting...");

  return a + b;
}

const fastAdd = memoize(slowAdd, {
  maxSize: 2,
  policy: "LRU",
  ttl: 1,
});

console.log(fastAdd(2, 3));
console.log(fastAdd(2, 3));
console.log(fastAdd(4, 5));
console.log(fastAdd(6, 7));
console.log(fastAdd(2, 3));

module.exports = { memoize };
