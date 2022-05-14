const getRandomInteger = (a, b) => {
  const minNum = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const maxNum = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
};

const getRandomFloat = (a, b, decimal = 1) => {
  const minNum = Math.min(Math.abs(a), Math.abs(b));
  const maxNum = Math.max(Math.abs(a), Math.abs(b));
  return parseFloat((Math.random() * (maxNum - minNum) + minNum).toFixed(decimal));
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];


export {getRandomInteger, getRandomFloat, getRandomArrayElement};
