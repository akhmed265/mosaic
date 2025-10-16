<template>
  <div class="course-card" :class="{ 'course-card--featured': course.isFeatured }">
    <!-- Бейдж "Рекомендуем" для избранных курсов -->
    <div v-if="course.isFeatured" class="featured-badge">
      ⭐ Рекомендуем
    </div>

    <!-- Прогресс-бар для начатых курсов -->
    <div v-if="course.progress !== undefined" class="progress-section">
      <div class="progress-header">
        <span class="progress-label">Ваш прогресс</span>
        <span class="progress-percent">{{ course.progress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="progressStyle"></div>
      </div>
    </div>

    <!-- Верхняя часть карточки -->
    <div class="course-header">
      <div class="course-language">
        <span class="language-flag">{{ course.flag }}</span>
        <span class="language-name">{{ course.language }}</span>
      </div>
      <div class="course-level" :class="`level--${course.level}`">
        {{ levelText }}
      </div>
    </div>

    <!-- Основная информация -->
    <div class="course-content">
      <h3 class="course-title">{{ course.title }}</h3>
      <p class="course-description">{{ course.description }}</p>

      <!-- Особенности курса -->
      <div class="course-features">
        <div v-for="feature in displayedFeatures" :key="feature" class="feature">
          ✓ {{ feature }}
        </div>
        <div v-if="course.features.length > 3" class="feature-more">
          + ещё {{ course.features.length - 3 }}
        </div>
      </div>

      <!-- Информация о курсе -->
      <div class="course-meta">
        <div class="meta-item">
          <span class="meta-icon">📚</span>
          <span>{{ course.lessons }} уроков</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">⏱️</span>
          <span>{{ course.duration }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">👥</span>
          <span>{{ formatStudents }}</span>
        </div>
      </div>
    </div>

    <!-- Инструктор -->
    <div class="course-instructor">
      <div class="instructor-avatar" :style="avatarStyle(course.instructor.name)"></div>
        <div class="instructor-info">
        <div class="instructor-name">{{ course.instructor.name }}</div>
        <div class="instructor-specialization">{{ course.instructor.specialization }}</div>
      </div>
    </div>

    <!-- Рейтинг и цена -->
    <div class="course-footer">
      <div class="course-rating">
        <div class="rating-stars">
          <span v-for="star in 5" :key="star" class="star" :class="getStarClass(star)">
            ★
          </span>
        </div>
        <div class="rating-value">
          {{ course.rating }}/5 • {{ course.students.toLocaleString() }} отзывов
        </div>
      </div>

      <div class="course-pricing">
        <div v-if="course.originalPrice" class="original-price">
          {{ formatPrice(course.originalPrice) }}
        </div>
        <div class="current-price">
          {{ formatPrice(course.price) }}
        </div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="course-actions">
      <button 
        v-if="course.progress !== undefined && course.progress > 0"
        class="btn-continue"
        @click="$emit('select', course)"
      >
        Продолжить обучение
      </button>
      <button 
        v-else
        class="btn-start"
        @click="$emit('select', course)"
      >
        Начать курс
      </button>
      
      <button class="btn-details" @click="$emit('details', course)">
        Подробнее
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Course } from '@/types/courses'

// Пропсы
const props = defineProps<{
  course: Course
}>()

defineEmits<{
  select: [course: Course]
  details: [course: Course]
}>()

// Функция для генерации аватарки (как в Sidebar)
const avatarStyle = (name: string) => {
  const shapes = ['circle', 'square', 'triangle', 'diamond']
  const colorPairs = [
    { primary: '#8b5cf6', secondary: '#7c3aed' },
    { primary: '#10b981', secondary: '#059669' },
    { primary: '#f59e0b', secondary: '#d97706' },
    { primary: '#ef4444', secondary: '#dc2626' },
    { primary: '#06b6d4', secondary: '#0891b2' }
  ]
  
  // Генерируем на основе имени для консистентности
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const shape = shapes[Math.abs(hash) % shapes.length]
  const colors = colorPairs[Math.abs(hash) % colorPairs.length]
  
  return {
    '--avatar-primary': colors.primary,
    '--avatar-secondary': colors.secondary,
    '--avatar-shape': shape
  }
}

// Computed свойства
const progressStyle = computed(() => ({
  width: `${props.course.progress}%`
}))

const levelText = computed(() => {
  const levels = {
    beginner: 'Начинающий',
    intermediate: 'Продолжающий',
    advanced: 'Продвинутый'
  }
  return levels[props.course.level]
})

const displayedFeatures = computed(() => {
  return props.course.features.slice(0, 3)
})

const formatStudents = computed(() => {
  if (props.course.students >= 1000) {
    return `${(props.course.students / 1000).toFixed(1)}k+`
  }
  return `${props.course.students}+`
})

// Методы
const getStarClass = (star: number) => {
  const rating = props.course.rating
  if (star <= Math.floor(rating)) {
    return 'star--filled'
  } else if (star - 0.5 <= rating) {
    return 'star--half'
  }
  return 'star--empty'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<style lang="scss" scoped>
.course-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    border-color: #8b5cf6;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px #8b5cf620;
  }

  &--featured {
    border: 2px solid #f59e0b;
    
    &:hover {
      border-color: #f59e0b;
      box-shadow: 
        0 20px 40px rgba(245, 158, 11, 0.2),
        0 0 0 1px #f59e0b20;
    }
  }
}

.featured-badge {
  position: absolute;
  top: -12px;
  right: 1.5rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.progress-section {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 12px;
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    
    .progress-label {
      color: #94a3b8;
      font-size: 0.9rem;
    }
    
    .progress-percent {
      color: #10b981;
      font-weight: 600;
      font-size: 0.9rem;
    }
  }
  
  .progress-bar {
    height: 6px;
    background: #404040;
    border-radius: 3px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      border-radius: 3px;
      transition: width 0.5s ease;
    }
  }
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.course-language {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .language-flag {
    font-size: 1.5rem;
  }
  
  .language-name {
    color: #f8fafc;
    font-weight: 600;
    font-size: 0.9rem;
  }
}

.course-level {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  &.level--beginner {
    background: #10b98120;
    color: #10b981;
    border: 1px solid #10b98140;
  }
  
  &.level--intermediate {
    background: #f59e0b20;
    color: #f59e0b;
    border: 1px solid #f59e0b40;
  }
  
  &.level--advanced {
    background: #ef444420;
    color: #ef4444;
    border: 1px solid #ef444440;
  }
}

.course-content {
  flex: 1;
  margin-bottom: 1.5rem;
}

.course-title {
  color: #f8fafc;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.course-description {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  .feature {
    color: #10b981;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .feature-more {
    color: #64748b;
    font-size: 0.8rem;
    font-style: italic;
  }
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.85rem;
    
    .meta-icon {
      font-size: 1rem;
    }
  }
}

.course-instructor {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  
  .instructor-avatar {
    width: 40px;
    height: 40px;
    background: #404040;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .instructor-info {
    .instructor-name {
      color: #f8fafc;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    
    .instructor-specialization {
      color: #94a3b8;
      font-size: 0.8rem;
    }
  }
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.course-rating {
  .rating-stars {
    display: flex;
    gap: 2px;
    margin-bottom: 0.25rem;
    
    .star {
      font-size: 1rem;
      
      &.star--filled {
        color: #f59e0b;
      }
      
      &.star--half {
        background: linear-gradient(90deg, #f59e0b 50%, #64748b 50%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      &.star--empty {
        color: #64748b;
      }
    }
  }
  
  .rating-value {
    color: #94a3b8;
    font-size: 0.8rem;
  }
}

.course-pricing {
  text-align: right;
  
  .original-price {
    color: #94a3b8;
    font-size: 0.9rem;
    text-decoration: line-through;
    margin-bottom: 0.25rem;
  }
  
  .current-price {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
  }
}

.course-actions {
  display: flex;
  gap: 0.75rem;
  
  button {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  
  .btn-continue, .btn-start {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
    }
  }
  
  .btn-details {
    background: transparent;
    color: #94a3b8;
    border: 1px solid #2d2d2d;
    
    &:hover {
      border-color: #8b5cf6;
      color: #f8fafc;
    }
  }
}

.instructor-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--avatar-primary), var(--avatar-secondary));
  position: relative;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 60%;
    background: white;
    top: 20%;
    left: 20%;
    opacity: 0.8;
  }

  &[style*="circle"]::before {
    border-radius: 50%;
  }

  &[style*="square"]::before {
    border-radius: 4px;
  }

  &[style*="triangle"]::before {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    border-radius: 0;
  }

  &[style*="diamond"]::before {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    border-radius: 0;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .course-card {
    padding: 1rem;
  }
  
  .course-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .course-pricing {
    text-align: left;
  }
  
  .course-actions {
    flex-direction: column;
  }
}
</style>