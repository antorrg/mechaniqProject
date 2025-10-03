module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["standard-with-typescript"],
  parserOptions: {
    project: "./tsconfig.eslint.json"
  },
  rules: {
    "@typescript-eslint/indent": ["error", 2],
    // Puedes agregar reglas personalizadas aquí si lo deseas
    // Por ejemplo:
    // 'semi': ['error', 'never'],
    // 'quotes': ['error', 'single']
  }
};
