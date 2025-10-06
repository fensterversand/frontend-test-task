<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
    <div class="lg:col-span-2">
      <slot name="main" />
    </div>

    <div class="space-y-6 lg:col-span-1">
      <slot name="sidebar" />
    </div>
  </div>
</template>
