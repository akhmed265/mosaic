<template>
  <section class="stats-section">
    <div class="section-header">
      <h2>{{ $t('about.stats.title') }}</h2>
      <p class="section-subtitle">{{ $t('about.stats.subtitle') }}</p>
    </div>

    <div class="stats-grid">
      <div 
        v-for="stat in stats" 
        :key="stat.id"
        class="stat-card"
        :class="`stat-${stat.id}`"
      >
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-content">
          <div class="stat-number">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-trend" v-if="stat.trend">
            <span class="trend-icon" :class="stat.trend.type">
              {{ stat.trend.type === 'up' ? '↗' : '↘' }}
            </span>
            <span class="trend-value">{{ stat.trend.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="progress-metrics">
      <h3>{{ $t('about.stats.progressTitle') }}</h3>
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-bar">
            <div 
              class="metric-fill" 
              :style="{ width: '85%' }"
              data-value="85%"
            ></div>
          </div>
          <div class="metric-info">
            <span class="metric-label">{{ $t('about.stats.completionRate') }}</span>
            <span class="metric-value">85%</span>
          </div>
        </div>
        
        <div class="metric-item">
          <div class="metric-bar">
            <div 
              class="metric-fill" 
              :style="{ width: '92%' }"
              data-value="92%"
            ></div>
          </div>
          <div class="metric-info">
            <span class="metric-label">{{ $t('about.stats.satisfaction') }}</span>
            <span class="metric-value">92%</span>
          </div>
        </div>
        
        <div class="metric-item">
          <div class="metric-bar">
            <div 
              class="metric-fill" 
              :style="{ width: '78%' }"
              data-value="78%"
            ></div>
          </div>
          <div class="metric-info">
            <span class="metric-label">{{ $t('about.stats.retention') }}</span>
            <span class="metric-value">78%</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  {
    id: 1,
    icon: '👥',
    value: '1,250+',
    label: 'Активных студентов',
    trend: { type: 'up', value: '12%' }
  },
  {
    id: 2,
    icon: '🌍',
    value: '15+',
    label: 'Языков для изучения',
    trend: { type: 'up', value: '3 новых' }
  },
  {
    id: 3,
    icon: '📚',
    value: '500+',
    label: 'Уроков и упражнений',
    trend: { type: 'up', value: '25%' }
  },
  {
    id: 4,
    icon: '⏱️',
    value: '10,000+',
    label: 'Часов обучения',
    trend: { type: 'up', value: '1,200ч' }
  },
  {
    id: 5,
    icon: '🎯',
    value: '98%',
    label: 'Успешных студентов',
    trend: { type: 'up', value: '2%' }
  },
  {
    id: 6,
    icon: '📱',
    value: '24/7',
    label: 'Доступ к платформе',
    trend: null
  }
]
</script>

<style lang="scss" scoped>
.stats-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
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
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
  padding: 0 25px;
}

.stat-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-5px);
  }
  
  .stat-icon {
    font-size: 3rem;
    flex-shrink: 0;
  }
  
  .stat-content {
    flex: 1;
    
    .stat-number {
      color: #f8fafc;
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
      line-height: 1;
    }
    
    .stat-label {
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    .trend-icon {
      &.up {
        color: #10b981;
      }
      
      &.down {
        color: #ef4444;
      }
    }
    
    .trend-value {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 600;
    }
  }
}

.progress-metrics {
  max-width: 800px;
  margin: 0 auto;
  
  h3 {
    color: #f8fafc;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
  }
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.metric-item {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  
  .metric-bar {
    height: 8px;
    background: #2d2d2d;
    border-radius: 4px;
    margin-bottom: 1rem;
    overflow: hidden;
    position: relative;
    
    .metric-fill {
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(90deg, #8b5cf6, #10b981);
      transition: width 1s ease-in-out;
      position: relative;
      
      &::after {
        content: attr(data-value);
        position: absolute;
        right: -40px;
        top: -30px;
        background: #1a1a1a;
        color: #f8fafc;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        border: 1px solid #2d2d2d;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }
    
    &:hover .metric-fill::after {
      opacity: 1;
    }
  }
  
  .metric-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .metric-label {
      color: #94a3b8;
      font-weight: 600;
    }
    
    .metric-value {
      color: #f8fafc;
      font-weight: 700;
      font-size: 1.1rem;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1.5rem;
    
    .stat-number {
      font-size: 2rem;
    }
  }
}
</style>