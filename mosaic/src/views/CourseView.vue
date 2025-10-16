<template>
  <div class="course-view">
    <div class="container">
      <!-- Хлебные крошки -->
      <div class="breadcrumbs">
        <router-link to="/learning-map">← Назад к карте развития</router-link>
      </div>

      <!-- Заголовок курса -->
      <div class="course-header">
        <h1>{{ course.title }}</h1>
        <p class="course-description">{{ course.description }}</p>
        
        <div class="course-meta">
          <span class="meta-item">⏱️ {{ course.estimatedTime }}</span>
          <span class="meta-item">📝 {{ course.exercises }} упражнений</span>
          <span class="meta-item">⭐ +{{ course.rewards.xp }} XP</span>
        </div>
      </div>

      <!-- Контент курса -->
      <div class="course-content">
        <div class="lessons-list">
          <h3>Уроки курса</h3>
          <div 
            v-for="lesson in course.lessons" 
            :key="lesson.id"
            class="lesson-item"
            :class="{ completed: lesson.completed }"
          >
            <div class="lesson-check">
              {{ lesson.completed ? '✓' : '○' }}
            </div>
            <div class="lesson-content">
              <h4>{{ lesson.title }}</h4>
              <p>{{ lesson.description }}</p>
              <div class="lesson-meta">
                <span>🕒 {{ lesson.duration }}</span>
                <span>🎯 {{ lesson.exercisesCount }} упр.</span>
              </div>
            </div>
            <button 
              class="lesson-start-btn"
              @click="startLesson(lesson)"
            >
              {{ lesson.completed ? 'Повторить' : 'Начать' }}
            </button>
          </div>
        </div>

        <!-- Боковая панель -->
        <div class="course-sidebar">
          <div class="progress-card">
            <h4>Ваш прогресс</h4>
            <div class="progress-circle">
              <div class="circle-value">{{ courseProgress }}%</div>
            </div>
            <p>{{ completedLessons }}/{{ course.lessons.length }} уроков завершено</p>
          </div>

          <div class="resources-card">
            <h4>Ресурсы</h4>
            <div class="resource-item">
              <span>📚 Презентация</span>
              <button @click="downloadResource">Скачать</button>
            </div>
            <div class="resource-item">
              <span>🎧 Аудио материалы</span>
              <button @click="downloadResource">Скачать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Данные курса (в реальном приложении будут загружаться по ID)
const course = computed(() => {
  const courseId = route.params.id as string
  return getCourseById(courseId)
})

const courseProgress = computed(() => {
  const completed = course.value.lessons.filter(lesson => lesson.completed).length
  return Math.round((completed / course.value.lessons.length) * 100)
})

const completedLessons = computed(() => {
  return course.value.lessons.filter(lesson => lesson.completed).length
})

const startLesson = (lesson: any) => {
  console.log('Начинаем урок:', lesson.title)
  // Здесь будет логика начала урока
}

const downloadResource = () => {
  console.log('Скачивание ресурса')
}

// Временная функция для получения курса
const getCourseById = (id: string) => {
  const courses: any = {
    'basic-greetings': {
      id: 'basic-greetings',
      title: 'Основные приветствия',
      description: 'Научитесь знакомиться и приветствовать людей на английском языке',
      estimatedTime: '30 минут',
      exercises: 5,
      rewards: { xp: 100 },
      lessons: [
        {
          id: 'greet-1',
          title: 'Приветствия и прощания',
          description: 'Базовые фразы для начала и окончания разговора',
          duration: '10 мин',
          exercisesCount: 2,
          completed: true
        },
        {
          id: 'greet-2', 
          title: 'Знакомство',
          description: 'Как представиться и спросить имя собеседника',
          duration: '15 мин',
          exercisesCount: 3,
          completed: false
        }
      ]
    },
    'present-simple': {
      id: 'present-simple',
      title: 'Present Simple',
      description: 'Освойте базовое настоящее время в английском языке',
      estimatedTime: '1 час',
      exercises: 12,
      rewards: { xp: 200 },
      lessons: [
        {
          id: 'ps-1',
          title: 'Утверждения',
          description: 'Построение простых утвердительных предложений',
          duration: '20 мин',
          exercisesCount: 4,
          completed: false
        },
        {
          id: 'ps-2',
          title: 'Вопросы',
          description: 'Как задавать вопросы в Present Simple',
          duration: '25 мин', 
          exercisesCount: 5,
          completed: false
        }
      ]
    }
  }
  
  return courses[id] || courses['basic-greetings']
}

onMounted(() => {
  console.log('Загружен курс:', course.value)
})
</script>

<style lang="scss" scoped>
.course-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 2rem 0;
}

.breadcrumbs {
  margin-bottom: 2rem;
  
  a {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      color: #7c3aed;
    }
  }
}

.course-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: #f8fafc;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .course-description {
    color: #94a3b8;
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 1.5rem;
  }
  
  .course-meta {
    display: flex;
    justify-content: center;
    gap: 2rem;
    
    .meta-item {
      color: #64748b;
      font-weight: 600;
    }
  }
}

.course-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.lessons-list {
  h3 {
    color: #f8fafc;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
}

.lesson-item {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &.completed {
    border-color: #10b981;
    background: linear-gradient(135deg, #1a1a1a, #10b98120);
  }
  
  &:hover {
    border-color: #8b5cf6;
  }
  
  .lesson-check {
    color: #10b981;
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 0.25rem;
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
  
  .lesson-start-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #7c3aed;
    }
  }
}

.course-sidebar {
  .progress-card, .resources-card {
    background: #1a1a1a;
    border: 1px solid #2d2d2d;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    
    h4 {
      color: #f8fafc;
      margin-bottom: 1rem;
    }
  }
  
  .progress-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: conic-gradient(#10b981 0% 75%, #2d2d2d 75% 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    
    .circle-value {
      color: #f8fafc;
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
  
  .resource-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #2d2d2d;
    
    &:last-child {
      border-bottom: none;
    }
    
    span {
      color: #94a3b8;
    }
    
    button {
      background: transparent;
      color: #8b5cf6;
      border: 1px solid #8b5cf6;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      
      &:hover {
        background: #8b5cf6;
        color: white;
      }
    }
  }
}
</style>