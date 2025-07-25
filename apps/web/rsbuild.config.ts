import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";

const { publicVars } = loadEnv();

console.log("environment variables", publicVars);

export default defineConfig({
  plugins: [pluginVue()],
  server: {
    port: Number(process.env.PUBLIC_DEV_PORT),
  },
});
