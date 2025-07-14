import PrimeVue from "primevue/config";
import { type App, type Component, createApp } from "vue";

export const initApp = async (
  entryComponent: Component,
  _config?: object,
): Promise<App<Element>> => {
  const app = createApp(entryComponent);
  app.use(PrimeVue, {
    unstyled: true,
  });

  return app;
};
