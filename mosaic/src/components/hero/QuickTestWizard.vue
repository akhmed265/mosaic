<template>
  <div class="test-wizard" v-if="isOpen">
    <div class="test-overlay" @click="closeTest"></div>
    
    <div class="test-modal">
      <!-- Заголовок теста -->
      <div class="test-header">
        <h2>Подбор идеального курса</h2>
        <p>Ответьте на 3 вопроса и получите персональную программу</p>
        <div class="test-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="progressStyle"></div>
          </div>
          <span class="progress-text">{{ currentQuestion < 3 ? `Вопрос ${ currentQuestion + 1 } из 3` : 'Результат'}}</span>
        </div>
      </div>

      <!-- Контент теста -->
      <div class="test-content">
        <!-- Вопрос 1: Цель изучения -->
        <div v-if="currentQuestion === 0" class="question">
          <h3>Для чего вы хотите изучать язык?</h3>
          <div class="options-grid">
            <div 
              v-for="option in goalOptions" 
              :key="option.id"
              class="option-card"
              :class="{ 
                selected: answers.goal === option.id,
                'selecting': selectingOption === option.id
              }"
              @click="selectGoal(option.id)"
            >
              <div class="option-icon">{{ option.icon }}</div>
              <h4>{{ option.title }}</h4>
              <p>{{ option.description }}</p>
              <div class="selection-indicator" v-if="answers.goal === option.id">
                ✓ Выбрано
              </div>
            </div>
          </div>
        </div>

        <!-- Вопрос 2: Уровень -->
        <div v-if="currentQuestion === 1" class="question">
          <h3>Какой у вас текущий уровень?</h3>
          <div class="options-list">
            <div 
              v-for="option in levelOptions" 
              :key="option.id"
              class="option-item"
              :class="{ 
                selected: answers.level === option.id,
                'selecting': selectingOption === option.id
              }"
              @click="selectLevel(option.id)"
            >
              <div class="option-check">
                <div class="check-mark" v-if="answers.level === option.id">✓</div>
              </div>
              <div class="option-content">
                <h4>{{ option.title }}</h4>
                <p>{{ option.description }}</p>
              </div>
              <div class="selection-badge" v-if="answers.level === option.id">
                Выбрано
              </div>
            </div>
          </div>
        </div>

        <!-- Вопрос 3: Формат обучения -->
        <div v-if="currentQuestion === 2" class="question">
          <h3>Какой формат обучения вам ближе?</h3>
          <div class="options-grid">
            <div 
              v-for="option in formatOptions" 
              :key="option.id"
              class="option-card"
              :class="{ 
                selected: answers.format === option.id,
                'selecting': selectingOption === option.id
              }"
              @click="selectFormat(option.id)"
            >
              <div class="option-icon">{{ option.icon }}</div>
              <h4>{{ option.title }}</h4>
              <p>{{ option.description }}</p>
              <div class="selection-indicator" v-if="answers.format === option.id">
                ✓ Выбрано
              </div>
            </div>
          </div>
        </div>

        <!-- Результат -->
        <div v-if="currentQuestion === 3" class="result">
          <div class="result-success">🎉</div>
          <h3>Идеальный курс для вас готов!</h3>
          <div class="result-card" :style="resultCardStyle">
            <div class="result-language">
              <span class="flag">{{ recommendedCourse.flag }}</span>
              <span class="name">{{ recommendedCourse.language }}</span>
            </div>
            <h4>{{ recommendedCourse.title }}</h4>
            <p>{{ recommendedCourse.description }}</p>
            <div class="result-features">
              <div class="feature" v-for="feature in recommendedCourse.features" :key="feature">
                ✓ {{ feature }}
              </div>
            </div>
            <div class="result-actions">
              <button class="btn-primary" @click="startCourse">Начать обучение</button>
              <button class="btn-secondary" @click="seeAllCourses">Посмотреть все курсы</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Упрощенная навигация - только кнопка назад и пропустить -->
      <div class="test-navigation">
        <button 
          v-if="currentQuestion > 0 && currentQuestion < 3" 
          class="btn-back"
          @click="prevQuestion"
        >
          ← Назад
        </button>
        
        <div class="navigation-spacer"></div>
        
        <button class="btn-skip" @click="closeTest">
          Пропустить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface TestAnswers {
  goal: string | null
  level: string | null
  format: string | null
}

interface CourseRecommendation {
  language: string
  flag: string
  title: string
  description: string
  features: string[]
  color: string
}

// Пропсы и эмиты
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  complete: [result: any]
}>()

// Состояния теста
const currentQuestion = ref(0)
const answers = ref<TestAnswers>({
  goal: null,
  level: null,
  format: null
})
const selectingOption = ref<string | null>(null)

// Опции вопросов (без изменений)
const goalOptions = ref([
  {
    id: 'career',
    title: 'Для карьеры',
    description: 'Повышение квалификации, работа в международной компании',
    icon: '💼'
  },
  {
    id: 'study',
    title: 'Для учебы',
    description: 'Поступление в зарубежный вуз, академические цели',
    icon: '🎓'
  },
  {
    id: 'travel',
    title: 'Для путешествий',
    description: 'Свободное общение в поездках, понимание культуры',
    icon: '✈️'
  },
  {
    id: 'hobby',
    title: 'Для себя',
    description: 'Личное развитие, интерес к языку и культуре',
    icon: '🌟'
  }
])

const levelOptions = ref([
  {
    id: 'beginner',
    title: 'Начинающий',
    description: 'Только начинаю изучение, знаю базовые фразы'
  },
  {
    id: 'intermediate',
    title: 'Продолжающий',
    description: 'Могу поддержать простой разговор, есть базовые знания'
  },
  {
    id: 'advanced',
    title: 'Продвинутый',
    description: 'Свободно говорю, хочу улучшить профессиональные навыки'
  }
])

const formatOptions = ref([
  {
    id: 'video',
    title: 'Видео-уроки',
    description: 'Наглядное обучение с преподавателем',
    icon: '🎥'
  },
  {
    id: 'interactive',
    title: 'Интерактив',
    description: 'Игры, упражнения, практика в реальных ситуациях',
    icon: '🎮'
  },
  {
    id: 'structured',
    title: 'Структурированный курс',
    description: 'Пошаговое обучение по проверенной методике',
    icon: '📚'
  },
  {
    id: 'conversation',
    title: 'Разговорная практика',
    description: 'Общение с носителями, дискуссии, диалоги',
    icon: '💬'
  }
])

// Computed свойства
const progressStyle = computed(() => ({
  width: `${((currentQuestion.value + 1) / 4) * 100}%`
}))

const recommendedCourse = computed<CourseRecommendation>(() => {
  const baseCourse = {
    language: 'Английский',
    flag: '🇬🇧',
    title: 'Интенсивный курс для ваших целей',
    description: 'Персональная программа, сочетающая лучшие методики под ваш запрос',
    features: [
      'Персональный план обучения',
      'Интерактивные упражнения',
      'Разговорная практика',
      'Поддержка куратора'
    ],
    color: '#8b5cf6'
  }

  if (answers.value.goal === 'career') {
    baseCourse.title = 'Бизнес-английский для карьеры'
    baseCourse.features.push('Деловая лексика', 'Подготовка к собеседованию')
  } else if (answers.value.goal === 'travel') {
    baseCourse.title = 'Английский для путешественников'
    baseCourse.features.push('Туристические диалоги', 'Культурные особенности')
  }

  return baseCourse
})

const resultCardStyle = computed(() => ({
  borderLeft: `4px solid ${recommendedCourse.value.color}`
}))

// Методы с автоматическим переходом
const selectGoal = async (goal: string) => {
  selectingOption.value = goal
  answers.value.goal = goal
  
  await nextTick()
  setTimeout(() => {
    selectingOption.value = null
    if (currentQuestion.value === 0) {
      currentQuestion.value = 1
    }
  }, 300)
}

const selectLevel = async (level: string) => {
  selectingOption.value = level
  answers.value.level = level
  
  await nextTick()
  setTimeout(() => {
    selectingOption.value = null
    if (currentQuestion.value === 1) {
      currentQuestion.value = 2
    }
  }, 300)
}

const selectFormat = async (format: string) => {
  selectingOption.value = format
  answers.value.format = format
  
  await nextTick()
  setTimeout(() => {
    selectingOption.value = null
    if (currentQuestion.value === 2) {
      currentQuestion.value = 3
    }
  }, 300)
}

const prevQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  }
}

const startCourse = () => {
  emit('complete', {
    answers: answers.value,
    course: recommendedCourse.value
  })
  closeTest()
}

const seeAllCourses = () => {
  closeTest()
}

const closeTest = () => {
  emit('close')
  setTimeout(() => {
    currentQuestion.value = 0
    answers.value = { goal: null, level: null, format: null }
    selectingOption.value = null
  }, 300)
}

// Следим за открытием/закрытием
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentQuestion.value = 0
    answers.value = { goal: null, level: null, format: null }
    selectingOption.value = null
  }
})
</script>

<style lang="scss" scoped>
.test-wizard {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.test-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.test-modal {
  position: relative;
  background: #1a1a1a;
  border-radius: 20px;
  border: 1px solid #2d2d2d;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.test-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #2d2d2d;
  
  h2 {
    color: #f8fafc;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  p {
    color: #94a3b8;
    margin-bottom: 1.5rem;
  }
}

.test-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background: #2d2d2d;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #8b5cf6, #10b981);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    color: #94a3b8;
    font-size: 0.9rem;
    white-space: nowrap;
  }
}

.test-content {
  padding: 2rem;
}

.question {
  h3 {
    color: #f8fafc;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    text-align: center;
  }
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.option-card {
  background: #2d2d2d;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }
  
  &.selected {
    border-color: #8b5cf6;
    background: linear-gradient(135deg, #2d2d2d, #8b5cf620);
  }
  
  .option-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    color: #f8fafc;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  p {
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #2d2d2d;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
  }
  
  &.selected {
    border-color: #8b5cf6;
    background: linear-gradient(135deg, #2d2d2d, #8b5cf620);
    
    .option-check::after {
      content: '✓';
      color: #8b5cf6;
      font-weight: bold;
    }
  }
  
  .option-check {
    width: 20px;
    height: 20px;
    border: 2px solid #94a3b8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .option-content {
    h4 {
      color: #f8fafc;
      margin-bottom: 0.25rem;
      font-size: 1.1rem;
    }
    
    p {
      color: #94a3b8;
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }
}

.option-card, .option-item {
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &.selecting {
    transform: scale(0.95);
    opacity: 0.8;
  }
  
  &.selected {
    border-color: #8b5cf6 !important;
    background: linear-gradient(135deg, #2d2d2d, #8b5cf620) !important;
    transform: scale(1.02);
  }
}

.option-item .selection-badge {
  background: #8b5cf6;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: auto;
  animation: slideIn 0.3s ease;
}

.check-mark {
  color: #8b5cf6;
  font-weight: bold;
  font-size: 0.9rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}


.result {
  text-align: center;
  
  .result-success {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #f8fafc;
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }
}

.result-card {
  background: #2d2d2d;
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
  
  .result-language {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    
    .flag {
      font-size: 1.5rem;
    }
    
    .name {
      color: #f8fafc;
      font-weight: 600;
      font-size: 1.2rem;
    }
  }
  
  h4 {
    color: #f8fafc;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
  
  p {
    color: #94a3b8;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
}

.result-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  .feature {
    color: #10b981;
    font-size: 0.9rem;
  }
}

.result-actions {
  display: flex;
  gap: 1rem;
  
  button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-primary {
    background: #8b5cf6;
    color: white;
    
    &:hover {
      background: #7c3aed;
      transform: translateY(-2px);
    }
  }
  
  .btn-secondary {
    background: transparent;
    color: #94a3b8;
    border: 2px solid #2d2d2d;
    
    &:hover {
      border-color: #8b5cf6;
      color: #f8fafc;
    }
  }
}

.test-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #2d2d2d;
  gap: 1rem;
  
  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .navigation-spacer {
  flex: 1;
}

.btn-back, .btn-skip {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #94a3b8;
  
  &:hover {
    color: #f8fafc;
    background: #2d2d2d;
  }
}

  
  .btn-next, .btn-complete {
    background: #8b5cf6;
    color: white;
    
    &:hover {
      background: #7c3aed;
      transform: translateY(-2px);
    }
  }
  
  .btn-skip {
    background: transparent;
    color: #94a3b8;
    
    &:hover {
      color: #f8fafc;
    }
  }
}

// Адаптивность
@media (max-width: 640px) {
  .test-modal {
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .test-navigation {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
  
  .result-actions {
    flex-direction: column;
  }
}
</style>