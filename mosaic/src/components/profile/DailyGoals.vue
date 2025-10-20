<template>
  <div class="daily-goals">
    <div class="section-header">
      <h2 class="section-title">🎯 Ежедневные цели</h2>
      <div class="streak-counter">
        <div class="streak-fire">🔥</div>
        <span class="streak-days">{{ currentStreak }} дней</span>
      </div>
    </div>

    <!-- Прогресс дня -->
    <div class="daily-progress">
      <div class="progress-header">
        <h3 class="progress-title">Прогресс сегодня</h3>
        <div class="progress-percent">{{ todayProgress }}%</div>
      </div>
      <ProgressBar
        :value="todayProgress"
        :height="12"
        :type="getProgressType(todayProgress)"
        :animated="true"
      />
      <div class="progress-time">
        <span>{{ completedTime }}/{{ dailyGoal }} минут</span>
      </div>
    </div>

    <!-- Список целей -->
    <div class="goals-list">
      <div
        v-for="goal in dailyGoals"
        :key="goal.id"
        class="goal-item"
        :class="{
          'goal--completed': goal.completed,
          'goal--active': !goal.completed
        }"
        @click="toggleGoal(goal)"
      >
        <div class="goal-checkbox">
          <div class="checkbox" :class="{ checked: goal.completed }">
            <span v-if="goal.completed">✓</span>
          </div>
        </div>
        
        <div class="goal-content">
          <div class="goal-title">{{ goal.title }}</div>
          <div class="goal-description">{{ goal.description }}</div>
          <div class="goal-reward">+{{ goal.xp }} XP</div>
        </div>
        
        <div class="goal-icon">
          {{ goal.icon }}
        </div>

        <!-- Анимация выполнения -->
        <div v-if="goal.completed" class="completion-effect"></div>
      </div>
    </div>

    <!-- Награда за день -->
    <div v-if="allGoalsCompleted" class="daily-reward">
      <div class="reward-header">
        <div class="reward-icon">🎉</div>
        <h3 class="reward-title">Все цели выполнены!</h3>
      </div>
      <div class="reward-details">
        <div class="reward-xp">+{{ totalDailyXP }} XP</div>
        <div class="reward-bonus">+50 XP бонус за все цели</div>
      </div>
      <button class="claim-btn" @click="claimReward">
        Получить награду
      </button>
    </div>

    <!-- Статистика недели -->
    <div class="week-stats">
      <h3 class="week-title">Статистика недели</h3>
      <div class="week-days">
        <div
          v-for="day in weekStats"
          :key="day.date"
          class="week-day"
          :class="{
            'day--completed': day.completed,
            'day--today': day.isToday,
            'day--current': day.isCurrent
          }"
        >
          <div class="day-circle">
            <span v-if="day.completed">✓</span>
          </div>
          <div class="day-label">{{ day.label }}</div>
        </div>
      </div>
    </div>

    <!-- Мотивационная фраза -->
    <div class="motivation-quote">
      <div class="quote-icon">💫</div>
      <p class="quote-text">{{ motivationQuote }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProgressBar from '@/components/common/ProgressBar.vue'

// Данные целей (заглушка)
const dailyGoalsData = [
  {
    id: 1,
    title: 'Пройдите 1 урок',
    description: 'Любой урок на ваш выбор',
    icon: '📚',
    xp: 25,
    completed: true
  },
  {
    id: 2,
    title: 'Занимайтесь 30 минут',
    description: 'Непрерывное обучение',
    icon: '⏱️',
    xp: 50,
    completed: true
  },
  {
    id: 3,
    title: 'Повторите слова',
    description: '5 слов из вашего словаря',
    icon: '🔁',
    xp: 15,
    completed: false
  },
  {
    id: 4,
    title: 'Практика произношения',
    description: 'Произнесите 10 фраз',
    icon: '🎤',
    xp: 20,
    completed: false
  }
]

// Статистика недели
const weekStatsData = [
  { date: '2024-10-14', label: 'Пн', completed: true, isToday: false, isCurrent: false },
  { date: '2024-10-15', label: 'Вт', completed: true, isToday: false, isCurrent: false },
  { date: '2024-10-16', label: 'Ср', completed: true, isToday: false, isCurrent: false },
  { date: '2024-10-17', label: 'Чт', completed: true, isToday: false, isCurrent: false },
  { date: '2024-10-18', label: 'Пт', completed: true, isToday: false, isCurrent: false },
  { date: '2024-10-19', label: 'Сб', completed: false, isToday: false, isCurrent: false },
  { date: '2024-10-20', label: 'Вс', completed: false, isToday: true, isCurrent: true }
]

// Мотивационные фразы
const motivationQuotes = [
  "Маленькие шаги каждый день приводят к большим результатам!",
  "Сегодняшние усилия - завтрашние успехи!",
  "Каждая минута обучения приближает вас к цели!",
  "Помните: даже самые длинные путешествия начинаются с первого шага!",
  "Ваше упорство сегодня создает ваше мастерство завтра!"
]

// Реактивные состояния
const dailyGoals = ref([...dailyGoalsData])
const weekStats = ref([...weekStatsData])
const dailyGoal = ref(30) // минут в день
const completedTime = ref(25) // выполнено минут сегодня
const currentStreak = ref(5)

// Computed свойства
const todayProgress = computed(() => {
  return Math.min(100, (completedTime.value / dailyGoal.value) * 100)
})

const allGoalsCompleted = computed(() => {
  return dailyGoals.value.every(goal => goal.completed)
})

const totalDailyXP = computed(() => {
  const baseXP = dailyGoals.value
    .filter(goal => goal.completed)
    .reduce((sum, goal) => sum + goal.xp, 0)
  return allGoalsCompleted.value ? baseXP + 50 : baseXP
})

const motivationQuote = computed(() => {
  const today = new Date().getDate()
  return motivationQuotes[today % motivationQuotes.length]
})

// Методы
const getProgressType = (progress: number) => {
  if (progress >= 100) return 'success'
  if (progress >= 50) return 'warning'
  return 'default'
}

const toggleGoal = (goal: any) => {
  goal.completed = !goal.completed
  
  // Если цель связана с временем, обновляем completedTime
  if (goal.title.includes('минут') && goal.completed) {
    completedTime.value = Math.min(dailyGoal.value, completedTime.value + 10)
  }
  
  // Анимация или другие эффекты можно добавить здесь
}

const claimReward = () => {
  console.log('Награда получена!', totalDailyXP.value, 'XP')
  // Здесь логика начисления XP
  // Например, вызов метода XPCounter
}

// Обновляем сегодняшний день в статистике
const updateTodayStats = () => {
  const today = new Date().toISOString().split('T')[0]
  weekStats.value.forEach(day => {
    day.isToday = day.date === today
    day.isCurrent = day.date === today
  })
}

// Инициализация
updateTodayStats()
</script>

<style lang="scss" scoped>
.daily-goals {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.streak-counter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: 700;

  .streak-fire {
    font-size: 1.2rem;
  }

  .streak-days {
    font-size: 0.9rem;
  }
}

/* Прогресс дня */
.daily-progress {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #3d3d3d;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .progress-title {
    color: #f8fafc;
    font-size: 1rem;
    font-weight: 600;
  }

  .progress-percent {
    color: #8b5cf6;
    font-size: 1.1rem;
    font-weight: 700;
  }
}

.progress-time {
  margin-top: 0.75rem;
  
  span {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 600;
  }
}

/* Список целей */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #2d2d2d;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }

  &.goal--completed {
    border-left: 4px solid #10b981;
    background: linear-gradient(135deg, #2d2d2d, #10b98120);
  }

  &.goal--active {
    border-left: 4px solid #8b5cf6;
  }
}

.goal-checkbox {
  .checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid #64748b;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;

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
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .goal-description {
    color: #94a3b8;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .goal-reward {
    color: #f59e0b;
    font-size: 0.8rem;
    font-weight: 700;
  }
}

.goal-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.completion-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(16, 185, 129, 0.1), transparent);
  animation: shine 2s ease-in-out;
}

/* Награда за день */
.daily-reward {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: white;

  .reward-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .reward-icon {
      font-size: 2.5rem;
    }

    .reward-title {
      font-size: 1.3rem;
      font-weight: 700;
    }
  }

  .reward-details {
    margin-bottom: 1.5rem;

    .reward-xp {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .reward-bonus {
      font-size: 0.9rem;
      opacity: 0.9;
    }
  }

  .claim-btn {
    background: white;
    color: #8b5cf6;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
    }
  }
}

/* Статистика недели */
.week-stats {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.week-title {
  color: #f8fafc;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.week-days {
  display: flex;
  justify-content: space-between;
}

.week-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .day-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    transition: all 0.3s ease;

    .day--completed & {
      background: #10b981;
      color: white;
    }

    .day--today & {
      background: #8b5cf6;
      color: white;
      border: 2px solid #7c3aed;
    }

    .day--current & {
      background: #2d2d2d;
      border: 2px solid #64748b;
      color: #64748b;
    }
  }

  .day-label {
    color: #94a3b8;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
}

/* Мотивационная фраза */
.motivation-quote {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #2d2d2d, #3d3d3d);
  border-radius: 12px;
  border-left: 4px solid #f59e0b;

  .quote-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .quote-text {
    color: #f8fafc;
    font-size: 0.95rem;
    font-style: italic;
    line-height: 1.4;
    margin: 0;
  }
}

/* Анимации */
@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

// Адаптивность
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .week-days {
    gap: 0.5rem;
  }

  .week-day {
    .day-circle {
      width: 28px;
      height: 28px;
      font-size: 0.7rem;
    }

    .day-label {
      font-size: 0.7rem;
    }
  }

  .goal-item {
    padding: 1rem;
  }

  .daily-reward {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .week-days {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .motivation-quote {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}
</style>