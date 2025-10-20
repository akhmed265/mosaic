<template>
  <div 
    class="skill-card"
    :class="`skill--${skill.status}`"
    :style="cardStyle"
    @click="handleClick"
  >
    <!-- Заголовок и иконка -->
    <div class="skill-header">
      <div class="skill-icon">
        {{ categoryIcon }}
      </div>
      <div class="skill-title-section">
        <h3 class="skill-title">{{ skill.title }}</h3>
        <div class="skill-level">Уровень {{ skill.level }}</div>
      </div>
    </div>

    <!-- Описание -->
    <p class="skill-description">{{ skill.description }}</p>

    <!-- Прогресс -->
    <div v-if="skill.status !== 'locked'" class="skill-progress">
      <ProgressBar
        :value="skill.progress"
        :color="languageColor"
        label="Прогресс"
        :show-info="true"
        :animated="true"
        :type="progressType"
      />
    </div>

    <!-- Мета-информация -->
    <div class="skill-meta">
      <div class="meta-item">
        <span class="meta-icon">⏱️</span>
        <span class="meta-text">{{ skill.duration }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">📝</span>
        <span class="meta-text">{{ skill.exercises }} упр.</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">⭐</span>
        <span class="meta-text">+{{ skill.xp }} XP</span>
      </div>
    </div>

    <!-- Статус -->
    <div class="skill-status">
      <div class="status-badge" :class="`status--${skill.status}`">
        {{ statusText }}
      </div>
      <div v-if="skill.status === 'available'" class="start-hint">
        Нажмите чтобы начать →
      </div>
    </div>

    <!-- Блокировка (если навык заблокирован) -->
    <div v-if="skill.status === 'locked'" class="skill-locked-overlay">
      <div class="locked-icon">🔒</div>
      <p>Изучите предыдущие навыки чтобы открыть</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Skill } from '@/types/learning'
import ProgressBar from '@/components/common/ProgressBar.vue'

const props = defineProps<{
  skill: Skill
  languageColor: string
}>()

const emit = defineEmits<{
  click: [skill: Skill]
}>()

// Иконки для категорий
const categoryIcon = {
  basics: '🔤',
  grammar: '📚',
  vocabulary: '📝',
  conversation: '💬',
  business: '💼'
}[props.skill.category]

// Текст статуса
const statusText = {
  locked: 'Заблокировано',
  available: 'Доступно',
  completed: 'Завершено'
}[props.skill.status]

// Тип прогресс-бара в зависимости от прогресса
const progressType = computed(() => {
  if (props.skill.progress >= 90) return 'success'
  if (props.skill.progress >= 70) return 'warning'
  return 'default'
})

// Стиль карточки
const cardStyle = {
  '--skill-color': props.languageColor
}

// Обработчик клика
const handleClick = () => {
  if (props.skill.status !== 'locked') {
    emit('click', props.skill)
  }
}
</script>

<style lang="scss" scoped>
.skill-card {
  background: #1a1a1a;
  border: 2px solid;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;

  // Статусы навыков
  &.skill--completed {
    border-color: #10b981;
    background: linear-gradient(135deg, #1a1a1a, #10b98120);
    
    &:hover {
      border-color: #10b981;
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.2);
    }
  }
  
  &.skill--available {
    border-color: var(--skill-color);
    background: linear-gradient(135deg, #1a1a1a, color-mix(in srgb, var(--skill-color) 20%, transparent));
    
    &:hover {
      border-color: color-mix(in srgb, var(--skill-color) 80%, white);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px color-mix(in srgb, var(--skill-color) 30%, transparent);
    }
  }
  
  &.skill--locked {
    border-color: #64748b;
    background: #2d2d2d;
    cursor: not-allowed;
    opacity: 0.7;
    
    &:hover {
      border-color: #94a3b8;
    }
  }
}

.skill-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.skill-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.skill-title-section {
  flex: 1;
  
  .skill-title {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }
  
  .skill-level {
    color: #94a3b8;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.skill-description {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.skill-progress {
  margin-bottom: 1.5rem;
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    
    .progress-text {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .progress-percent {
      color: var(--skill-color);
      font-size: 0.9rem;
      font-weight: 700;
    }
  }
  
  .progress-bar {
    height: 6px;
    background: #2d2d2d;
    border-radius: 3px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease;
    }
  }
}

.skill-meta {
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

.skill-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &.status--completed {
    background: #10b981;
    color: white;
  }
  
  &.status--available {
    background: var(--skill-color);
    color: white;
  }
  
  &.status--locked {
    background: #64748b;
    color: white;
  }
}

.start-hint {
  color: var(--skill-color);
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.skill--available:hover .start-hint {
  opacity: 1;
}

.skill-locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  
  .locked-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #94a3b8;
    font-size: 0.9rem;
    text-align: center;
    max-width: 80%;
  }
}

// Анимация появления
.skill-card {
  animation: cardAppear 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes cardAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Задержки для анимации
.skill-card:nth-child(1) { animation-delay: 0.1s; }
.skill-card:nth-child(2) { animation-delay: 0.2s; }
.skill-card:nth-child(3) { animation-delay: 0.3s; }
.skill-card:nth-child(4) { animation-delay: 0.4s; }
.skill-card:nth-child(5) { animation-delay: 0.5s; }
</style>