<template>
  <section class="mission-section">
    <div class="section-header">
      <h2>{{ $t('about.mission.title') }}</h2>
      <p class="section-subtitle">{{ $t('about.mission.subtitle') }}</p>
    </div>

    <div class="mission-content">
      <div class="mission-statement">
        <div class="statement-icon">🎯</div>
        <h3>{{ $t('about.mission.statement') }}</h3>
      </div>

      <div class="values-grid">
        <div 
          v-for="value in values" 
          :key="value.id"
          class="value-card"
        >
          <div class="value-icon">{{ value.icon }}</div>
          <h4>{{ value.title }}</h4>
          <p>{{ value.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const values = [
  {
    id: 1,
    icon: '🚀',
    title: 'Инновации',
    description: 'Используем современные технологии и методики для эффективного обучения'
  },
  {
    id: 2,
    icon: '❤️',
    title: 'Доступность',
    description: 'Образование должно быть доступно каждому, независимо от места и времени'
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Результаты',
    description: 'Фокус на реальных результатах и практических навыках'
  },
  {
    id: 4,
    icon: '🌟',
    title: 'Качество',
    description: 'Только проверенные материалы и экспертные методики'
  },
  {
    id: 5,
    icon: '🔄',
    title: 'Постоянство',
    description: 'Поддерживаем и развиваем платформу для вашего прогресса'
  },
  {
    id: 6,
    icon: '🤝',
    title: 'Сообщество',
    description: 'Создаем среду для взаимопомощи и обмена опытом'
  }
]
</script>

<style lang="scss" scoped>
.mission-section {
  padding: 4rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    color: #f8fafc;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  .section-subtitle {
    color: #94a3b8;
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.mission-content {
  max-width: 1000px;
  margin: 0 auto;
}

.mission-statement {
  text-align: center;
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  border: 1px solid #2d2d2d;
  
  .statement-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: #f8fafc;
    font-size: 1.8rem;
    font-weight: 600;
    line-height: 1.4;
    max-width: 600px;
    margin: 0 auto;
  }
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.value-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-5px);
  }
  
  .value-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
  
  h4 {
    color: #f8fafc;
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  p {
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .section-header h2 {
    font-size: 2rem;
  }
  
  .mission-statement {
    padding: 2rem 1rem;
    
    h3 {
      font-size: 1.4rem;
    }
  }
  
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>