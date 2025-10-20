<template>
  <div class="user-header">
    <div class="user-main-info">
      <!-- Аватар -->
      <div class="user-avatar" :style="avatarStyle">
        <div class="avatar-initial">{{ userInitial }}</div>
        <div class="level-badge">Ур. {{ userData.level }}</div>
      </div>

      <!-- Информация -->
      <div class="user-details">
        <h1 class="user-name">{{ userData.name }}</h1>
        <p class="user-status">{{ userData.status }}</p>
        
        <!-- XP Counter -->
        <XPCounter
          :xp="userData.xp"
          :level="userData.level"
          :show-level="false"
          :show-progress="true"
          size="medium"
          class="profile-xp-counter"
        />
      </div>
    </div>

    <!-- Статистика -->
    <div class="user-stats">
      <div class="stat-item">
        <div class="stat-value">{{ userData.stats.completedLessons }}</div>
        <div class="stat-label">Уроков</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ userData.stats.studyDays }}</div>
        <div class="stat-label">Дней</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ userData.stats.achievements }}</div>
        <div class="stat-label">Достижений</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ userData.stats.streak }}</div>
        <div class="stat-label">Стрик</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import XPCounter from '@/components/common/XPCounter.vue'

// Данные пользователя (пока заглушка)
const userData = {
  name: 'Ахмед Малачиев',
  status: 'Изучает Английский',
  level: 5,
  xp: 1250,
  stats: {
    completedLessons: 42,
    studyDays: 28,
    achievements: 8,
    streak: 7
  }
}

// Инициалы для аватара
const userInitial = computed(() => {
  return userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

// Стиль аватара
const avatarStyle = computed(() => {
  const colors = [
    { primary: '#8b5cf6', secondary: '#7c3aed' },
    { primary: '#10b981', secondary: '#059669' },
    { primary: '#f59e0b', secondary: '#d97706' },
    { primary: '#ef4444', secondary: '#dc2626' },
    { primary: '#06b6d4', secondary: '#0ea5e9' }
  ]
  
  const color = colors[userData.level % colors.length]
  
  return {
    '--avatar-primary': color.primary,
    '--avatar-secondary': color.secondary
  }
})
</script>

<style lang="scss" scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
  margin-bottom: 2rem;
}

.user-main-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--avatar-primary), var(--avatar-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  
  .level-badge {
    position: absolute;
    bottom: -8px;
    right: -8px;
    background: #8b5cf6;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    border: 3px solid #1a1a1a;
  }
}

.user-details {
  .user-name {
    color: #f8fafc;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .user-status {
    color: #94a3b8;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
}

.profile-xp-counter {
  max-width: 200px;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  
  .stat-value {
    color: #f8fafc;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 600;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .user-main-info {
    flex-direction: column;
  }
  
  .user-stats {
    gap: 1.5rem;
  }
  
  .stat-item {
    .stat-value {
      font-size: 1.25rem;
    }
  }
}
</style>