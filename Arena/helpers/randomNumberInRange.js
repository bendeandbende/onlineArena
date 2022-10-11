module.exports = randomNumberInRange = (range) => {
  const [min, max] = range.split('-').map((a) => +a);

  return Math.floor(Math.random() * (max - min + 1) + min);
};
