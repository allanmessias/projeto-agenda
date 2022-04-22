/* eslint-disable quotes */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "prefer-arrow-function": 0,
    "prefer-arrow-callback": 0,
    "no-useless-return": 0,
    "no-restricted-syntax": 0,
  },
};
