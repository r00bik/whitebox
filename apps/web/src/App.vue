<script setup lang="ts">
  import { cn } from "@shared/utils/cn";
  import ContrastButton from "@volt/ContrastButton.vue";
  import DangerButton from "@volt/DangerButton.vue";
  import DefaultButton from "@volt/DefaultButton.vue";
  import SecondaryButton from "@volt/SecondaryButton.vue";
</script>

<template>
  <div :class="cn('flex')">
    <DefaultButton>Default</DefaultButton>
    <DangerButton>Danger</DangerButton>
    <ContrastButton>Contrast</ContrastButton>
    <SecondaryButton>Secondary</SecondaryButton>
  </div>
</template>
