<template>
  <div class="home-view">
    <HeroSection />
    <CoursesSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue'
import CoursesSection from '@/components/sections/CoursesSection.vue'
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}
</style>