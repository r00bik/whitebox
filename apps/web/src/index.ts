import "@assets/styles/primevue.css";
import "@assets/styles/font.css";
import "@assets/styles/tailwind.css";

import { initApp } from "@shared/utils/init-app";

import App from "./App.vue";

(async () => {
  const app = await initApp(App);
  app.mount("#root");
})();
