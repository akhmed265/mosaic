<template>
  <section class="learning-map-section" id="progress">
    <div class="container">
      <div class="section-header">
        <h2>Ваша карта развития</h2>
        <p>Визуализируйте свой путь к свободному владению языком и отслеживайте прогресс</p>
      </div>

      <!-- Общая статистика -->
      <div class="overview-stats">
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-value">{{ currentLevel }}</div>
            <div class="stat-label">Текущий уровень</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalXP.toLocaleString() }}</div>
            <div class="stat-label">Накоплено XP</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-value">{{ completedSkills }}</div>
            <div class="stat-label">Освоено навыков</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <div class="stat-value">{{ currentStreak }}</div>
            <div class="stat-label">Дней подряд</div>
          </div>
        </div>
      </div>

      <!-- Прогресс уровня -->
      <div class="level-progress">
        <div class="level-header">
          <h3>Уровень {{ currentLevel }}</h3>
          <span class="xp-text">{{ currentXP }}/{{ nextLevelXP }} XP</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="levelProgressStyle"></div>
        </div>
        <div class="level-reward">
          🎁 На уровне {{ currentLevel + 1 }}: {{ nextLevelReward }}
        </div>
      </div>

      <!-- Навигация по категориям -->
      <div class="categories-nav">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="category-btn"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>

      <!-- Дерево навыков -->
      <div class="skills-tree">
        <div class="tree-container">
          <!-- Соединительные линии -->
          <svg class="connections" width="100%" height="100%">
            <path
              v-for="connection in connectionPaths"
              :key="connection.id"
              :d="connection.path"
              class="connection-line"
              :class="`connection--${connection.status}`"
            />
          </svg>

          <SkillNodeComponent
            v-for="skill in filteredSkills"
            :key="skill.id"
            :skill="skill"
            :language="currentLanguage"
            @select="handleSkillSelect"
          />
        </div>
      </div>

      <!-- Достижения -->
      <div class="achievements-section">
        <h3>Ваши достижения</h3>
        <div class="achievements-grid">
          <AchievementBadge
            v-for="achievement in achievements"
            :key="achievement.id"
            :achievement="achievement"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { LearningPath, SkillNode as SkillNodeType, Achievement } from '@/types/learning-map'
import SkillNodeComponent from '@/components/learning-map/TreeSkillNode.vue'
import AchievementBadge from '@/components/learning-map/AchievementBadge.vue'

// Состояния
const selectedCategory = ref('all')
const currentLanguage = ref('Английский')

const learningPath = ref<LearningPath>({
  language: 'Английский',
  currentLevel: 3,
  totalXP: 12500,
  nextLevelXP: 5000,
  skills: [
    {
      id: 'basic-greetings',
      title: 'Основные приветствия',
      description: 'Научитесь знакомиться и приветствовать людей',
      level: 1,
      category: 'vocabulary',
      status: 'completed',
      progress: 100,
      dependencies: [],
      rewards: { xp: 100, badges: ['first-steps'] },
      estimatedTime: '30 мин',
      exercises: 5
    },
    {
      id: 'numbers-1-10',
      title: 'Числа 1-10',
      description: 'Изучите базовые числа и счет',
      level: 1,
      category: 'vocabulary',
      status: 'completed',
      progress: 100,
      dependencies: [],
      rewards: { xp: 150 },
      estimatedTime: '45 мин',
      exercises: 8
    },
    {
      id: 'present-simple',
      title: 'Present Simple',
      description: 'Освойте базовое настоящее время',
      level: 2,
      category: 'grammar',
      status: 'completed',
      progress: 100,
      dependencies: ['basic-greetings'],
      rewards: { xp: 200 },
      estimatedTime: '1 час',
      exercises: 12
    },
    {
      id: 'food-vocabulary',
      title: 'Еда и напитки',
      description: 'Словарный запас для заказов в кафе',
      level: 2,
      category: 'vocabulary',
      status: 'unlocked',
      progress: 65,
      dependencies: ['basic-greetings'],
      rewards: { xp: 180 },
      estimatedTime: '50 мин',
      exercises: 10
    },
    {
      id: 'past-simple',
      title: 'Past Simple',
      description: 'Научитесь говорить о прошлом',
      level: 3,
      category: 'grammar',
      status: 'unlocked',
      progress: 30,
      dependencies: ['present-simple'],
      rewards: { xp: 250 },
      estimatedTime: '1.5 часа',
      exercises: 15
    },
    {
      id: 'listening-basics',
      title: 'Базовое аудирование',
      description: 'Понимание медленной речи',
      level: 2,
      category: 'listening',
      status: 'unlocked',
      progress: 45,
      dependencies: ['basic-greetings'],
      rewards: { xp: 220 },
      estimatedTime: '40 мин',
      exercises: 8
    },
    {
      id: 'business-intro',
      title: 'Деловое знакомство',
      description: 'Профессиональные приветствия',
      level: 4,
      category: 'speaking',
      status: 'locked',
      progress: 0,
      dependencies: ['basic-greetings', 'present-simple'],
      rewards: { xp: 300, badges: ['business-starter'] },
      estimatedTime: '2 часа',
      exercises: 18
    }
  ],
  achievements: [
    {
      id: 'first-words',
      title: 'Первые слова',
      description: 'Выучите 50 первых слов',
      icon: '🗣️',
      earned: true,
      progress: 100,
      type: 'completion'
    },
    {
      id: 'week-streak',
      title: 'Неделя практики',
      description: 'Занимайтесь 7 дней подряд',
      icon: '🔥',
      earned: true,
      progress: 100,
      type: 'streak'
    },
    {
      id: 'grammar-master',
      title: 'Мастер грамматики',
      description: 'Освойте 5 грамматических тем',
      icon: '📖',
      earned: false,
      progress: 60,
      type: 'mastery'
    },
    {
      id: 'speed-learner',
      title: 'Скоростное обучение',
      description: 'Завершите 3 урока за 1 день',
      icon: '⚡',
      earned: false,
      progress: 33,
      type: 'speed'
    }
  ]
})

// Категории навыков (без изменений)
const categories = ref([
  { id: 'all', name: 'Все навыки', icon: '🌐' },
  { id: 'vocabulary', name: 'Словарный запас', icon: '📝' },
  { id: 'grammar', name: 'Грамматика', icon: '📚' },
  { id: 'listening', name: 'Аудирование', icon: '🎧' },
  { id: 'speaking', name: 'Разговорная речь', icon: '💬' },
  { id: 'writing', name: 'Письмо', icon: '✍️' },
  { id: 'reading', name: 'Чтение', icon: '📖' }
])

// Computed свойства
const currentLevel = computed(() => learningPath.value.currentLevel)
const totalXP = computed(() => learningPath.value.totalXP)
const currentXP = computed(() => learningPath.value.totalXP % 5000)
const nextLevelXP = computed(() => learningPath.value.nextLevelXP)

const completedSkills = computed(() => {
  return learningPath.value.skills.filter(skill => skill.status === 'completed').length
})

const currentStreak = computed(() => 7)

const levelProgressStyle = computed(() => ({
  width: `${(currentXP.value / nextLevelXP.value) * 100}%`
}))

const nextLevelReward = computed(() => {
  const rewards = [
    'Новый аватар',
    'Доступ к разговорному клубу',
    'Персональный план обучения',
    'Сертификат уровня'
  ]
  return rewards[(currentLevel.value) % rewards.length]
})

const filteredSkills = computed(() => {
  if (selectedCategory.value === 'all') {
    return learningPath.value.skills
  }
  return learningPath.value.skills.filter(skill => skill.category === selectedCategory.value)
})

// ПЕРЕИМЕНОВАЛИ ЭТО computed свойство
const connectionPaths = computed(() => {
  return [
    // От basic-greetings к present-simple
    {
      id: 'conn1',
      path: 'M 330 150 C 430 150, 430 220, 530 220',
      status: 'completed'
    },
    // От basic-greetings к food-vocabulary  
    {
      id: 'conn2', 
      path: 'M 330 150 C 430 150, 430 290, 530 290',
      status: 'unlocked'
    },
    // От basic-greetings к listening-basics
    {
      id: 'conn3',
      path: 'M 330 150 C 430 150, 430 360, 530 360',
      status: 'unlocked'
    },
    // От present-simple к past-simple
    {
      id: 'conn4',
      path: 'M 530 220 C 630 220, 630 360, 730 360',
      status: 'unlocked'
    },
    // От basic-greetings + present-simple к business-intro
    {
      id: 'conn5',
      path: 'M 530 220 C 630 220, 630 150, 850 150',
      status: 'locked'
    },
    {
      id: 'conn6',
      path: 'M 330 150 C 430 150, 430 80, 850 150',
      status: 'locked'
    }
  ]
})

const achievements = computed(() => learningPath.value.achievements)

// Методы
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const handleSkillSelect = (skill: SkillNodeType) => {
  if (skill.status !== 'locked') {
    // Переход к странице курса
    router.push(`/course/${skill.id}`)
  }
}

onMounted(() => {
  // Инициализация после монтирования
  nextTick(() => {
    console.log('Карта развития загружена')
    console.log('Skills:', filteredSkills.value)
    console.log('Achievements:', achievements.value)
  })
})
</script>

<style lang="scss" scoped>
.learning-map-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  min-height: 100vh;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.5rem;
    color: #f8fafc;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    color: #94a3b8;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-info {
    .stat-value {
      color: #f8fafc;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      color: #94a3b8;
      font-size: 0.9rem;
    }
  }
}

.level-progress {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  .level-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h3 {
      color: #f8fafc;
      margin: 0;
    }
    
    .xp-text {
      color: #94a3b8;
      font-weight: 600;
    }
  }
  
  .progress-bar {
    height: 8px;
    background: #2d2d2d;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #10b981);
      border-radius: 4px;
      transition: width 0.5s ease;
    }
  }
  
  .level-reward {
    color: #f59e0b;
    font-weight: 600;
    text-align: center;
  }
}

.categories-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 0.75rem 1.25rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
    color: #f8fafc;
  }
  
  &.active {
    background: #8b5cf6;
    border-color: #8b5cf6;
    color: white;
  }
  
  .category-icon {
    font-size: 1.1rem;
  }
  
  .category-name {
    font-weight: 600;
    font-size: 0.9rem;
  }
}

.skills-tree {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  position: relative;
  min-height: 600px;
  overflow: auto;
}

.tree-container {
  position: relative;
  min-height: 500px;
  width: 1200px;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.connection-line {
  fill: none;
  stroke-width: 3;
  transition: all 0.3s ease;
  
  &.connection--completed {
    stroke: #10b981;
    stroke-dasharray: 5, 5;
    animation: dashMove 1s linear infinite;
  }
  
  &.connection--unlocked {
    stroke: #8b5cf6;
  }
  
  &.connection--locked {
    stroke: #64748b;
    stroke-dasharray: 3, 3;
    opacity: 0.5;
  }
}

@keyframes dashMove {
  to {
    stroke-dashoffset: -10;
  }
}

.achievements-section {
  h3 {
    color: #f8fafc;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

// Адаптивность
@media (max-width: 768px) {
  .overview-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .categories-nav {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>