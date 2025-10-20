<template>
  <div class="language-statistics">
    <!-- Заголовок -->
    <div class="stats-header">
      <h2>Детальная статистика</h2>
      <div class="time-filter">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          class="filter-btn"
          :class="{ active: selectedPeriod === period.value }"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Основные метрики -->
    <div class="metrics-grid">
      <div class="metric-card main-metric">
        <div class="metric-icon">📈</div>
        <div class="metric-info">
          <div class="metric-value">{{ overallProgress }}%</div>
          <div class="metric-label">Общий прогресс</div>
          <div class="metric-trend" :class="progressTrend">
            {{ progressTrend === 'up' ? '↗' : '↘' }} {{ progressChange }}%
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">⏱️</div>
        <div class="metric-info">
          <div class="metric-value">{{ totalStudyTime }}ч</div>
          <div class="metric-label">Всего времени</div>
          <div class="metric-subtext">{{ averagePerDay }}/день</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">📚</div>
        <div class="metric-info">
          <div class="metric-value">{{ completedLessons }}</div>
          <div class="metric-label">Уроков пройдено</div>
          <div class="metric-subtext">{{ lessonsPerWeek }}/неделю</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">🔥</div>
        <div class="metric-info">
          <div class="metric-value">{{ currentStreak }}</div>
          <div class="metric-label">Текущий стрик</div>
          <div class="metric-subtext">Дней подряд</div>
        </div>
      </div>
    </div>

    <!-- График прогресса по времени -->
    <div class="chart-section">
      <h3>Прогресс по времени</h3>
      <div class="progress-chart">
        <div class="chart-container">
          <div 
            v-for="(point, index) in progressData"
            :key="index"
            class="chart-point"
            :style="{
              left: `${(index / (progressData.length - 1)) * 100}%`,
              bottom: `${point.value}%`
            }"
            @mouseenter="hoveredPoint = point"
            @mouseleave="hoveredPoint = null"
          >
            <div class="point-tooltip" v-if="hoveredPoint === point">
              <div class="tooltip-date">{{ point.date }}</div>
              <div class="tooltip-value">{{ point.value }}%</div>
            </div>
          </div>
          <svg class="chart-line" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              :d="progressPath" 
              fill="none" 
              stroke="url(#progressGradient)" 
              stroke-width="2"
            />
          </svg>
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#8b5cf6" />
              <stop offset="100%" stop-color="#10b981" />
            </linearGradient>
          </defs>
        </div>
        <div class="chart-labels">
          <span v-for="label in chartLabels" :key="label">{{ label }}</span>
        </div>
      </div>
    </div>

    <!-- Распределение по навыкам -->
    <div class="skills-distribution">
      <h3>Распределение по навыкам</h3>
      <div class="skills-grid">
        <div 
          v-for="skill in languageSkills"
          :key="skill.name"
          class="skill-item"
        >
          <div class="skill-header">
            <span class="skill-icon">{{ skill.icon }}</span>
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-percent">{{ skill.progress }}%</span>
          </div>
          <ProgressBar
            :value="skill.progress"
            :color="skill.color"
            :height="6"
            :animated="true"
          />
          <div class="skill-stats">
            <span class="skill-time">{{ skill.time }}ч</span>
            <span class="skill-exercises">{{ skill.exercises }} упр.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProgressBar from '@/components/common/ProgressBar.vue'

// Периоды времени
const timePeriods = [
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
  { label: '3 месяца', value: '3months' },
  { label: 'Год', value: 'year' }
]

const selectedPeriod = ref('month')

// Данные для демонстрации
const progressData = ref([
  { date: '1 окт', value: 45 },
  { date: '8 окт', value: 52 },
  { date: '15 окт', value: 48 },
  { date: '22 окт', value: 58 },
  { date: '29 окт', value: 65 }
])

const languageSkills = ref([
  { name: 'Грамматика', icon: '📚', progress: 70, color: '#8b5cf6', time: 15, exercises: 42 },
  { name: 'Словарный запас', icon: '📝', progress: 65, color: '#10b981', time: 12, exercises: 38 },
  { name: 'Аудирование', icon: '🎧', progress: 55, color: '#f59e0b', time: 8, exercises: 25 },
  { name: 'Разговорная речь', icon: '💬', progress: 45, color: '#ef4444', time: 6, exercises: 18 },
  { name: 'Письмо', icon: '✍️', progress: 60, color: '#06b6d4', time: 10, exercises: 30 },
  { name: 'Чтение', icon: '📖', progress: 75, color: '#8b5cf6', time: 14, exercises: 35 }
])

const hoveredPoint = ref<any>(null)

// Computed свойства
const overallProgress = computed(() => 65)
const progressTrend = computed(() => 'up')
const progressChange = computed(() => 12)
const totalStudyTime = computed(() => 45)
const averagePerDay = computed(() => '1.2ч')
const completedLessons = computed(() => 57)
const lessonsPerWeek = computed(() => 8)
const currentStreak = computed(() => 7)

const progressPath = computed(() => {
  const points = progressData.value.map((point, index) => {
    const x = (index / (progressData.value.length - 1)) * 100
    const y = 100 - point.value
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  })
  return points.join(' ')
})

const chartLabels = computed(() => {
  return progressData.value.map(point => point.date)
})
</script>

<style lang="scss" scoped>
.language-statistics {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    color: #f8fafc;
    font-size: 1.5rem;
    font-weight: 700;
  }
}

.time-filter {
  display: flex;
  gap: 0.5rem;
  background: #2d2d2d;
  border-radius: 8px;
  padding: 0.25rem;
}

.filter-btn {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.active {
    background: #8b5cf6;
    color: white;
  }
  
  &:hover:not(.active) {
    background: #3d3d3d;
    color: #f8fafc;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &.main-metric {
    background: linear-gradient(135deg, #2d2d2d, #8b5cf620);
    border: 1px solid #8b5cf6;
    
    .metric-value {
      font-size: 2rem;
    }
  }
  
  .metric-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .metric-info {
    flex: 1;
    
    .metric-value {
      color: #f8fafc;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .metric-label {
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .metric-trend {
      font-size: 0.875rem;
      font-weight: 700;
      
      &.up {
        color: #10b981;
      }
      
      &.down {
        color: #ef4444;
      }
    }
    
    .metric-subtext {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 600;
    }
  }
}

.chart-section {
  margin-bottom: 2rem;
  
  h3 {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.progress-chart {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
}

.chart-container {
  height: 200px;
  position: relative;
  margin-bottom: 2rem;
}

.chart-point {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #8b5cf6;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translate(-50%, 50%) scale(1.5);
    background: #10b981;
  }
}

.point-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #0f0f0f;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  padding: 0.75rem;
  white-space: nowrap;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 10;
  
  .tooltip-date {
    color: #f8fafc;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .tooltip-value {
    color: #8b5cf6;
    font-weight: 700;
  }
}

.chart-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  
  span {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 600;
  }
}

.skills-distribution {
  h3 {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.skill-item {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  
  .skill-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    
    .skill-icon {
      font-size: 1.2rem;
    }
    
    .skill-name {
      color: #f8fafc;
      font-weight: 600;
      flex: 1;
    }
    
    .skill-percent {
      color: #8b5cf6;
      font-weight: 700;
    }
  }
  
  .skill-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 0.75rem;
    
    span {
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 600;
    }
  }
}

// Адаптивность
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .stats-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .time-filter {
    width: 100%;
    justify-content: space-between;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>