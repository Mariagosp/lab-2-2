function iteratorWithTimeout(iterator, durationSeconds) {
  const durationInMiliseconds = durationSeconds * 1000;
  let sum = 0;

  const interval = setInterval(() => {
    const number = iterator.next().value;
    sum += number;
    console.log(`Number is ${number}!\nSum is ${sum}`);
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    console.log("\nTime`s up");
  }, durationInMiliseconds);
}

module.exports = { iteratorWithTimeout };
