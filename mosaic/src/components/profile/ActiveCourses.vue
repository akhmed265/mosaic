<template>
  <div class="active-courses">
    <div class="section-header">
      <h2 class="section-title">🎯 Активные курсы</h2>
      <button class="view-all-btn" @click="viewAllCourses">
        Все курсы →
      </button>
    </div>

    <div class="courses-grid">
      <div 
        v-for="course in activeCourses" 
        :key="course.id"
        class="course-card"
        :class="`course--${course.status}`"
        @click="openCourse(course)"
      >
        <div class="course-header">
          <div class="course-icon" :style="{ background: course.color }">
            {{ getCategoryIcon(course.category) }}
          </div>
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-description">{{ course.description }}</p>
          </div>
        </div>

        <div class="course-progress">
          <ProgressBar
            :value="course.progress"
            :color="course.color"
            :height="6"
            :show-info="false"
          />
          <div class="progress-info">
            <span class="progress-text">Прогресс</span>
            <span class="progress-percent">{{ course.progress }}%</span>
          </div>
        </div>

        <div class="course-meta">
          <div class="meta-item">
            <span class="meta-icon">📝</span>
            <span class="meta-text">{{ course.lessonsCompleted }}/{{ course.totalLessons }} уроков</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">⏱️</span>
            <span class="meta-text">{{ course.timeLeft }}</span>
          </div>
        </div>

        <div class="course-actions">
          <button 
            class="continue-btn"
            @click.stop="continueCourse(course)"
          >
            Продолжить
          </button>
          <button 
            class="review-btn"
            @click.stop="reviewCourse(course)"
          >
            Повторить
          </button>
        </div>

        <!-- Бейдж текущего курса -->
        <div v-if="course.isCurrent" class="current-badge">
          Текущий
        </div>
      </div>
    </div>

    <!-- Сообщение если нет активных курсов -->
    <div v-if="activeCourses.length === 0" class="no-courses">
      <div class="no-courses-icon">📚</div>
      <h3>Нет активных курсов</h3>
      <p>Начните изучение нового курса чтобы увидеть его здесь</p>
      <button class="explore-btn" @click="exploreCourses">
        Найти курсы
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/common/ProgressBar.vue'

// Данные активных курсов (заглушка)
const coursesData = [
  {
    id: 1,
    title: 'Английский для начинающих',
    description: 'Основы грамматики и базовый словарь',
    category: 'basics',
    progress: 65,
    lessonsCompleted: 13,
    totalLessons: 20,
    timeLeft: '2 недели',
    color: '#8b5cf6',
    status: 'active',
    isCurrent: true
  },
  {
    id: 2,
    title: 'Деловой английский',
    description: 'Профессиональная лексика для работы',
    category: 'business',
    progress: 30,
    lessonsCompleted: 6,
    totalLessons: 20,
    timeLeft: '1 месяц',
    color: '#10b981',
    status: 'active',
    isCurrent: false
  },
  {
    id: 3,
    title: 'Разговорная практика',
    description: 'Улучшение навыков общения',
    category: 'conversation',
    progress: 45,
    lessonsCompleted: 9,
    totalLessons: 20,
    timeLeft: '3 недели',
    color: '#f59e0b',
    status: 'active',
    isCurrent: false
  }
]

// Computed свойства
const activeCourses = computed(() => coursesData.filter(course => course.status === 'active'))

// Методы
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    basics: '🔤',
    grammar: '📚',
    vocabulary: '📝',
    conversation: '💬',
    business: '💼',
    reading: '📖',
    listening: '🎧',
    writing: '✍️'
  }
  return icons[category] || '📚'
}

const openCourse = (course: any) => {
  console.log('Открываем курс:', course.title)
  // Навигация к курсу
}

const continueCourse = (course: any) => {
  console.log('Продолжаем курс:', course.title)
  // Логика продолжения курса
}

const reviewCourse = (course: any) => {
  console.log('Повторяем курс:', course.title)
  // Логика повторения курса
}

const viewAllCourses = () => {
  console.log('Просмотр всех курсов')
  // Навигация к списку всех курсов
}

const exploreCourses = () => {
  console.log('Поиск новых курсов')
  // Навигация к каталогу курсов
}
</script>

<style lang="scss" scoped>
.active-courses {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
  margin-bottom: 2rem;
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

.view-all-btn {
  background: transparent;
  border: 1px solid #8b5cf6;
  color: #8b5cf6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #8b5cf6;
    color: white;
  }
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }

  &.course--active {
    border-left: 4px solid v-bind('coursesData[0]?.color || "#8b5cf6"');
  }
}

.course-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.course-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.course-info {
  flex: 1;

  .course-title {
    color: #f8fafc;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .course-description {
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

.course-progress {
  margin-bottom: 1rem;

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;

    .progress-text {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .progress-percent {
      color: #f8fafc;
      font-size: 0.9rem;
      font-weight: 700;
    }
  }
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .meta-icon {
    font-size: 0.9rem;
  }

  .meta-text {
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.course-actions {
  display: flex;
  gap: 0.75rem;

  .continue-btn {
    flex: 1;
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #7c3aed;
    }
  }

  .review-btn {
    background: transparent;
    border: 1px solid #64748b;
    color: #94a3b8;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #8b5cf6;
      color: #8b5cf6;
    }
  }
}

.current-badge {
  position: absolute;
  top: -8px;
  right: 1rem;
  background: #8b5cf6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.no-courses {
  text-align: center;
  padding: 3rem 2rem;

  .no-courses-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: #f8fafc;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #94a3b8;
    margin-bottom: 1.5rem;
  }

  .explore-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #7c3aed;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .course-actions {
    flex-direction: column;
  }
}
</style>