<template>
  <div class="study-activity">
    <div class="section-header">
      <h2 class="section-title">📈 Активность обучения</h2>
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

    <!-- График активности -->
<div class="activity-chart">
  <div class="chart-container">
    <!-- Добавляем ось Y слева -->
    <div class="chart-y-axis">
      <div class="y-label">{{ maxMinutes }}м</div>
      <div class="y-label">{{ Math.round(maxMinutes * 0.66) }}м</div>
      <div class="y-label">{{ Math.round(maxMinutes * 0.33) }}м</div>
      <div class="y-label">0м</div>
    </div>
    
    <div class="chart-content">
      <div class="chart-bars">
        <div
          v-for="(day, index) in chartData"
          :key="index"
          class="chart-bar-container"
          @mouseenter="hoveredDay = day"
          @mouseleave="hoveredDay = null"
        >
          <div
            class="chart-bar"
            :style="{
              height: `${getBarHeight(day.minutes)}%`,
              background: getBarColor(day.minutes)
            }"
            :class="{
              'chart-bar--today': isToday(day.date),
              'chart-bar--hovered': hoveredDay === day
            }"
          >
            <div v-if="hoveredDay === day" class="chart-tooltip">
              <div class="tooltip-date">{{ formatTooltipDate(day.date) }}</div>
              <div class="tooltip-minutes">{{ day.minutes }} минут</div>
              <div class="tooltip-lessons">{{ day.lessons }} уроков</div>
            </div>
          </div>
          <!-- Дни недели закреплены внизу -->
          <div class="chart-label">
            {{ getDayLabel(day.date, index) }}
          </div>
        </div>
      </div>
      
      <!-- Горизонтальные линии сетки -->
      <div class="chart-grid">
        <div class="grid-line" style="top: 0%"></div>
        <div class="grid-line" style="top: 33%"></div>
        <div class="grid-line" style="top: 66%"></div>
        <div class="grid-line" style="top: 100%"></div>
      </div>
    </div>
  </div>

  <!-- Легенда графика -->
  <div class="chart-legend">
    <div class="legend-item">
      <div class="legend-color" style="background: #10b981"></div>
      <span>Высокая активность</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background: #f59e0b"></div>
      <span>Средняя активность</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background: #ef4444"></div>
      <span>Низкая активность</span>
    </div>
  </div>
</div>

    <!-- Статистика активности -->
    <div class="activity-stats">
      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-info">
          <div class="stat-value">{{ totalStudyTime }}</div>
          <div class="stat-label">Всего времени</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-info">
          <div class="stat-value">{{ totalLessons }}</div>
          <div class="stat-label">Уроков пройдено</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <div class="stat-value">{{ activeDays }}/{{ totalDays }}</div>
          <div class="stat-label">Активных дней</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-info">
          <div class="stat-value">{{ averagePerDay }}</div>
          <div class="stat-label">В среднем в день</div>
        </div>
      </div>
    </div>

    <!-- Последние активности -->
    <div class="recent-activities">
      <h3 class="recent-title">Последние занятия</h3>
      <div class="activities-list">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon" :style="{ background: activity.color }">
            {{ getCategoryIcon(activity.category) }}
          </div>
          <div class="activity-details">
            <div class="activity-course">{{ activity.course }}</div>
            <div class="activity-lesson">{{ activity.lesson }}</div>
            <div class="activity-time">{{ formatTime(activity.time) }}</div>
          </div>
          <div class="activity-duration">
            {{ activity.duration }} мин
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Периоды времени
const timePeriods = [
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
  { label: '3 месяца', value: '3months' }
]

const selectedPeriod = ref('week')

// Данные для графика (заглушка)
const activityData = {
  week: [
    { date: '2024-10-14', minutes: 45, lessons: 3 },
    { date: '2024-10-15', minutes: 60, lessons: 4 },
    { date: '2024-10-16', minutes: 30, lessons: 2 },
    { date: '2024-10-17', minutes: 75, lessons: 5 },
    { date: '2024-10-18', minutes: 90, lessons: 6 },
    { date: '2024-10-19', minutes: 45, lessons: 3 },
    { date: '2024-10-20', minutes: 60, lessons: 4 }
  ],
  month: [
    // Данные для месяца (сокращенно для примера)
    { date: '2024-10-01', minutes: 50, lessons: 3 },
    { date: '2024-10-02', minutes: 65, lessons: 4 },
    { date: '2024-10-03', minutes: 40, lessons: 2 },
    // ... и так далее
  ]
}

// Последние активности
const recentActivities = [
  {
    id: 1,
    course: 'Английский для начинающих',
    lesson: 'Present Simple',
    category: 'grammar',
    duration: 25,
    time: new Date('2024-10-20T18:30:00'),
    color: '#8b5cf6'
  },
  {
    id: 2,
    course: 'Деловой английский',
    lesson: 'Бизнес-презентации',
    category: 'business',
    duration: 35,
    time: new Date('2024-10-20T16:15:00'),
    color: '#10b981'
  },
  {
    id: 3,
    course: 'Разговорная практика',
    lesson: 'Повседневные диалоги',
    category: 'conversation',
    duration: 20,
    time: new Date('2024-10-19T20:00:00'),
    color: '#f59e0b'
  },
  {
    id: 4,
    course: 'Английский для начинающих',
    lesson: 'Новые слова',
    category: 'vocabulary',
    duration: 15,
    time: new Date('2024-10-19T19:00:00'),
    color: '#ef4444'
  }
]

// Реактивные состояния
const hoveredDay = ref<any>(null)

// Computed свойства
const chartData = computed(() => {
  return activityData[selectedPeriod.value as keyof typeof activityData] || activityData.week
})

const totalStudyTime = computed(() => {
  const totalMinutes = chartData.value.reduce((sum, day) => sum + day.minutes, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}ч ${minutes}м`
})

const totalLessons = computed(() => {
  return chartData.value.reduce((sum, day) => sum + day.lessons, 0)
})

const activeDays = computed(() => {
  return chartData.value.filter(day => day.minutes > 0).length
})

const totalDays = computed(() => chartData.value.length)

const averagePerDay = computed(() => {
  const totalMinutes = chartData.value.reduce((sum, day) => sum + day.minutes, 0)
  const average = Math.round(totalMinutes / chartData.value.length)
  return `${average} мин`
})

const maxMinutes = computed(() => {
  return Math.max(...chartData.value.map(d => d.minutes))
})

// Методы
const getBarHeight = (minutes: number) => {
  const maxMinutes = Math.max(...chartData.value.map(d => d.minutes))
  return maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0
}

const getBarColor = (minutes: number) => {
  if (minutes >= 60) return '#10b981' // Высокая активность
  if (minutes >= 30) return '#f59e0b' // Средняя активность
  return '#ef4444' // Низкая активность
}

const isToday = (dateString: string) => {
  const today = new Date().toISOString().split('T')[0]
  return dateString === today
}

const getDayLabel = (dateString: string, index: number) => {
  const date = new Date(dateString)
  if (selectedPeriod.value === 'week') {
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    return dayNames[date.getDay()]
  } else if (selectedPeriod.value === 'month') {
    return date.getDate().toString()
  }
  return (index + 1).toString()
}

const formatTooltipDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  })
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    grammar: '📚',
    vocabulary: '📝',
    conversation: '💬',
    business: '💼',
    basics: '🔤'
  }
  return icons[category] || '📚'
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.study-activity {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

/* График */
.activity-chart {
  margin-bottom: 2rem;
}

.chart-container {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 2rem; /* Отступ для labels */
  
  .y-label {
    color: #94a3b8;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

.chart-content {
  flex: 1;
  position: relative;
  height: 200px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  height: 100%;
  position: relative;
  z-index: 2;
}

.chart-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
  justify-content: flex-end; /* Прижимаем дни к низу */
}

.chart-bar {
  width: 100%;
  max-width: 40px;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  min-height: 4px;
  margin-bottom: 2rem; /* Отступ для labels */

  &--today {
    border: 2px solid #8b5cf6;
  }

  &--hovered {
    transform: scale(1.1);
    z-index: 2;
  }
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 2rem; /* Учитываем место для labels */
  pointer-events: none;
  
  .grid-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: #3d3d3d;
  }
}

.chart-tooltip {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: #0f0f0f;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  padding: 0.75rem;
  white-space: nowrap;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #0f0f0f;
  }

  .tooltip-date {
    color: #f8fafc;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .tooltip-minutes {
    color: #8b5cf6;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .tooltip-lessons {
    color: #94a3b8;
    font-size: 0.875rem;
  }
}

.chart-label {
  position: absolute;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  span {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 600;
  }
}

/* Статистика активности */
.activity-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
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
    .stat-value {
      color: #f8fafc;
      font-size: 1.1rem;
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

/* Последние активности */
.recent-activities {
  .recent-title {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #3d3d3d;
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .activity-details {
    flex: 1;

    .activity-course {
      color: #f8fafc;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .activity-lesson {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .activity-time {
      color: #64748b;
      font-size: 0.75rem;
      font-weight: 600;
    }
  }

  .activity-duration {
    color: #8b5cf6;
    font-weight: 700;
    font-size: 0.9rem;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .time-filter {
    width: 100%;
    justify-content: space-between;
  }

  .activity-stats {
    grid-template-columns: 1fr 1fr;
  }

  .chart-legend {
    gap: 1rem;
  }

  .activity-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .activity-details {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .activity-stats {
    grid-template-columns: 1fr;
  }

  .chart-bars {
    gap: 0.5rem;
  }

  .chart-label {
    font-size: 0.7rem;
  }
}
</style>