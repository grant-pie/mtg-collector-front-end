<template>
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      
      <div class="container mx-auto px-4 py-8">
        <slot />
      </div>
      
      <footer class="bg-gray-800 text-white p-4 mt-8">
        <div class="container mx-auto text-center">
          &copy; {{ new Date().getFullYear() }} MTG Collector
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import Navbar from '~/components/Layout/Navbar.vue';
  </script>