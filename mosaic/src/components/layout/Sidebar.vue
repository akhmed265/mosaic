<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed }">
    <!-- Кнопка скрытия/показа -->
    <button class="sidebar__toggle" @click="toggleSidebar">
      <div class="toggle__arrow" :class="{ 'toggle__arrow--collapsed': isCollapsed }">
        ←
      </div>
    </button>

    <!-- Заголовок меню -->
    <div class="sidebar__header">
      <div class="user-avatar" :style="avatarStyle"></div>
      <div class="user-info" v-if="!isCollapsed">
        <h3 class="user-name">{{ userName }}</h3>
        <p class="user-status">Учащийся</p>
      </div>
    </div>

    <!-- Навигация -->
    <nav class="sidebar__nav">
      <a href="#courses" class="nav-item">
        <div class="nav-icon nav-icon--courses"></div>
        <span class="nav-text" v-if="!isCollapsed">Курсы</span>
      </a>
      
      <a href="#languages" class="nav-item">
        <div class="nav-icon nav-icon--languages"></div>
        <span class="nav-text" v-if="!isCollapsed">Языки</span>
      </a>
      
      <a href="#progress" class="nav-item">
        <div class="nav-icon nav-icon--progress"></div>
        <span class="nav-text" v-if="!isCollapsed">Карта развития</span>
      </a>
      
      <a href="#about" class="nav-item">
        <div class="nav-icon nav-icon--about"></div>
        <span class="nav-text" v-if="!isCollapsed">О нас</span>
      </a>
      
      <a href="#contact" class="nav-item">
        <div class="nav-icon nav-icon--contact"></div>
        <span class="nav-text" v-if="!isCollapsed">Контакты</span>
      </a>
    </nav>

    <!-- Логотип внизу -->
    <div class="sidebar__logo" v-if="!isCollapsed">
      <Logo size="small" />
    </div>

    <!-- Кнопки входа/регистрации -->
    <div class="sidebar__auth" v-if="!isCollapsed">
      <button class="auth-btn auth-btn--login">Вход</button>
      <button class="auth-btn auth-btn--register">Регистрация</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Logo from '@/components/common/Logo.vue'


const isCollapsed = ref(false)
const userName = ref('Akhmed Малачиев')

// Генерация уникальной аватарки
const avatarData = computed(() => {
  const shapes = ['circle', 'square', 'triangle', 'diamond']
  const colorPairs = [
    { primary: '#4f46e5', secondary: '#8b5cf6' },
    { primary: '#10b981', secondary: '#059669' },
    { primary: '#f59e0b', secondary: '#d97706' },
    { primary: '#ef4444', secondary: '#dc2626' },
    { primary: '#8b5cf6', secondary: '#7c3aed' }
  ]
  
  const shape = shapes[Math.floor(Math.random() * shapes.length)]
  const colors = colorPairs[Math.floor(Math.random() * colorPairs.length)]
  
  return {
    shape,
    colors
  }
})

const avatarStyle = computed(() => {
  return {
    '--avatar-primary': avatarData.value.colors.primary,
    '--avatar-secondary': avatarData.value.colors.secondary,
    '--avatar-shape': avatarData.value.shape
  }
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: $bg-card;
  box-shadow: $shadow-lg;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  font-family: 'Montserrat', sans-serif;
  border-right: 1px solid $border-dark;

  &--collapsed {
    width: 80px;
  }

  &__toggle {
    position: absolute;
    right: -12px;
    top: 20px;
    width: 24px;
    height: 24px;
    border: none;
    background: $primary-color;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .toggle__arrow {
    transition: transform 0.3s ease;
    
    &--collapsed {
      transform: rotate(180deg);
    }
  }

  &__header {
    padding: 2rem 1.5rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__nav {
    flex: 1;
    padding: 1.5rem 0;
  }

  &__auth {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.sidebar__header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid $border-dark;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Генерация аватарки
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--avatar-primary), var(--avatar-secondary));
  position: relative;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 60%;
    background: $white;
    top: 20%;
    left: 20%;
    opacity: 0.8;
  }

  // Применяем разные формы через CSS
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

.user-info {
  .user-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: $text-light;
    margin-bottom: 0.25rem;
  }

  .user-status {
    font-size: 0.875rem;
    color: $text-muted;
  }
}

// Навигационные элементы
.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: $text-light;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: $bg-light;
    border-left-color: $primary-color;
    color: $primary-color;
  }
}

.nav-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  &--courses {
    background: linear-gradient(45deg, #4f46e5, #8b5cf6);
    border-radius: 6px 2px 6px 2px;
  }

  &--languages {
    background: conic-gradient(from 45deg, #10b981, #06b6d4, #10b981);
    border-radius: 50% 20% 50% 20%;
  }

  &--progress {
    background: linear-gradient(135deg, #f59e0b, #f97316);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  &--about {
    background: radial-gradient(circle, #ef4444, #dc2626);
    border-radius: 2px 8px 2px 8px;
  }

  &--contact {
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 4px;
    transform: skewX(-10deg);
  }
}

.nav-text {
  font-weight: 500;
  white-space: nowrap;
}

// Кнопки авторизации
.auth-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: $border-radius;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;

  &--login {
    background: transparent;
    color: $primary-color;
    border: 2px solid $primary-color;

    &:hover {
      background: $primary-color;
      color: $text-light;
    }
  }

  &--register {
    background: $primary-color;
    color: $text-light;

    &:hover {
      background: darken($primary-color, 10%);
      transform: translateY(-2px);
    }
  }
}
</style>