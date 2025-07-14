/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  vueIndentScriptAndStyle: true,
  embeddedLanguageFormatting: "auto",
  htmlWhitespaceSensitivity: "css",
  singleAttributePerLine: false,
  bracketSameLine: false,
  jsxSingleQuote: false,
};

export default config;
