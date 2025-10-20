<template>
  <div class="learning-map-view">
    <div class="container">
      <!-- Заголовок и выбор языка -->
      <div class="map-header">
        <h1>Ваш путь к языку</h1>
        <p>Выбирайте навыки и двигайтесь от основ к свободному владению</p>
        
        <div class="language-selector">
          <button
            v-for="lang in languages"
            :key="lang.language"
            class="lang-btn"
            :class="{ active: currentLanguage === lang.language }"
            @click="selectLanguage(lang)"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            <span class="lang-name">{{ lang.language }}</span>
          </button>
        </div>
      </div>

      <!-- Статистика прогресса -->
      <div class="progress-overview">
        <div class="stat">
          <div class="stat-value">{{ currentLevel }}</div>
          <div class="stat-label">Текущий уровень</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ totalXP }}</div>
          <div class="stat-label">Накоплено XP</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ completedSkills }}/{{ totalSkills }}</div>
          <div class="stat-label">Навыков освоено</div>
        </div>
      </div>

      <!-- Древо навыков -->
      <div class="skills-tree">
        <div 
          v-for="level in levels" 
          :key="level"
          class="skill-level"
        >
          <div class="level-header">
            <h3>Уровень {{ level }}</h3>
            <span class="level-description">{{ getLevelDescription(level) }}</span>
          </div>
          
          <div class="skills-grid">
            <SkillCard
              v-for="skill in getSkillsByLevel(level)"
              :key="skill.id"
              :skill="skill"
              :language-color="currentLanguageData.color"
              @click="startSkill(skill)"
            />
          </div>
        </div>
      </div>

      <!-- Быстрые действия -->
      <div class="quick-actions">
        <button class="action-btn primary" @click="continueLearning">
          Продолжить обучение
        </button>
        <button class="action-btn secondary" @click="practiceWeakSkills">
          Тренировать слабые навыки
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { LanguagePath, Skill } from '@/types/learning'
import SkillCard from '@/components/learning/SkillCard.vue'

const router = useRouter()

// Данные языков
const languages = ref<LanguagePath[]>([
  {
    language: 'Английский',
    flag: '🇬🇧',
    color: '#8b5cf6',
    currentLevel: 3,
    totalXP: 1250,
    skills: [
      {
        id: 'en-basics',
        title: 'Основы',
        description: 'Алфавит, приветствия, базовые фразы',
        level: 1,
        category: 'basics',
        status: 'completed',
        progress: 100,
        duration: '2 часа',
        exercises: 15,
        xp: 100,
        nextSkills: ['en-grammar1', 'en-vocab1'],
        requiredSkills: []
      },
      {
        id: 'en-grammar1',
        title: 'Present Simple',
        description: 'Базовое настоящее время',
        level: 2,
        category: 'grammar',
        status: 'completed',
        progress: 100,
        duration: '3 часа',
        exercises: 20,
        xp: 150,
        nextSkills: ['en-grammar2', 'en-conv1'],
        requiredSkills: ['en-basics']
      },
      {
        id: 'en-vocab1',
        title: 'Базовый словарь',
        description: '500 самых важных слов',
        level: 2,
        category: 'vocabulary',
        status: 'available',
        progress: 30,
        duration: '4 часа',
        exercises: 25,
        xp: 200,
        nextSkills: ['en-conv1'],
        requiredSkills: ['en-basics']
      },
      {
        id: 'en-grammar2',
        title: 'Past Simple',
        description: 'Прошедшее время',
        level: 3,
        category: 'grammar',
        status: 'available',
        progress: 0,
        duration: '3 часа',
        exercises: 18,
        xp: 180,
        nextSkills: ['en-conv2'],
        requiredSkills: ['en-grammar1']
      },
      {
        id: 'en-conv1',
        title: 'Повседневное общение',
        description: 'Диалоги на бытовые темы',
        level: 3,
        category: 'conversation',
        status: 'available',
        progress: 0,
        duration: '5 часов',
        exercises: 30,
        xp: 250,
        nextSkills: ['en-business1'],
        requiredSkills: ['en-grammar1', 'en-vocab1']
      },
      {
        id: 'en-conv2',
        title: 'Свободное общение',
        description: 'Обсуждение сложных тем',
        level: 4,
        category: 'conversation',
        status: 'locked',
        progress: 0,
        duration: '6 часов',
        exercises: 35,
        xp: 300,
        nextSkills: [],
        requiredSkills: ['en-grammar2', 'en-conv1']
      },
      {
        id: 'en-business1',
        title: 'Деловой английский',
        description: 'Бизнес-лексика и переговоры',
        level: 4,
        category: 'business',
        status: 'locked',
        progress: 0,
        duration: '8 часов',
        exercises: 40,
        xp: 400,
        nextSkills: [],
        requiredSkills: ['en-conv1']
      }
    ]
  },
  {
    language: 'Испанский',
    flag: '🇪🇸',
    color: '#10b981',
    currentLevel: 1,
    totalXP: 300,
    skills: [
      {
        id: 'es-basics',
        title: 'Основы испанского',
        description: 'Алфавит, произношение, базовые фразы',
        level: 1,
        category: 'basics',
        status: 'completed',
        progress: 100,
        duration: '2 часа',
        exercises: 12,
        xp: 100,
        nextSkills: ['es-grammar1'],
        requiredSkills: []
      },
      {
        id: 'es-grammar1',
        title: 'Настоящее время',
        description: 'Presente de Indicativo',
        level: 2,
        category: 'grammar',
        status: 'available',
        progress: 0,
        duration: '3 часа',
        exercises: 18,
        xp: 150,
        nextSkills: [],
        requiredSkills: ['es-basics']
      }
    ]
  }
])

// Текущий выбранный язык
const currentLanguage = ref('Английский')
const currentLanguageData = computed(() => {
  return languages.value.find(lang => lang.language === currentLanguage.value) || languages.value[0]
})

// Computed свойства
const currentLevel = computed(() => currentLanguageData.value.currentLevel)
const totalXP = computed(() => currentLanguageData.value.totalXP)
const completedSkills = computed(() => {
  return currentLanguageData.value.skills.filter(skill => skill.status === 'completed').length
})
const totalSkills = computed(() => currentLanguageData.value.skills.length)
const levels = computed(() => {
  const levels = currentLanguageData.value.skills.map(skill => skill.level)
  return [...new Set(levels)].sort((a, b) => a - b)
})

// Методы
const selectLanguage = (lang: LanguagePath) => {
  currentLanguage.value = lang.language
}

const getSkillsByLevel = (level: number) => {
  return currentLanguageData.value.skills
    .filter(skill => skill.level === level)
    .sort((a, b) => a.category.localeCompare(b.category))
}

const getLevelDescription = (level: number) => {
  const descriptions = {
    1: 'Основы и база',
    2: 'Начальный уровень',
    3: 'Средний уровень', 
    4: 'Продвинутый уровень',
    5: 'Профессиональный уровень'
  }
  return descriptions[level as keyof typeof descriptions] || `Уровень ${level}`
}

const startSkill = (skill: Skill) => {
  if (skill.status !== 'locked') {
    router.push(`/skill/${skill.id}`)
  }
}

const continueLearning = () => {
  // Находим следующий доступный навык
  const nextSkill = currentLanguageData.value.skills
    .find(skill => skill.status === 'available')
  
  if (nextSkill) {
    startSkill(nextSkill)
  }
}

const practiceWeakSkills = () => {
  // Находим навыки с низким прогрессом
  const weakSkills = currentLanguageData.value.skills
    .filter(skill => skill.status === 'available' && skill.progress < 50)
  
  if (weakSkills.length > 0) {
    startSkill(weakSkills[0])
  }
}
</script>

<style lang="scss" scoped>
.learning-map-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 2rem 0;
}

.container {
  padding-left: 10px;
  padding-right: 10px;
}

.map-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: #f8fafc;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    color: #94a3b8;
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
}

.language-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #1a1a1a;
  border: 2px solid #2d2d2d;
  border-radius: 12px;
  padding: 1rem 1.5rem;
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
  
  .lang-flag {
    font-size: 1.5rem;
  }
  
  .lang-name {
    font-weight: 600;
    font-size: 1rem;
  }
}

.progress-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }
  
  .stat-value {
    color: #f8fafc;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    color: #94a3b8;
    font-size: 0.9rem;
  }
}

.skills-tree {
  margin-bottom: 3rem;
}

.skill-level {
  margin-bottom: 3rem;
  
  .level-header {
    margin-bottom: 1.5rem;
    
    h3 {
      color: #f8fafc;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .level-description {
      color: #94a3b8;
      font-size: 1rem;
    }
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &.primary {
    background: #8b5cf6;
    color: white;
    
    &:hover {
      background: #7c3aed;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: transparent;
    color: #94a3b8;
    border: 2px solid #2d2d2d;
    
    &:hover {
      border-color: #8b5cf6;
      color: #f8fafc;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>