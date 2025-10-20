<template>
  <div class="lesson-modal-overlay" @click.self="closeModal">
    <div class="lesson-modal">
      <!-- Заголовок модалки -->
      <div class="modal-header">
        <div class="lesson-info">
          <h2>{{ lesson.title }}</h2>
          <p class="lesson-description">{{ lesson.description }}</p>
          <div class="lesson-meta">
            <span>🕒 {{ lesson.duration }}</span>
            <span>🎯 {{ lesson.exercisesCount }} заданий</span>
            <span>📚 {{ getLessonTypeText(lesson.type) }}</span>
          </div>
        </div>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Контент урока -->
      <div class="lesson-content">
        <!-- Теория -->
        <div v-if="currentStep === 'theory'" class="theory-section">
          <h3>Теоретический материал</h3>
          <div class="theory-content">
            <p>В этом уроке вы изучите основные принципы и правила.</p>
            
            <div class="example-card">
              <h4>Пример:</h4>
              <div class="example-text">
                <p><strong>Present Simple</strong> используется для описания регулярных действий, фактов и постоянных состояний.</p>
                <p><em>Пример: "I work every day." (Я работаю каждый день)</em></p>
              </div>
            </div>

            <div class="key-points">
              <h4>Ключевые моменты:</h4>
              <ul>
                <li>✅ Используется для привычек и распорядка</li>
                <li>✅ Описывает факты и общие истины</li>
                <li>✅ Для расписаний и программ</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Практика -->
        <div v-if="currentStep === 'practice'" class="practice-section">
          <h3>Практическое упражнение</h3>
          <div class="exercise">
            <div class="exercise-question">
              <p>Выберите правильную форму глагола:</p>
              <div class="sentence">
                She <span class="gap">{{ userAnswer || '______' }}</span> to school every day.
              </div>
            </div>

            <div class="exercise-options">
              <button
                v-for="option in exerciseOptions"
                :key="option"
                class="option-btn"
                :class="{
                  selected: userAnswer === option,
                  correct: showResult && option === 'goes',
                  wrong: showResult && userAnswer === option && option !== 'goes'
                }"
                @click="selectAnswer(option)"
                :disabled="showResult"
              >
                {{ option }}
              </button>
            </div>

            <div v-if="showResult" class="exercise-result">
              <div v-if="isAnswerCorrect" class="result-correct">
                ✅ Правильно! Молодец!
              </div>
              <div v-else class="result-wrong">
                ❌ Неправильно. Правильный ответ: "goes"
              </div>
              <div class="explanation">
                <p><strong>Объяснение:</strong> С подлежащим "she" используется форма "goes".</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Результат -->
        <div v-if="currentStep === 'result'" class="result-section">
          <div class="completion-animation">🎉</div>
          <h3>Урок завершен!</h3>
          <p>Вы успешно изучили материал и выполнили упражнения.</p>
          
          <div class="reward-card">
            <div class="reward-xp">+25 XP</div>
            <div class="reward-progress">Прогресс навыка: +10%</div>
          </div>
        </div>
      </div>

      <!-- Навигация -->
      <div class="modal-navigation">
        <button 
          v-if="currentStep === 'theory'" 
          class="nav-btn primary"
          @click="currentStep = 'practice'"
        >
          Перейти к практике →
        </button>

        <button 
          v-if="currentStep === 'practice' && !showResult" 
          class="nav-btn primary"
          @click="checkAnswer"
          :disabled="!userAnswer"
        >
          Проверить ответ
        </button>

        <button 
          v-if="currentStep === 'practice' && showResult" 
          class="nav-btn primary"
          @click="completeLesson"
        >
          Завершить урок →
        </button>

        <button 
          v-if="currentStep === 'result'" 
          class="nav-btn primary"
          @click="closeModal"
        >
          Вернуться к навыку
        </button>

        <button 
          v-if="currentStep !== 'theory'" 
          class="nav-btn secondary"
          @click="previousStep"
        >
          ← Назад
        </button>
      </div>

      <!-- Прогресс-бар урока -->
      <div class="lesson-progress">
        <div class="progress-steps">
          <div 
            v-for="step in steps" 
            :key="step.id"
            class="progress-step"
            :class="{
              completed: currentStepIndex > step.index,
              active: currentStepIndex === step.index
            }"
          >
            <div class="step-dot"></div>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Skill } from '@/types/learning'

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  exercisesCount: number
  type: string
}

interface Props {
  lesson: Lesson
  skill?: Skill
}

interface Emits {
  (e: 'complete'): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Состояния
const currentStep = ref<'theory' | 'practice' | 'result'>('theory')
const userAnswer = ref('')
const showResult = ref(false)

// Данные упражнения
const exerciseOptions = ref(['go', 'goes', 'going', 'went'])
const steps = ref([
  { id: 'theory', label: 'Теория', index: 0 },
  { id: 'practice', label: 'Практика', index: 1 },
  { id: 'result', label: 'Результат', index: 2 }
])

// Computed свойства
const currentStepIndex = computed(() => {
  return steps.value.findIndex(step => step.id === currentStep.value)
})

const isAnswerCorrect = computed(() => {
  return userAnswer.value === 'goes'
})

const getLessonTypeText = (type: string) => {
  const types = {
    theory: 'Теория',
    practice: 'Практика',
    conversation: 'Диалоги',
    test: 'Тест'
  }
  return types[type as keyof typeof types] || type
}

// Методы
const selectAnswer = (option: string) => {
  userAnswer.value = option
}

const checkAnswer = () => {
  showResult.value = true
}

const completeLesson = () => {
  currentStep.value = 'result'
  // Через 2 секунды автоматически закрываем и эмитим complete
  setTimeout(() => {
    emit('complete')
  }, 2000)
}

const previousStep = () => {
  if (currentStep.value === 'practice') {
    currentStep.value = 'theory'
    showResult.value = false
    userAnswer.value = ''
  } else if (currentStep.value === 'result') {
    currentStep.value = 'practice'
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.lesson-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.lesson-modal {
  background: #1a1a1a;
  border-radius: 20px;
  border: 1px solid #2d2d2d;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #2d2d2d;
  
  .lesson-info {
    flex: 1;
    
    h2 {
      color: #f8fafc;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .lesson-description {
      color: #94a3b8;
      margin-bottom: 1rem;
    }
    
    .lesson-meta {
      display: flex;
      gap: 1rem;
      
      span {
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 600;
      }
    }
  }
  
  .close-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    
    &:hover {
      background: #2d2d2d;
      color: #f8fafc;
    }
  }
}

.lesson-content {
  padding: 2rem;
  min-height: 300px;
}

.theory-section, .practice-section, .result-section {
  h3 {
    color: #f8fafc;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }
}

.theory-content {
  p {
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
}

.example-card {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  
  h4 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }
  
  .example-text {
    p {
      color: #94a3b8;
      margin-bottom: 0.5rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.key-points {
  ul {
    list-style: none;
    padding: 0;
    
    li {
      color: #94a3b8;
      margin-bottom: 0.5rem;
      padding-left: 0;
    }
  }
}

.exercise {
  .exercise-question {
    margin-bottom: 2rem;
    
    p {
      color: #94a3b8;
      margin-bottom: 1rem;
    }
    
    .sentence {
      color: #f8fafc;
      font-size: 1.2rem;
      font-weight: 600;
      
      .gap {
        color: #8b5cf6;
        text-decoration: underline;
      }
    }
  }
}

.exercise-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-btn {
  background: #2d2d2d;
  border: 2px solid #2d2d2d;
  border-radius: 12px;
  padding: 1rem;
  color: #f8fafc;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: #8b5cf6;
  }
  
  &.selected {
    border-color: #8b5cf6;
    background: #8b5cf620;
  }
  
  &.correct {
    border-color: #10b981;
    background: #10b98120;
  }
  
  &.wrong {
    border-color: #ef4444;
    background: #ef444420;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.exercise-result {
  .result-correct {
    color: #10b981;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .result-wrong {
    color: #ef4444;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .explanation {
    background: #2d2d2d;
    border-radius: 12px;
    padding: 1rem;
    
    p {
      color: #94a3b8;
      margin: 0;
    }
  }
}

.result-section {
  text-align: center;
  
  .completion-animation {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 1s ease infinite;
  }
  
  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }
  
  p {
    color: #94a3b8;
    margin-bottom: 2rem;
  }
}

.reward-card {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  
  .reward-xp {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .reward-progress {
    font-size: 0.9rem;
    opacity: 0.9;
  }
}

.modal-navigation {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0 2rem 2rem;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: #8b5cf6;
    color: white;
    
    &:hover:not(:disabled) {
      background: #7c3aed;
    }
    
    &:disabled {
      background: #64748b;
      cursor: not-allowed;
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

.lesson-progress {
  padding: 0 2rem 2rem;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    height: 2px;
    background: #2d2d2d;
    z-index: 1;
  }
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  
  .step-dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #2d2d2d;
    border: 2px solid #2d2d2d;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .step-label {
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  &.completed {
    .step-dot {
      background: #10b981;
      border-color: #10b981;
    }
    
    .step-label {
      color: #10b981;
    }
  }
  
  &.active {
    .step-dot {
      background: #8b5cf6;
      border-color: #8b5cf6;
    }
    
    .step-label {
      color: #8b5cf6;
    }
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

// Адаптивность
@media (max-width: 768px) {
  .lesson-modal {
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .lesson-content {
    padding: 1.5rem;
  }
  
  .exercise-options {
    grid-template-columns: 1fr;
  }
  
  .modal-navigation {
    flex-direction: column;
    
    .nav-btn {
      width: 100%;
    }
  }
}
</style>