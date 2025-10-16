<template>
  <div class="logo" :class="[sizeClass, { 'logo--collapsed': collapsed }]">
    <div class="puzzle-logo">
      <!-- Буква M -->
      <div class="puzzle-piece piece-m" data-letter="M">
        <span class="letter">M</span>
        <div class="connector connector-right"></div>
        <div class="connector connector-bottom"></div>
      </div>
      
      <!-- Буква O -->
      <div class="puzzle-piece piece-o" data-letter="O">
        <span class="letter">O</span>
        <div class="connector connector-left"></div>
        <div class="connector connector-bottom"></div>
        <div class="connector connector-right"></div>
      </div>
      
      <!-- Буква S -->
      <div class="puzzle-piece piece-s" data-letter="S">
        <span class="letter">S</span>
        <div class="connector connector-left"></div>
        <div class="connector connector-top"></div>
        <div class="connector connector-bottom"></div>
      </div>
      
      <!-- Буква A -->
      <div class="puzzle-piece piece-a" data-letter="A">
        <span class="letter">A</span>
        <div class="connector connector-top"></div>
        <div class="connector connector-right"></div>
        <div class="connector connector-bottom"></div>
      </div>
      
      <!-- Буква I -->
      <div class="puzzle-piece piece-i" data-letter="I">
        <span class="letter">I</span>
        <div class="connector connector-left"></div>
        <div class="connector connector-top"></div>
        <div class="connector connector-bottom"></div>
      </div>
      
      <!-- Буква C -->
      <div class="puzzle-piece piece-c" data-letter="C">
        <span class="letter">C</span>
        <div class="connector connector-top"></div>
        <div class="connector connector-left"></div>
      </div>
    </div>
    
    <h1 class="logo-text" v-if="!collapsed">MOSAIC</h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  collapsed?: boolean
  size?: 'small' | 'medium' | 'large'
}>()

const sizeClass = 'logo--medium' // по умолчанию
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 15px;
    
    &--small {
    .puzzle-logo {
      width: 50px;
      height: 35px;
    }
    
    .letter {
      font-size: 0.5rem;
    }
    
    .logo-text {
      display: none;
    }
  }

    &--medium {
    .puzzle-logo {
      width: 70px;
      height: 50px;
    }
    
    .letter {
      font-size: 0.7rem;
    }
  }

  &--large {
    .puzzle-logo {
      width: 90px;
      height: 65px;
    }

    .letter {
      font-size: 0.9rem;
    }
    
    .logo-text {
      font-size: 2rem;
    }
  }

    &--collapsed {
    justify-content: center;
    
    .logo-text {
      display: none;
    }
    
    .puzzle-logo {
      transform: scale(0.8);
    }
  }
}

.puzzle-logo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 3px;
  position: relative;
}

.puzzle-piece {
  position: relative;
  background: linear-gradient(135deg, $primary-color, #7c3aed);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.6rem;
  color: $text-light;
  transition: all 0.3s ease;

  // Размещение букв в сетке
  &.piece-m { grid-column: 1; grid-row: 1; }
  &.piece-o { grid-column: 2; grid-row: 1; }
  &.piece-s { grid-column: 3; grid-row: 1; }
  &.piece-a { grid-column: 1; grid-row: 2; }
  &.piece-i { grid-column: 2; grid-row: 2; }
  &.piece-c { grid-column: 3; grid-row: 2; }

  // Разные цвета для каждой буквы
  &.piece-m { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
  &.piece-o { background: linear-gradient(135deg, #10b981, #059669); }
  &.piece-s { background: linear-gradient(135deg, #f59e0b, #d97706); }
  &.piece-a { background: linear-gradient(135deg, #ef4444, #dc2626); }
  &.piece-i { background: linear-gradient(135deg, #06b6d4, #0891b2); }
  &.piece-c { background: linear-gradient(135deg, #f97316, #ea580c); }

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.2);
  }
}

.letter {
  position: relative;
  z-index: 2;
  font-family: $font-family;
  font-weight: 800;
}

// Коннекторы пазла
.connector {
  position: absolute;
  background: inherit;
  border-radius: 2px;

  &.connector-top {
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 4px;
  }

  &.connector-bottom {
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 4px;
  }

  &.connector-left {
    left: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 8px;
  }

  &.connector-right {
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 8px;
  }
}

.logo-text {
  font-family: $font-family;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, $primary-color, $secondary-color, $accent-color);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}
</style>