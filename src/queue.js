function createBiDirectionalPriorityQueue() {
  let idCounter = 0;

  const map = new Map();
  let head = null;
  let tail = null;
  const sorted = [];

  function createNode(item, priority) {
    return {
      id: idCounter++,
      item,
      priority,
      prev: null,
      next: null,
    };
  }

  function addToList(node) {
    if (!tail) {
      head = tail = node;
      return;
    }

    tail.next = node;
    node.prev = tail;
    tail = node;
  }

  function insertToSorted(node) {
    let i = 0;

    while (i < sorted.length && sorted[i].priority < node.priority) {
      i++;
    }

    sorted.splice(i, 0, node);
  }

  function removeFromSorted(node) {
    const index = sorted.findIndex((n) => n.id === node.id);
    if (index !== -1) sorted.splice(index, 1);
  }

  function removeFromList(node) {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      tail = node.prev;
    }
  }

  function removeNode(node) {
    removeFromList(node);
    removeFromSorted(node);
    map.delete(node.id);
  }

  function enqueue(item, priority) {
    const node = createNode(item, priority);

    map.set(node.id, node);
    addToList(node);
    insertToSorted(node);
  }

  function peek(type) {
    if (!head) return null;

    if (type === "highest") {
      return sorted[sorted.length - 1].item;
    }

    if (type === "lowest") {
      return sorted[0].item;
    }

    if (type === "oldest") {
      return head.item;
    }

    if (type === "newest") {
      return tail.item;
    }

    throw new Error("Invalid peek type");
  }

  function dequeue(type) {
    if (!head) return null;

    let node;

    if (type === "highest") {
      node = sorted[sorted.length - 1];
    } else if (type === "lowest") {
      node = sorted[0];
    } else if (type === "oldest") {
      node = head;
    } else if (type === "newest") {
      node = tail;
    } else {
      throw new Error("Invalid dequeue type");
    }

    removeNode(node);
    return node.item;
  }

  return {
    enqueue,
    peek,
    dequeue,
  };
}

const queue = createBiDirectionalPriorityQueue();

queue.enqueue("task1", 3);
queue.enqueue("task2", 1);
queue.enqueue("task3", 5);

console.log(queue.peek("highest"));
console.log(queue.peek("lowest"));

console.log(queue.dequeue("oldest"));
console.log(queue.dequeue("newest"));

console.log(queue.peek("highest"));
