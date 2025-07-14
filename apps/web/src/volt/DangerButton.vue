<template>
  <Button
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </Button>
</template>

<script setup lang="ts">
  import clsx from "clsx";
  import Button, { type ButtonPassThroughOptions, type ButtonProps } from "primevue/button";
  import { ref } from "vue";

  import { ptViewMerge } from "./utils";

  type Props = /* @vue-ignore */ ButtonProps & {};
  defineProps<Props>();

  const theme = ref<ButtonPassThroughOptions>({
    root: clsx(
      // Базовые стили
      [
        "relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md",
        "border border-red-500 bg-red-500 px-3 py-2 text-white",
        "transition-colors duration-200 select-none",
      ],
      // Состояния
      [
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-red-500",
        "enabled:hover:border-red-600 enabled:hover:bg-red-600 enabled:hover:text-white",
        "enabled:active:border-red-700 enabled:active:bg-red-700 enabled:active:text-white",
        "disabled:pointer-events-none disabled:opacity-60",
        "dark:border-red-400 dark:bg-red-400 dark:text-red-950 dark:focus-visible:outline-red-400",
        "dark:enabled:hover:border-red-300 dark:enabled:hover:bg-red-300 dark:enabled:hover:text-red-950",
        "dark:enabled:active:border-red-200 dark:enabled:active:bg-red-200 dark:enabled:active:text-red-950",
      ],
      // Варианты размера и формы
      [
        "p-small:px-[0.625rem] p-small:py-[0.375rem] p-small:text-sm",
        "p-large:px-[0.875rem] p-large:py-[0.625rem] p-large:text-[1.125rem]",
        "p-fluid:w-full p-vertical:flex-col",
        "p-icon-only:w-10 p-icon-only:gap-0 p-icon-only:px-0 p-fluid:p-icon-only:w-10",
        "p-rounded:rounded-[2rem] p-icon-only:p-rounded:h-10 p-icon-only:p-rounded:rounded-full",
        "p-raised:shadow-sm",
      ],
      // Outlined
      [
        "p-outlined:border-red-200 p-outlined:bg-transparent p-outlined:text-red-500",
        "enabled:hover:p-outlined:border-red-200 enabled:hover:p-outlined:bg-red-50 enabled:hover:p-outlined:text-red-500",
        "enabled:active:p-outlined:border-red-200 enabled:active:p-outlined:bg-red-100 enabled:active:p-outlined:text-red-500",
        "dark:p-outlined:border-red-700 dark:p-outlined:bg-transparent dark:p-outlined:text-red-400",
        "dark:enabled:hover:p-outlined:border-red-700 dark:enabled:hover:p-outlined:bg-red-400/5 dark:enabled:hover:p-outlined:text-red-400",
        "dark:enabled:active:p-outlined:border-red-700 dark:enabled:active:p-outlined:bg-red-400/15 dark:enabled:active:p-outlined:text-red-400",
      ],
      // Text
      [
        "p-text:border-transparent p-text:bg-transparent p-text:text-red-500",
        "enabled:hover:p-text:border-transparent enabled:hover:p-text:bg-red-50 enabled:hover:p-text:text-red-500",
        "enabled:active:p-text:border-transparent enabled:active:p-text:bg-red-100 enabled:active:p-text:text-red-500",
        "dark:p-text:border-transparent dark:p-text:bg-transparent dark:p-text:text-red-400",
        "dark:enabled:hover:p-text:border-transparent dark:enabled:hover:p-text:bg-red-400/5 dark:enabled:hover:p-text:text-red-400",
        "dark:enabled:active:p-text:border-transparent dark:enabled:active:p-text:bg-red-400/15 dark:enabled:active:p-text:text-red-400",
      ],
    ),
    loadingIcon: clsx(``),
    icon: clsx(`p-right:order-1 p-bottom:order-2`),
    label: clsx(
      `font-medium p-small:text-sm p-large:text-[1.125rem] p-icon-only:invisible p-icon-only:w-0`,
    ),
    pcBadge: {
      root: clsx(`h-4 min-w-4 leading-4`),
    },
  });
</script>
