<template>
  <div class="progress-stats">
    <h2 class="stats-title">📊 Статистика прогресса</h2>
    
    <div class="stats-grid">
      <!-- Общий прогресс -->
      <div class="stat-card main-stat">
        <div class="stat-header">
          <h3>Общий прогресс</h3>
          <div class="stat-value">{{ overallProgress }}%</div>
        </div>
        <ProgressBar
          :value="overallProgress"
          :height="12"
          :type="getProgressType(overallProgress)"
          :animated="true"
        />
        <div class="stat-details">
          <span>{{ completedSkills }}/{{ totalSkills }} навыков</span>
        </div>
      </div>

      <!-- Прогресс по категориям -->
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="stat-card"
      >
        <div class="stat-header">
          <h3>{{ category.name }}</h3>
          <div class="stat-value">{{ category.progress }}%</div>
        </div>
        <ProgressBar
          :value="category.progress"
          :color="category.color"
          :height="8"
          :animated="true"
        />
        <div class="stat-details">
          <span>{{ category.completed }}/{{ category.total }} уроков</span>
        </div>
      </div>
    </div>

    <!-- Детальная статистика -->
    <div class="detailed-stats">
      <div class="stat-item">
        <div class="stat-icon">⏱️</div>
        <div class="stat-info">
          <div class="stat-number">{{ formatTime(totalStudyTime) }}</div>
          <div class="stat-label">Общее время обучения</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">📚</div>
        <div class="stat-info">
          <div class="stat-number">{{ completedLessons }}</div>
          <div class="stat-label">Пройдено уроков</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-number">{{ accuracy }}%</div>
          <div class="stat-label">Точность ответов</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <div class="stat-number">{{ currentStreak }} дней</div>
          <div class="stat-label">Текущий стрик</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/common/ProgressBar.vue'

// Данные статистики (заглушка)
const statsData = {
  overallProgress: 65,
  completedSkills: 13,
  totalSkills: 20,
  completedLessons: 42,
  totalStudyTime: 8560, // в минутах
  accuracy: 87,
  currentStreak: 7,
  categories: [
    {
      id: 'basics',
      name: 'Основы',
      progress: 80,
      completed: 8,
      total: 10,
      color: '#8b5cf6'
    },
    {
      id: 'grammar',
      name: 'Грамматика',
      progress: 45,
      completed: 9,
      total: 20,
      color: '#10b981'
    },
    {
      id: 'vocabulary',
      name: 'Словарный запас',
      progress: 70,
      completed: 14,
      total: 20,
      color: '#f59e0b'
    },
    {
      id: 'conversation',
      name: 'Разговорная речь',
      progress: 55,
      completed: 11,
      total: 20,
      color: '#ef4444'
    }
  ]
}

// Computed свойства
const overallProgress = computed(() => statsData.overallProgress)
const completedSkills = computed(() => statsData.completedSkills)
const totalSkills = computed(() => statsData.totalSkills)
const categories = computed(() => statsData.categories)
const completedLessons = computed(() => statsData.completedLessons)
const totalStudyTime = computed(() => statsData.totalStudyTime)
const accuracy = computed(() => statsData.accuracy)
const currentStreak = computed(() => statsData.currentStreak)

// Методы
const getProgressType = (progress: number) => {
  if (progress >= 80) return 'success'
  if (progress >= 50) return 'warning'
  return 'default'
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}ч ${mins}м`
}
</script>

<style lang="scss" scoped>
.progress-stats {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
  margin-bottom: 2rem;
}

.stats-title {
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #3d3d3d;
  
  &.main-stat {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #2d2d2d, #3d3d3d);
  }
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    color: #f8fafc;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .stat-value {
    color: #8b5cf6;
    font-size: 1.25rem;
    font-weight: 700;
  }
}

.stat-details {
  margin-top: 0.75rem;
  
  span {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 600;
  }
}

.detailed-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #2d2d2d;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 12px;
  
  .stat-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .stat-info {
    .stat-number {
      color: #f8fafc;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 600;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .detailed-stats {
    grid-template-columns: 1fr 1fr;
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .detailed-stats {
    grid-template-columns: 1fr;
  }
}
</style>