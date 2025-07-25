/// <reference types="@rsbuild/core/types" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  // biome-ignore lint/complexity/noBannedTypes: reason
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
