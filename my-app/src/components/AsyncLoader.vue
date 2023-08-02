<template>
  <Suspense>
    <slot />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
