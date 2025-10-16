<template>
  <div id="app">
    <Sidebar />
    <main class="main-content">
      <HeroSection />
      <CoursesSection />
      <div class="content">
        <div class="container">
          <!-- Здесь будем добавлять контент страницы -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import CoursesSection from '@/components/sections/CoursesSection.vue'
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

.content {
  padding: 2rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    
    h1 {
      color: $text-light;
      margin-bottom: 1rem;
      font-size: 2rem;
    }
    
    p {
      color: $text-muted;
      font-size: 1.1rem;
    }
  }
}

// Адаптивность для скрытого меню
.sidebar--collapsed ~ .main-content {
  margin-left: 80px;
}

// Убираем отступы у контейнеров секций
section {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}
</style>