<!-- components/Layout/Header.vue -->
<template>
    <header class="bg-blue-700 text-white p-6">
      <div class="container mx-auto">
        <h1 class="text-3xl font-bold">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 text-lg">{{ subtitle }}</p>
      </div>
    </header>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  });
  </script>