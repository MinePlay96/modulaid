module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "strauss-cleanone-typescript",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    project: "tsconfig.json"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
