import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";
import path from "path";

const { publicVars } = loadEnv();

console.log("environment variables", publicVars);

export default defineConfig({
  plugins: [pluginVue()],
  server: {
    port: Number(process.env.PUBLIC_DEV_PORT),
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "src/shared"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
});
