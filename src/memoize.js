function memoize(fn, options = {}) {
  // 1. створення кешу
  const cache = new Map();
  // 2. налаштування (maxSize, policy, ttl)

  const maxSize = options.maxSize || Infinity;
  const ttl = options.ttl || null;
  const policy = options.policy || "LRU";
  const customEvict = options.eviction;

  function getSize() {
    return cache.size;
  }

  function evict() {
    // якщо є кастомна функція
    if (customEvict) {
      customEvict(cache);
      return;
    }

    let keyToDelete = null;

    // ----- LRU -----
    if (policy === "LRU") {
      let oldestTime = Infinity;

      for (const [key, entry] of cache) {
        if (cache[key]?.lastUsed < oldestTime) {
          oldestTime = cache[key].lastUsed;
          keyToDelete = key;
        }
      }
    }

    // ----- LFU -----
    if (policy === "LFU") {
      let minCount = Infinity;

      for (const [key, entry] of cache) {
        if (cache[key].frequency < minCount) {
          minCount = cache[key].frequency;
          keyToDelete = key;
        }
      }
    }

    // видаляємо
    if (keyToDelete !== null) {
      delete cache[keyToDelete];
    }
  }

  return function (...args) {
    // 3. формування ключа
    const key = JSON.stringify(args);
    // 4. перевірка кешу
    if (cache.has(key)) {
      const entry = cache.get(key);

      if (ttl && Date.now() - entry.createdAt > ttl) {
        console.log("ttl is up!");
        cache.delete(key);
      } else {
        console.log("беру з кешу");
        entry.lastUsed = Date.now();
        entry.frequency++;
        return entry.value;
      }
    }
    // 6. якщо нема → порахувати
    const result = fn(...args);

    // 7. записати в кеш
    console.log("рахую з нуля");
    cache.set(key, {
      value: result,
      lastUsed: Date.now(),
      frequency: 1,
      createdAt: Date.now(),
    });

    // 8. перевірити ліміт і очистити
    if (getSize() > maxSize) {
      evict();
    }

    return result;
  };
}

function slowAdd(a, b) {
  console.log("Рахую...");
  return a + b;
}

const fastAdd = memoize(slowAdd, {
  maxSize: 2,
  policy: "LRU",
  ttl: 1,
});

console.log(fastAdd(2, 3)); // Рахую... → 5
console.log(fastAdd(2, 3)); // 5 (беремо з кешу)
console.log(fastAdd(4, 5)); // Рахую... → 9
console.log(fastAdd(6, 7)); // Рахую... → 13 → видалення LRU
console.log(fastAdd(2, 3)); // Рахую... → 5 (бо попереднє 2,3 видалилося)

module.exports = { memoize };
