export const numOnly = str => {
  let _value = '';
  for (let i = 0; i < str.length; i++) {
    if (!isNaN(str[i])) {
      _value += str[i];
    }
  }
  return _value;
};
