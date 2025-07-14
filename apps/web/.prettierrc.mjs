import prettierConfig from "../../.prettierrc.mjs";
// import prettierPluginTailwindcss from "prettier-plugin-tailwindcss";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...prettierConfig,
  // plugins: [prettierPluginTailwindcss],
};

export default config;
