export const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getFloatRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const ParseToNum = (str1, str2) => {
  let combined;

  if (str2) {
    combined = parseFloat(str1) + parseFloat(str2);
  } else {
    combined = parseFloat(str1);
  }
  return combined.toFixed(1);
};

export const checkIfExists = (date, arr) => {
  let isExist = arr.some(el => {
    return Math.abs(el.options.date - date) > 300;
  });
  return isExist;
};

export const hsla = (h, s, l, a) => {
  return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
};

export const hasClass = (el, className) => {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
  }
};

export const addClass = (el, className) => {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += " " + className;
  }
};
