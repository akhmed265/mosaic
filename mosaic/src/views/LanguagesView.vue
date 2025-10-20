<template>
  <div class="languages-view">
    <div class="container">
      <!-- Заголовок -->
      <div class="page-header">
        <div class="header-decoration">
          <div class="decoration-dot"></div>
          <div class="decoration-line"></div>
        </div>
        <h1>Управление языками</h1>
        <p>Настройте изучаемые языки и отслеживайте свой прогресс</p>
      </div>

      <!-- Основной контент -->
      <div class="languages-content">
        <!-- Левая колонка - управление языками -->
        <div class="left-column">
          <LanguageManager />
        </div>

        <!-- Правая колонка - прогресс и статистика -->
        <div class="right-column">
          <LanguageProgress />
          <ProgressComparison />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageManager from '@/components/languages/LanguageManager.vue'
import LanguageProgress from '@/components/languages/LanguageProgress.vue'
import ProgressComparison from '@/components/languages/ProgressComparison.vue'
</script>

<style lang="scss" scoped>
.languages-view {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  
  .header-decoration {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .decoration-dot {
      width: 8px;
      height: 8px;
      background: #8b5cf6;
      border-radius: 50%;
    }
    
    .decoration-line {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #8b5cf6, transparent);
    }
  }
  
  h1 {
    font-size: 2.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    font-weight: 800;
  }
  
  p {
    font-size: 1.2rem;
    color: #94a3b8;
    max-width: 500px;
    margin: 0 auto;
  }
}

.languages-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

// Адаптивность
@media (max-width: 1024px) {
  .languages-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .languages-view {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>