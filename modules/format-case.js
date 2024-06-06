const toCamelCase = (value) => {
  const pattern = /([_-]+\w)/;
  const repl = /[_-]+/;
  const preUnderScore = /^[_-]/;
  if (typeof value === "string") {
    if (preUnderScore.test(value)) return value;
    const fVal = pattern.test(value)
      ? value
          .split(pattern)
          .map((str) =>
            pattern.test(str) ? str.replace(repl, "").toUpperCase() : str
          )
          .join("")
      : value;
    return fVal;
  } else if (value && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value).map(([key, value]) => {
      const fkey =
        pattern.test(key) && !preUnderScore.test(key)
          ? key
              .split(pattern)
              .map((str) =>
                pattern.test(str) ? str.replace(repl, "").toUpperCase() : str
              )
              .join("")
          : key;
      return [fkey, value];
    });
    return Object.fromEntries(entries);
  } else {
    return value;
  }
};

const toUnderScore = (value) => {
  const pattern = /([A-Z])/;
  const constant = /^[A-Z]/;
  if (typeof value === "string") {
    if (constant.test(value)) return value;
    const fVal = pattern.test(value)
      ? value
          .split(pattern)
          .map((str) => (pattern.test(str) ? "_" + str.toLowerCase() : str))
          .join("")
      : value;
    return fVal;
  } else if (value && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value).map(([key, value]) => {
      const fkey =
        pattern.test(key) || !constant.test(key)
          ? key
              .split(pattern)
              .map((str) => (pattern.test(str) ? "_" + str.toLowerCase() : str))
              .join("")
          : key;
      return [fkey, value];
    });
    return Object.fromEntries(entries);
  } else {
    return value;
  }
};
module.exports = { toCamelCase, toUnderScore };
