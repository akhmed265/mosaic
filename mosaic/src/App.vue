<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
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
  margin-top: 70px;
  min-height: calc(100vh - 70px);
}
</style>