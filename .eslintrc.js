module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
    jquery: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "linebreak-style": [
      "error",
      process.platform === "win32" ? "windows" : "unix",
    ],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    eqeqeq: "error", // Require the use of === and !==
    "no-trailing-spaces": "error", // Disallow trailing whitespace at the end of lines
    "object-curly-spacing": ["error", "always"], // Enforce consistent spacing inside braces
    "arrow-spacing": ["error", { before: true, after: true }], // Enforce consistent spacing before and after the arrow in arrow functions
    "space-infix-ops": ["error", { int32Hint: false }], // Ensure there are spaces around infix operators.
  },
};
