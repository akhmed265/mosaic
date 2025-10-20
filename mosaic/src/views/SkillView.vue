<template>
  <div class="skill-view">
    <div class="container">
      <!-- Хлебные крошки -->
      <div class="breadcrumbs">
        <button class="back-btn" @click="goBack">
          ← Назад к карте развития
        </button>
      </div>

      <!-- Заголовок навыка -->
      <div class="skill-header">
        <div class="skill-badge" :style="{ background: skillColor }">
          {{ categoryIcon }}
        </div>
        <div class="skill-info">
          <h1>{{ currentSkill?.title }}</h1>
          <p class="skill-description">{{ currentSkill?.description }}</p>
          <div class="skill-meta">
            <span>Уровень {{ currentSkill?.level }}</span>
            <span>•</span>
            <span>⏱️ {{ currentSkill?.duration }}</span>
            <span>•</span>
            <span>📝 {{ currentSkill?.exercises }} упражнений</span>
            <span>•</span>
            <span>⭐ +{{ currentSkill?.xp }} XP</span>
          </div>
        </div>
      </div>

      <!-- Прогресс навыка -->
      <div class="skill-progress-section">
        <div class="progress-header">
          <h3>Ваш прогресс</h3>
          <span class="progress-percent">{{ currentSkill?.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="progressStyle"></div>
        </div>
      </div>

      <!-- Уроки и упражнения -->
      <div class="lessons-section">
        <h3>Содержание курса</h3>
        <div class="lessons-list">
          <div 
            v-for="lesson in lessons" 
            :key="lesson.id"
            class="lesson-card"
            :class="{ completed: lesson.completed, active: currentLesson?.id === lesson.id }"
            @click="selectLesson(lesson)"
          >
            <div class="lesson-check">
              {{ lesson.completed ? '✓' : lesson.number }}
            </div>
            <div class="lesson-content">
              <h4>{{ lesson.title }}</h4>
              <p>{{ lesson.description }}</p>
              <div class="lesson-meta">
                <span>🕒 {{ lesson.duration }}</span>
                <span>🎯 {{ lesson.exercisesCount }} заданий</span>
              </div>
            </div>
            <button 
              class="lesson-action"
              @click.stop="startLesson(lesson)"
            >
              {{ lesson.completed ? 'Повторить' : 'Начать' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Быстрые действия -->
      <div class="quick-actions">
        <button class="action-btn primary" @click="startNextLesson">
          {{ nextLesson ? 'Продолжить обучение' : 'Начать первый урок' }}
        </button>
        <button class="action-btn secondary" @click="practiceMode">
          📝 Тренировочный режим
        </button>
      </div>
    </div>

    <!-- Модальное окно урока -->
    <LessonModal 
      v-if="showLessonModal"
      :lesson="currentLesson"
      :skill="currentSkill"
      @complete="completeLesson"
      @close="closeLesson"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Skill } from '@/types/learning'
import LessonModal from '@/components/learning/LessonModal.vue'

const route = useRoute()
const router = useRouter()

// Данные текущего навыка (в реальном приложении - загрузка по ID)
const currentSkill = ref<Skill | null>(null)
const currentLesson = ref<any>(null)
const showLessonModal = ref(false)

// Временные данные уроков
const lessons = ref([
  {
    id: 'lesson-1',
    number: 1,
    title: 'Введение в тему',
    description: 'Основные понятия и теория',
    duration: '15 минут',
    exercisesCount: 3,
    completed: false,
    type: 'theory'
  },
  {
    id: 'lesson-2',
    number: 2,
    title: 'Практические упражнения',
    description: 'Закрепление материала на практике',
    duration: '20 минут',
    exercisesCount: 5,
    completed: false,
    type: 'practice'
  },
  {
    id: 'lesson-3',
    number: 3,
    title: 'Диалоги и примеры',
    description: 'Реальные примеры использования',
    duration: '25 минут',
    exercisesCount: 4,
    completed: false,
    type: 'conversation'
  },
  {
    id: 'lesson-4',
    number: 4,
    title: 'Финальный тест',
    description: 'Проверка полученных знаний',
    duration: '30 минут',
    exercisesCount: 10,
    completed: false,
    type: 'test'
  }
])

// Computed свойства
const skillColor = computed(() => currentSkill.value ? '#8b5cf6' : '#64748b')
const categoryIcon = computed(() => {
  if (!currentSkill.value) return '📚'
  const icons = {
    basics: '🔤',
    grammar: '📚',
    vocabulary: '📝',
    conversation: '💬',
    business: '💼'
  }
  return icons[currentSkill.value.category] || '📚'
})

const progressStyle = computed(() => ({
  width: `${currentSkill.value?.progress || 0}%`,
  background: skillColor.value
}))

const nextLesson = computed(() => {
  return lessons.value.find(lesson => !lesson.completed)
})

// Методы
const goBack = () => {
  router.push('/learning-map')
}

const loadSkillData = () => {
  const skillId = route.params.id as string
  // Временные данные - в реальном приложении загрузка с API
  currentSkill.value = {
    id: skillId,
    title: 'Present Simple',
    description: 'Освойте базовое настоящее время в английском языке',
    level: 2,
    category: 'grammar',
    status: 'available',
    progress: 30,
    duration: '3 часа',
    exercises: 20,
    xp: 150,
    nextSkills: ['en-grammar2'],
    requiredSkills: ['en-basics']
  }
}

const selectLesson = (lesson: any) => {
  currentLesson.value = lesson
}

const startLesson = (lesson: any) => {
  currentLesson.value = lesson
  showLessonModal.value = true
}

const startNextLesson = () => {
  const lesson = nextLesson.value
  if (lesson) {
    startLesson(lesson)
  }
}

const completeLesson = () => {
  if (currentLesson.value) {
    currentLesson.value.completed = true
    // Обновляем прогресс навыка
    if (currentSkill.value) {
      const completedLessons = lessons.value.filter(l => l.completed).length
      currentSkill.value.progress = Math.round((completedLessons / lessons.value.length) * 100)
    }
  }
  showLessonModal.value = false
}

const closeLesson = () => {
  showLessonModal.value = false
}

const practiceMode = () => {
  alert('Режим тренировки запущен! 🏋️')
}

onMounted(() => {
  loadSkillData()
})
</script>

<style lang="scss" scoped>
.skill-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 2rem 50px;
}

.breadcrumbs {
  margin-bottom: 2rem;
}

.back-btn {
  background: transparent;
  border: none;
  color: #8b5cf6;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  font-size: 1rem;
  
  &:hover {
    color: #7c3aed;
  }
}

.skill-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  .skill-badge {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .skill-info {
    flex: 1;
    
    h1 {
      color: #f8fafc;
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    .skill-description {
      color: #94a3b8;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    
    .skill-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      
      span {
        color: #64748b;
        font-weight: 600;
      }
    }
  }
}

.skill-progress-section {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h3 {
      color: #f8fafc;
      margin: 0;
    }
    
    .progress-percent {
      color: v-bind(skillColor);
      font-weight: 700;
      font-size: 1.2rem;
    }
  }
  
  .progress-bar {
    height: 8px;
    background: #2d2d2d;
    border-radius: 4px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
  }
}

.lessons-section {
  h3 {
    color: #f8fafc;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.lesson-card {
  background: #1a1a1a;
  border: 2px solid #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
  }
  
  &.completed {
    border-color: #10b981;
    background: linear-gradient(135deg, #1a1a1a, #10b98120);
  }
  
  &.active {
    border-color: #8b5cf6;
    background: linear-gradient(135deg, #1a1a1a, #8b5cf620);
  }
  
  .lesson-check {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #2d2d2d;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f8fafc;
    font-weight: 700;
    flex-shrink: 0;
  }
  
  &.completed .lesson-check {
    background: #10b981;
  }
  
  .lesson-content {
    flex: 1;
    
    h4 {
      color: #f8fafc;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }
    
    p {
      color: #94a3b8;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }
    
    .lesson-meta {
      display: flex;
      gap: 1rem;
      
      span {
        color: #64748b;
        font-size: 0.8rem;
      }
    }
  }
  
  .lesson-action {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    
    &:hover {
      background: #7c3aed;
    }
  }
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
  .skill-header {
    flex-direction: column;
    text-align: center;
    
    .skill-info {
      .skill-meta {
        justify-content: center;
      }
    }
  }
  
  .lesson-card {
    flex-direction: column;
    text-align: center;
    
    .lesson-content {
      .lesson-meta {
        justify-content: center;
      }
    }
  }
  
  .quick-actions {
    flex-direction: column;
    
    .action-btn {
      width: 100%;
    }
  }
}
</style>