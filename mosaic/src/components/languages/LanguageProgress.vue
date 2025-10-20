<template>
  <div class="language-progress">
    <!-- Общая статистика -->
    <div class="progress-overview">
      <h3>Общий прогресс</h3>
      <div class="overview-stats">
        <div class="stat-card">
          <div class="stat-icon">🌍</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalLanguages }}</div>
            <div class="stat-label">Языков</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalLessons }}</div>
            <div class="stat-label">Уроков</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalStudyTime }}ч</div>
            <div class="stat-label">Времени</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <div class="stat-value">{{ averageProgress }}%</div>
            <div class="stat-label">Прогресс</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Распределение по языкам -->
    <div class="languages-distribution">
      <h3>Распределение времени</h3>
      <div class="distribution-chart">
        <div 
          v-for="language in learningLanguages" 
          :key="language.code"
          class="distribution-item"
          :style="{ flex: language.studyTime || 1 }"
        >
          <div 
            class="distribution-bar" 
            :style="{ background: language.color }"
          ></div>
          <div class="distribution-label">
            <span class="language-flag">{{ language.flag }}</span>
            <span class="time">{{ language.studyTime || 0 }}ч</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Цели на неделю -->
    <div class="weekly-goals">
      <h3>Цели на неделю</h3>
      <div class="goals-list">
        <div class="goal-item">
          <div class="goal-checkbox">
            <div class="checkbox" :class="{ checked: weeklyGoals.languages }">✓</div>
          </div>
          <div class="goal-content">
            <div class="goal-title">Изучать 3 языка</div>
            <div class="goal-progress">
              <ProgressBar :value="(learningLanguages.length / 3) * 100" :height="4" />
            </div>
          </div>
        </div>
        <div class="goal-item">
          <div class="goal-checkbox">
            <div class="checkbox" :class="{ checked: weeklyGoals.lessons }">✓</div>
          </div>
          <div class="goal-content">
            <div class="goal-title">Пройдите 10 уроков</div>
            <div class="goal-progress">
              <ProgressBar :value="(completedLessonsThisWeek / 10) * 100" :height="4" />
            </div>
          </div>
        </div>
        <div class="goal-item">
          <div class="goal-checkbox">
            <div class="checkbox" :class="{ checked: weeklyGoals.time }">✓</div>
          </div>
          <div class="goal-content">
            <div class="goal-title">Занимайтесь 5 часов</div>
            <div class="goal-progress">
              <ProgressBar :value="(studyTimeThisWeek / 5) * 100" :height="4" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Достижения -->
    <div class="language-achievements">
      <h3>Достижения</h3>
      <div class="achievements-grid">
        <div 
          v-for="achievement in languageAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <div class="achievement-title">{{ achievement.title }}</div>
            <div class="achievement-description">{{ achievement.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/common/ProgressBar.vue'

// Props
interface Props {
  userLanguages?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  userLanguages: () => []
})

// Данные для демонстрации
const learningLanguages = computed(() => [
  {
    code: 'en',
    name: 'Английский',
    flag: '🇬🇧',
    progress: 65,
    color: '#8b5cf6',
    studyTime: 25,
    lessonsCompleted: 42
  },
  {
    code: 'es',
    name: 'Испанский',
    flag: '🇪🇸',
    progress: 30,
    color: '#10b981',
    studyTime: 12,
    lessonsCompleted: 15
  },
  {
    code: 'fr',
    name: 'Французский',
    flag: '🇫🇷',
    progress: 0,
    color: '#f59e0b',
    studyTime: 0,
    lessonsCompleted: 0
  }
])

const weeklyGoals = {
  languages: false,
  lessons: false,
  time: false
}

const completedLessonsThisWeek = 7
const studyTimeThisWeek = 3.5

const languageAchievements = [
  {
    id: 1,
    title: 'Полиглот',
    description: 'Изучайте 3 языка одновременно',
    icon: '🌍',
    unlocked: true
  },
  {
    id: 2,
    title: 'Языковой энтузиаст',
    description: 'Занимайтесь 10 часов в неделю',
    icon: '⏱️',
    unlocked: false
  },
  {
    id: 3,
    title: 'Быстрый старт',
    description: 'Достигните 50% прогресса в любом языке',
    icon: '⚡',
    unlocked: true
  }
]

// Computed
const totalLanguages = computed(() => learningLanguages.value.length)
const totalLessons = computed(() => learningLanguages.value.reduce((sum, lang) => sum + lang.lessonsCompleted, 0))
const totalStudyTime = computed(() => learningLanguages.value.reduce((sum, lang) => sum + lang.studyTime, 0))
const averageProgress = computed(() => {
  const total = learningLanguages.value.reduce((sum, lang) => sum + lang.progress, 0)
  return Math.round(total / learningLanguages.value.length)
})
</script>

<style lang="scss" scoped>
.language-progress {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.progress-overview {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2d2d2d;
  
  h3 {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

.languages-distribution {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2d2d2d;
  
  h3 {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.distribution-chart {
  display: flex;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #2d2d2d;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  position: relative;
  
  .distribution-bar {
    flex: 1;
    transition: all 0.3s ease;
  }
  
  .distribution-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #f8fafc;
    font-weight: 600;
  }
}

.weekly-goals {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2d2d2d;
  
  h3 {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 12px;
  
  .goal-checkbox {
    .checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #64748b;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      color: transparent;
      transition: all 0.3s ease;
      
      &.checked {
        background: #10b981;
        border-color: #10b981;
        color: white;
      }
    }
  }
  
  .goal-content {
    flex: 1;
    
    .goal-title {
      color: #f8fafc;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  }
}

.language-achievements {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2d2d2d;
  
  h3 {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.achievements-grid {
  display: grid;
  gap: 1rem;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 12px;
  opacity: 0.6;
  transition: all 0.3s ease;
  
  &.unlocked {
    opacity: 1;
    background: linear-gradient(135deg, #2d2d2d, #10b98120);
    
    .achievement-icon {
      background: #10b981;
    }
  }
  
  .achievement-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .achievement-info {
    flex: 1;
    
    .achievement-title {
      color: #f8fafc;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .achievement-description {
      color: #94a3b8;
      font-size: 0.875rem;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .distribution-chart {
    flex-direction: column;
    height: auto;
  }
  
  .distribution-item {
    flex-direction: row;
    height: 40px;
    
    .distribution-label {
      position: static;
      background: transparent;
    }
  }
}
</style>