<template>
  <div id="app">
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<style lang="scss">
@import '@/styles/variables.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: $font-family;
  background: $bg-dark;
  color: $text-light;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  background: $bg-dark;
}

.main-content {
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  background: $bg-dark;
  min-height: 100vh;
}

.sidebar--collapsed ~ .main-content {
  margin-left: 80px;
}
</style>