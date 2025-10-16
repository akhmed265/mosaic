<template>
  <div 
    class="puzzle-flag"
    :class="[
      `puzzle--${shape}`,
      { 
        'puzzle--selected': isSelected,
        'puzzle--animated': isAnimated
      }
    ]"
    :style="puzzleStyle"
    @click="$emit('select', language)"
    @mouseenter="startHoverAnimation"
    @mouseleave="stopHoverAnimation"
  >
    <div class="puzzle__content">
      <span class="puzzle__flag">{{ language.flag }}</span>
      <span class="puzzle__name">{{ language.name }}</span>
      <div class="puzzle__connectors">
        <div v-for="connector in connectors" 
             :key="connector.position"
             class="puzzle__connector"
             :class="`connector--${connector.position}`"
             :style="connector.style">
        </div>
      </div>
    </div>
    
    <!-- Эффект выделения -->
    <div v-if="isSelected" class="puzzle__glow" :style="glowStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Language {
  id: string
  name: string
  flag: string
  color: string
}

interface Connector {
  position: 'top' | 'right' | 'bottom' | 'left'
  style: any
}

const props = defineProps<{
  language: Language
  isSelected: boolean
  shape: 'square' | 'circle' | 'diamond' | 'hexagon'
  position: number
}>()

defineEmits<{
  select: [language: Language]
}>()

// Анимация
const isAnimated = ref(false)
const hoverProgress = ref(0)

// Стили пазла
const puzzleStyle = computed(() => ({
  '--puzzle-color': props.language.color,
  '--puzzle-hover': hoverProgress.value,
  '--position-index': props.position
}))

const glowStyle = computed(() => ({
  background: `radial-gradient(circle, ${props.language.color}40 0%, transparent 70%)`
}))

// Коннекторы для пазлов (разные для каждой позиции)
const connectors = computed<Connector[]>(() => {
  const baseConnectors = [
    { position: 'top', style: {} },
    { position: 'right', style: {} },
    { position: 'bottom', style: {} },
    { position: 'left', style: {} }
  ]
  
  // В зависимости от позиции в сетке убираем некоторые коннекторы
  const row = Math.floor((props.position - 1) / 3)
  const col = (props.position - 1) % 3
  
  return baseConnectors.filter(connector => {
    if (row === 0 && connector.position === 'top') return false
    if (row === 1 && connector.position === 'bottom') return false
    if (col === 0 && connector.position === 'left') return false
    if (col === 2 && connector.position === 'right') return false
    return true
  })
})

// Анимации
const startHoverAnimation = () => {
  isAnimated.value = true
  hoverProgress.value = 1
}

const stopHoverAnimation = () => {
  if (!props.isSelected) {
    hoverProgress.value = 0
  }
}

onMounted(() => {
  // Запускаем начальную анимацию появления
  setTimeout(() => {
    isAnimated.value = true
  }, props.position * 100)
})
</script>

<style lang="scss" scoped>
.puzzle-flag {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: scale(0.8) rotate(calc(-5deg + 10deg * var(--position-index, 0)));
  opacity: 0;
  animation: puzzleAppear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: calc(0.1s * var(--position-index, 0));

  &.puzzle--animated {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  &.puzzle--selected {
    transform: scale(1.1) rotate(0deg);
    z-index: 10;
  }

  // Разные формы пазлов
  &.puzzle--square {
    .puzzle__content {
      clip-path: polygon(
        0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 
        100% 15%, 100% 85%, 85% 85%, 85% 100%, 
        15% 100%, 15% 85%, 0% 85%
      );
    }
  }

  &.puzzle--circle {
    .puzzle__content {
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
  }

  &.puzzle--diamond {
    .puzzle__content {
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    }
  }

  &.puzzle--hexagon {
    .puzzle__content {
      clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    }
  }
}

.puzzle__content {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--puzzle-color),
    color-mix(in srgb, var(--puzzle-color) 80%, white)
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 20px color-mix(in srgb, var(--puzzle-color) 30%, transparent),
    inset 0 1px 0 color-mix(in srgb, white 20%, transparent);
  
  .puzzle--selected & {
    box-shadow: 
      0 8px 40px color-mix(in srgb, var(--puzzle-color) 50%, transparent),
      0 0 0 2px color-mix(in srgb, var(--puzzle-color) 60%, transparent);
  }
}

.puzzle__flag {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.puzzle__name {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

// Коннекторы пазлов
.puzzle__connectors {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.puzzle__connector {
  position: absolute;
  background: inherit;
  border-radius: 4px;
  
  &.connector--top {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 12px;
  }
  
  &.connector--right {
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 24px;
  }
  
  &.connector--bottom {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 12px;
  }
  
  &.connector--left {
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 24px;
  }
}

// Эффект свечения
.puzzle__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140%;
  height: 140%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation: pulseGlow 2s ease-in-out infinite;
  z-index: -1;
}

// Анимации
@keyframes puzzleAppear {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-180deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

// Ховер эффекты
.puzzle-flag:hover {
  .puzzle__flag {
    transform: scale(1.2) rotate(5deg);
  }
  
  .puzzle__name {
    transform: translateY(-2px);
  }
}

// Адаптивность
@media (max-width: 768px) {
  .puzzle-flag {
    width: 100px;
    height: 100px;
    
    .puzzle__flag {
      font-size: 2rem;
    }
    
    .puzzle__name {
      font-size: 0.8rem;
    }
  }
}
</style>