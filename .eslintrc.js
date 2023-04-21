module.exports = {
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  extends: [
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off", // disable this rule if needed
    "@typescript-eslint/no-explicit-any": "off", // disable this rule if needed
    "@typescript-eslint/no-unused-vars": "warn", // warning for unused variables
    "no-console": "error", // disallow console.log
    "no-unused-vars": "warn", // disallow unused variables
    "semi": ["error", "always"], // require semicolons at end of statement
    "quotes": ["error", "double"], // require single quotes for strings
    "linebreak-style": ["error", "unix"], // require Unix line endings
    "no-trailing-spaces": "error", // disallow trailing spaces
    "comma-dangle": ["error", "never"], // disallow trailing commas in object literals
  }
};